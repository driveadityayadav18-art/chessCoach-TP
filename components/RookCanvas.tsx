'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Lenis from 'lenis';

const ROOK_ROTATION: [number, number, number] = [0, 0, 0];
const ROOK_GLB = '/rook.glb';

/**
 * Editorial Desktop Flight Stations (>= 768px)
 * 0: Hero -> Right flank focal sculpture
 * 1: Match-Reel Cinema -> Retreats cleanly to far left flank so the film canvas stays unobstructed
 * 2: Method -> Left flank
 * 3: Curriculum -> Perched on Chessboard Workbench (DOM-tracked)
 * 4: Pedigree & Access -> Right edge sculptural accent
 * 5: Footer -> Sinks cleanly out of frame
 */
const KEYFRAMES_DESKTOP = [
  { x: 0.30,  y: -0.02, z: 0.00,  s: 1.05, yaw: 18,  pitch: 4,  roll: -1 }, // 0: Hero
  { x: -0.58, y: 0.14,  z: -0.35, s: 0.56, yaw: -32, pitch: 2,  roll:  2 }, // 1: Match Reel (flank)
  { x: -0.35, y: -0.02, z: -0.15, s: 0.94, yaw: -25, pitch: 4,  roll:  3 }, // 2: Method
  { x: 0.36,  y: -0.10, z: -0.08, s: 0.68, yaw: 28,  pitch: 4,  roll: -1 }, // 3: Curriculum (Perched)
  { x: 0.38,  y: -0.04, z: -0.14, s: 0.82, yaw: 38,  pitch: -2, roll: -3 }, // 4: Access
  { x: 0.45,  y: -2.50, z: -0.40, s: 0.30, yaw: 10,  pitch:  0, roll:  0 }, // 5: Footer
];

/**
 * Mobile Flight Stations (< 768px): peripheral right-edge framing clear of boards and copy
 */
const KEYFRAMES_MOBILE = [
  { x: 0.56, y: -0.34, z: -0.15, s: 0.40, yaw: 28,  pitch: 6,  roll: -4 },
  { x: 0.68, y: -0.46, z: -0.35, s: 0.30, yaw: -18, pitch: 4,  roll:  2 },
  { x: 0.62, y: -0.38, z: -0.20, s: 0.36, yaw: -22, pitch: 3,  roll:  2 },
  { x: 0.68, y: -0.48, z: -0.30, s: 0.32, yaw: 24,  pitch: 2,  roll: -1 },
  { x: 0.62, y: -0.38, z: -0.22, s: 0.36, yaw: 30,  pitch: -2, roll: -2 },
  { x: 0.62, y: -2.50, z: -0.40, s: 0.22, yaw: 0,   pitch: 0,  roll:  0 },
];

const splineDesktop = new THREE.CatmullRomCurve3(
  KEYFRAMES_DESKTOP.map((k) => new THREE.Vector3(k.x, k.y, k.z)),
  false,
  'centripetal',
  0.5
);

const splineMobile = new THREE.CatmullRomCurve3(
  KEYFRAMES_MOBILE.map((k) => new THREE.Vector3(k.x, k.y, k.z)),
  false,
  'centripetal',
  0.5
);

function lerpAngle(a: number, b: number, t: number) {
  const d = ((b - a + 540) % 360) - 180;
  return a + d * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function smoothstepQuintic(t: number): number {
  const ct = clamp(t, 0, 1);
  return ct * ct * ct * (ct * (ct * 6 - 15) + 10);
}

interface LayoutCache {
  tops: number[];
  perchDoc: { x: number; docY: number } | null;
  vw: number;
  vh: number;
}

const SECTION_IDS = ['top', 'reel', 'about', 'curriculum', 'access', 'contact'];

function targetAt(p: number, isMobile: boolean) {
  const K = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES_DESKTOP;
  const n = K.length - 1;
  const clampedP = clamp(p, 0, n);
  const u = clampedP / n;

  const spline = isMobile ? splineMobile : splineDesktop;
  const pos = spline.getPoint(u);

  const idx = Math.min(n - 1, Math.floor(clampedP));
  const frac = clampedP - idx;

  const liftFactor = idx === 0 ? 0.14 : idx === 1 ? 0.12 : idx === 2 ? 0.14 : idx === 3 ? 0.08 : 0.03;
  const lift = Math.sin(frac * Math.PI) * liftFactor;

  const k0 = K[idx];
  const k1 = K[idx + 1] || k0;
  const t = frac * frac * (3 - 2 * frac);

  const s = THREE.MathUtils.lerp(k0.s, k1.s, t) * (1 + Math.sin(frac * Math.PI) * 0.03);
  const yaw = lerpAngle(k0.yaw, k1.yaw, t);
  const pitch = THREE.MathUtils.lerp(k0.pitch, k1.pitch, t);
  const roll = THREE.MathUtils.lerp(k0.roll, k1.roll, t);

  return {
    x: pos.x,
    y: pos.y + lift,
    z: pos.z,
    s,
    yaw,
    pitch,
    roll,
  };
}

export default function RookCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let isDestroyed = false;
    let animId = 0;
    let pageLoaded = false;
    let modelLoaded = false;
    let contextLost = false;

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const layoutCache: LayoutCache = {
      tops: [0, 800, 1600, 2400, 3200, 4000],
      perchDoc: null,
      vw: typeof window !== 'undefined' ? window.innerWidth : 1200,
      vh: typeof window !== 'undefined' ? window.innerHeight : 800,
    };

    const updateLayoutCache = () => {
      if (typeof document === 'undefined') return;
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
        Boolean
      ) as HTMLElement[];

      if (elements.length >= 2) {
        const tops = elements.map((el) => {
          const rect = el.getBoundingClientRect();
          return Math.max(0, rect.top + scrollY);
        });

        for (let i = 1; i < tops.length; i++) {
          if (tops[i] <= tops[i - 1]) {
            tops[i] = tops[i - 1] + vh;
          }
        }
        layoutCache.tops = tops;
      }

      const perchEl = document.querySelector<HTMLElement>('[data-rook-perch="true"]');
      if (perchEl && vw >= 1024) {
        const rect = perchEl.getBoundingClientRect();
        const cardCornerX = rect.right - Math.min(rect.width * 0.14, 84);
        const cardTopY = rect.top + scrollY;
        layoutCache.perchDoc = {
          x: (cardCornerX / vw) * 2 - 1,
          docY: cardTopY,
        };
      } else {
        layoutCache.perchDoc = null;
      }

      layoutCache.vw = vw;
      layoutCache.vh = vh;
    };

    updateLayoutCache();

    const getProgressFromScroll = (scrollY: number): number => {
      const { tops, vh } = layoutCache;
      if (!tops || tops.length < 2) return scrollY / vh;
      if (scrollY <= tops[0]) return 0;
      const maxIdx = tops.length - 1;
      if (scrollY >= tops[maxIdx]) return maxIdx;

      for (let i = 0; i < maxIdx; i++) {
        const start = tops[i];
        const end = tops[i + 1];
        if (scrollY >= start && scrollY <= end) {
          const dist = end - start;
          if (dist <= 0) return i;
          return i + (scrollY - start) / dist;
        }
      }
      return 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    function markLoaded(modelReady = false) {
      if (!pageLoaded) {
        pageLoaded = true;
        document.body.classList.add('loaded');
        (window as unknown as { __rookReady?: boolean }).__rookReady = true;
        window.dispatchEvent(
          new CustomEvent('rook-scene-ready', { detail: { modelReady } })
        );
      }
      if (modelReady && canvas) {
        canvas.classList.add('ready');
      }
    }

    const fallbackTimeout = setTimeout(() => {
      markLoaded(false);
    }, 2000);

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let flight: THREE.Group | null = null;
    let pieceRoot: THREE.Group | null = null;
    let holder: THREE.Group | null = null;
    let keyLight: THREE.DirectionalLight | null = null;
    let fillLight: THREE.DirectionalLight | null = null;
    let copperRimLight: THREE.DirectionalLight | null = null;
    let crownLight: THREE.SpotLight | null = null;
    let shadowMat: THREE.MeshBasicMaterial | null = null;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      scene = new THREE.Scene();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 10);

      // Calibrated Three-Point Studio Lighting + Warm Kiln Ember Rim
      const hemiLight = new THREE.HemisphereLight(0xf7efe4, 0x1c1714, 0.85);
      scene.add(hemiLight);

      // Key Light (Warm tungsten-cream front-right)
      keyLight = new THREE.DirectionalLight(0xf7efe4, 2.55);
      keyLight.position.set(4.5, 5.2, 5.8);
      scene.add(keyLight);

      // Muted Slate Fill Light
      fillLight = new THREE.DirectionalLight(0x94a3b8, 1.15);
      fillLight.position.set(-5.2, 1.8, 3.5);
      scene.add(fillLight);

      // Sculpted Kiln Ember Rim Light separating silhouette from ash ground
      copperRimLight = new THREE.DirectionalLight(0xd96e2c, 3.0);
      copperRimLight.position.set(-4.2, 3.4, -3.8);
      scene.add(copperRimLight);

      // Crisp Back-Right Rim Accent
      const backRimLight = new THREE.DirectionalLight(0xf3dec4, 1.9);
      backRimLight.position.set(3.8, 4.2, -4.5);
      scene.add(backRimLight);

      // Overhead Crown Specular Accent
      crownLight = new THREE.SpotLight(0xffcfa3, 2.2, 18, Math.PI / 5, 0.65, 1.2);
      crownLight.position.set(0.5, 6.0, 2.0);
      scene.add(crownLight);

      flight = new THREE.Group();
      pieceRoot = new THREE.Group();
      holder = new THREE.Group();
      scene.add(flight);
      flight.add(pieceRoot);
      pieceRoot.add(holder);

      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
        sGrad.addColorStop(0, 'rgba(217, 110, 44, 0.16)');
        sGrad.addColorStop(0.35, 'rgba(22, 18, 16, 0.28)');
        sGrad.addColorStop(0.7, 'rgba(14, 11, 9, 0.08)');
        sGrad.addColorStop(1, 'rgba(14, 11, 9, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(1.65, 1.65);
      shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.65,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(0, -0.52, 0);
      flight.add(shadowMesh);

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        ROOK_GLB,
        (gltf) => {
          if (isDestroyed) return;
          clearTimeout(fallbackTimeout);
          const model = gltf.scene;

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.frustumCulled = false;
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat) {
                if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 1.25;
                if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness, 0.42);
                if (mat.metalness !== undefined) mat.metalness = Math.max(mat.metalness, 0.18);
              }
            }
          });

          if (holder) {
            holder.add(model);
            model.rotation.set(...ROOK_ROTATION);

            const box = new THREE.Box3().setFromObject(holder);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
              model.scale.setScalar(1 / maxDim);
            }
            box.setFromObject(holder);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
          }

          modelLoaded = true;
          markLoaded(true);
        },
        undefined,
        (err) => {
          console.error('GLTF loading error:', err);
          markLoaded(false);
        }
      );
    } catch (err) {
      console.error('WebGL init error:', err);
      canvas.style.display = 'none';
      markLoaded(false);
    }

    let lenis: Lenis | null = null;
    if (!prefersReducedMotion) {
      try {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 1.8,
        });
        (window as unknown as { __lenis: Lenis }).__lenis = lenis;
      } catch {
        // Fallback to native scroll
      }
    }

    const sections = document.querySelectorAll('main > section, footer');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => revealObserver.observe(s));

    const updateScrollEffects = () => {
      const vh = window.innerHeight;
      const checkY = vh * 0.1;
      let isDark = false;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= checkY && rect.bottom >= checkY) {
          if (sec.getAttribute('data-theme') === 'dark') {
            isDark = true;
          }
          break;
        }
      }
      document.body.classList.toggle('on-dark', isDark);
    };

    if (lenis) {
      lenis.on('scroll', updateScrollEffects);
    }
    window.addEventListener('scroll', updateScrollEffects, { passive: true });
    updateScrollEffects();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      updateLayoutCache();
      updateScrollEffects();
    };
    window.addEventListener('resize', handleResize);

    // Refresh layout cache slightly after mount so dynamic components report accurate heights
    const cacheTimer = setTimeout(updateLayoutCache, 600);

    let tabHopImpulse = 0;
    let tabTiltImpulse = 0;
    const handleTabChange = (e: Event) => {
      if (prefersReducedMotion) return;
      const customEvent = e as CustomEvent<{ index: number }>;
      const idx = customEvent.detail?.index ?? 0;
      tabHopImpulse = 0.055;
      tabTiltImpulse = idx % 2 === 0 ? 5 : -5;
    };
    window.addEventListener('chess-tab-change', handleTabChange);

    const initialTarget = targetAt(0, typeof window !== 'undefined' && window.innerWidth < 768);
    const cur = {
      x: initialTarget.x,
      y: initialTarget.y,
      z: initialTarget.z,
      s: initialTarget.s,
      yaw: initialTarget.yaw,
      pitch: initialTarget.pitch,
      roll: initialTarget.roll,
      bankRoll: 0,
      bankPitch: 0,
    };

    const clock = new THREE.Clock();

    const animate = (time: number) => {
      if (isDestroyed) return;
      animId = requestAnimationFrame(animate);

      if (lenis) {
        lenis.raf(time);
      }

      if (contextLost || !renderer || !scene || !camera || !flight || !pieceRoot) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = prefersReducedMotion ? 0 : clock.getElapsedTime();

      const scrollY = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset || 0);
      const isMobile = window.innerWidth < 768;
      const p = getProgressFromScroll(scrollY);
      const target = targetAt(p, isMobile);

      const curriculumIdx = SECTION_IDS.indexOf('curriculum');
      const targetPerchP = curriculumIdx >= 0 ? curriculumIdx : 3.0;
      const perchDist = Math.abs(p - targetPerchP);
      const perchBlendRange = 0.45;
      const perchProximity = perchDist < perchBlendRange ? 1 - perchDist / perchBlendRange : 0;
      const perchWeight = smoothstepQuintic(perchProximity);
      const hoverScale = prefersReducedMotion ? 0 : 1 - perchWeight;

      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = Math.tan(fovRad / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;

      if (!isMobile && layoutCache.vw >= 1024 && perchWeight > 0.001 && layoutCache.perchDoc) {
        const { x: clipX, docY } = layoutCache.perchDoc;
        const currentScreenTopY = docY - scrollY;
        const clipTopY = 1 - 2 * (currentScreenTopY / layoutCache.vh);

        const rookWorldHeight = halfH * 2 * 0.36 * cur.s;
        const baseOffsetNDC = (rookWorldHeight * 0.5) / halfH;
        const perchTargetY = clipTopY + baseOffsetNDC + 0.04;

        target.x = THREE.MathUtils.lerp(target.x, clipX, perchWeight);
        target.y = THREE.MathUtils.lerp(target.y, perchTargetY, perchWeight);
      }

      target.y += tabHopImpulse;
      target.yaw += tabTiltImpulse;

      tabHopImpulse = THREE.MathUtils.damp(tabHopImpulse, 0, 8.0, dt);
      tabTiltImpulse = THREE.MathUtils.damp(tabTiltImpulse, 0, 6.0, dt);

      const prevX = cur.x;
      const prevY = cur.y;

      const dampFactor = prefersReducedMotion ? 100 : 8.2;
      cur.x = THREE.MathUtils.damp(cur.x, target.x, dampFactor, dt);
      cur.y = THREE.MathUtils.damp(cur.y, target.y, dampFactor, dt);
      cur.z = THREE.MathUtils.damp(cur.z, target.z, dampFactor, dt);

      cur.s = THREE.MathUtils.damp(cur.s, target.s, 7.0, dt);
      cur.yaw = lerpAngle(cur.yaw, target.yaw, 1 - Math.exp(-dt * 6.5));
      cur.pitch = THREE.MathUtils.damp(cur.pitch, target.pitch, 6.0, dt);
      cur.roll = THREE.MathUtils.damp(cur.roll, target.roll, 6.0, dt);

      const latVel = (cur.x - prevX) / Math.max(dt, 0.001);
      const vertVel = (cur.y - prevY) / Math.max(dt, 0.001);

      const targetBankRoll = cur.roll - (prefersReducedMotion ? 0 : clamp(latVel * 15.0, -16, 16));
      const targetBankPitch = cur.pitch - (prefersReducedMotion ? 0 : clamp(vertVel * 12.0, -10, 10));
      cur.bankRoll = THREE.MathUtils.damp(cur.bankRoll, targetBankRoll, 7.0, dt);
      cur.bankPitch = THREE.MathUtils.damp(cur.bankPitch, targetBankPitch, 7.0, dt);

      mouse.sx = THREE.MathUtils.damp(mouse.sx, mouse.x, 3.5, dt);
      mouse.sy = THREE.MathUtils.damp(mouse.sy, mouse.y, 3.5, dt);

      const hover = (Math.sin(t * 1.5) * 0.022 + Math.sin(t * 2.4) * 0.009) * hoverScale;

      // Dynamic copper rim intensity across sections
      if (copperRimLight) {
        const accessProximity = Math.max(0, 1 - Math.abs(p - 4.0) * 1.1);
        const heroProximity = Math.max(0, 1 - p * 1.3);
        copperRimLight.intensity = 2.1 + Math.pow(accessProximity, 1.4) * 2.1 + heroProximity * 1.1;
        if (keyLight) keyLight.intensity = 2.45 - accessProximity * 0.45;
        if (fillLight) fillLight.intensity = 1.1 + accessProximity * 0.35;
      }

      if (shadowMat) {
        shadowMat.opacity = clamp(0.65 * (1 - p * 0.8), 0, 0.65);
      }

      // Gently lower Rook opacity while traversing Match-Reel Cinema (#reel, p ~ 1.0) and fade out before Footer
      if (canvas && modelLoaded) {
        const reelFade = 1 - Math.max(0, 1 - Math.abs(p - 1.0) * 1.65) * 0.72;
        const footerExitAlpha = p < 4.55 ? 1 : clamp(1 - (p - 4.55) / 0.35, 0, 1);
        const finalAlpha = Math.min(reelFade, footerExitAlpha);
        canvas.style.opacity = `${finalAlpha}`;
        canvas.style.visibility = finalAlpha <= 0.001 ? 'hidden' : 'visible';
      }

      flight.position.set(
        cur.x * halfW + Math.sin(t * 1.1) * 0.012 * hoverScale + mouse.sx * 0.04,
        cur.y * halfH + hover * halfH * 0.32 + mouse.sy * 0.03 * hoverScale,
        cur.z + Math.sin(t * 0.8) * 0.05 * hoverScale
      );

      flight.scale.setScalar(halfH * 2 * 0.36 * cur.s);

      const yawRad = THREE.MathUtils.degToRad(cur.yaw + mouse.sx * 5.0);
      flight.rotation.set(0, yawRad, 0);

      pieceRoot.rotation.set(
        THREE.MathUtils.degToRad(cur.bankRoll),
        0,
        THREE.MathUtils.degToRad(cur.bankPitch + mouse.sy * 2.0),
        'YZX'
      );

      if (modelLoaded) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animId);
      clearTimeout(fallbackTimeout);
      clearTimeout(cacheTimer);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('chess-tab-change', handleTabChange);
      window.removeEventListener('scroll', updateScrollEffects);
      revealObserver.disconnect();
      if (lenis) {
        lenis.destroy();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas id="rook" ref={canvasRef} aria-hidden="true" style={{ zIndex: 35, pointerEvents: 'none' }} />
  );
}
