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
 * 0: Hero -> Right flank
 * 1: Method -> Left flank
 * 2: Training Arsenal -> Perched on Card 04 (DOM-tracked)
 * 3: Titleholders -> In front of luxury dark card
 * 4: Footer -> Sinks into floor
 */
const KEYFRAMES_DESKTOP = [
  { x: 0.00,  y: -0.02, z: 0.00,  s: 1.15, yaw: 16,  pitch: 4,  roll: -1 }, // 0: Hero
  { x: -0.35, y: -0.02, z: -0.15, s: 0.95, yaw: -25, pitch: 4,  roll:  3 }, // 1: Method
  { x: 0.36,  y: -0.10, z: -0.08, s: 0.68, yaw: 28,  pitch: 4,  roll: -1 }, // 2: Curriculum (Perched on Card 04)
  { x: 0.35,  y: -0.04, z: -0.12, s: 0.85, yaw: 38,  pitch: -2, roll: -3 }, // 3: Titleholders
  { x: 0.45,  y: -2.50, z: -0.40, s: 0.30, yaw: 10,  pitch:  0, roll:  0 }, // 4: Footer (sinks cleanly away)
];

/**
 * Mobile Flight Stations (< 768px)
 */
const KEYFRAMES_MOBILE = [
  { x: 0.00, y: 0.15,  z: 0.00,  s: 0.58, yaw: 25,  pitch: 8,  roll: -6 },
  { x: 0.00, y: 0.22,  z: -0.10, s: 0.55, yaw: -20, pitch: 3,  roll: 2 },
  { x: 0.00, y: 0.05,  z: -0.05, s: 0.50, yaw: 25,  pitch: 2,  roll: -1 },
  { x: 0.00, y: 0.18,  z: -0.08, s: 0.55, yaw: 30,  pitch: -2, roll: -2 },
  { x: 0.00, y: -2.50, z: -0.30, s: 0.25, yaw: 0,   pitch: 0,  roll: 0 },
];

// Continuous 3D Catmull-Rom Splines for C1-smooth spatial navigation
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

/**
 * Quintic smoothstep for seamless, jerk-free landing on Card 04
 * S(t) = 6t^5 - 15t^4 + 10t^3
 */
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

const SECTION_IDS = ['top', 'about', 'curriculum', 'access', 'contact'];

/**
 * Evaluates continuous spline trajectory and dynamic targets at fractional progress p in [0, 4]
 */
function targetAt(p: number, isMobile: boolean) {
  const K = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES_DESKTOP;
  const n = K.length - 1;
  const clampedP = clamp(p, 0, n);
  const u = clampedP / n;

  const spline = isMobile ? splineMobile : splineDesktop;
  const pos = spline.getPoint(u);

  const idx = Math.min(n - 1, Math.floor(clampedP));
  const frac = clampedP - idx;

  // Continuous parabolic lift arc during inter-station travel
  const liftFactor = idx === 0 ? 0.16 : idx === 1 ? 0.14 : idx === 2 ? 0.08 : 0.03;
  const lift = Math.sin(frac * Math.PI) * liftFactor;

  // Smooth scalar interpolation (Scale, Yaw, Pitch, Roll) using smooth Hermite curve
  const k0 = K[idx];
  const k1 = K[idx + 1] || k0;
  const t = frac * frac * (3 - 2 * frac);

  const s = THREE.MathUtils.lerp(k0.s, k1.s, t) * (1 + Math.sin(frac * Math.PI) * 0.035);
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
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    if (!canvas) return;

    let isDestroyed = false;
    let animId = 0;
    let pageLoaded = false;
    let modelLoaded = false;

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    // Layout Cache: zero DOM reflows inside requestAnimationFrame loop
    const layoutCache: LayoutCache = {
      tops: [0, 800, 1600, 2400, 3200],
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

        // Ensure strictly increasing section offsets
        for (let i = 1; i < tops.length; i++) {
          if (tops[i] <= tops[i - 1]) {
            tops[i] = tops[i - 1] + vh;
          }
        }
        layoutCache.tops = tops;
      }

      const perchEl = document.querySelector<HTMLElement>('[data-rook-perch="true"]');
      if (perchEl) {
        const rect = perchEl.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardTopY = rect.top + scrollY;
        layoutCache.perchDoc = {
          x: (cardCenterX / vw) * 2 - 1,
          docY: cardTopY,
        };
      } else {
        layoutCache.perchDoc = null;
      }

      layoutCache.vw = vw;
      layoutCache.vh = vh;
    };

    updateLayoutCache();

    // Fast, reflow-free section progress lookup via cached tops
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
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    function markLoaded(modelReady = false) {
      if (!pageLoaded) {
        pageLoaded = true;
        if (loader) {
          loader.classList.add('done');
        }
        document.body.classList.add('loaded');
      }
      if (modelReady && canvas) {
        canvas.classList.add('ready');
      }
    }

    const fallbackTimeout = setTimeout(() => {
      markLoaded(false);
    }, 2500);

    // Three.js instances
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let flight: THREE.Group | null = null;
    let pieceRoot: THREE.Group | null = null;
    let holder: THREE.Group | null = null;
    let dirLight1: THREE.DirectionalLight | null = null;
    let dirLight2: THREE.DirectionalLight | null = null;
    let clayRimLight: THREE.DirectionalLight | null = null;
    let shadowMat: THREE.MeshBasicMaterial | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      scene = new THREE.Scene();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 10);

      // Clean Obsidian Studio Lighting (Sculptural Marble & Amber Rim)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x050508, 1.2);
      scene.add(hemiLight);

      dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
      dirLight1.position.set(4, 5, 6);
      scene.add(dirLight1);

      dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 1.8);
      dirLight2.position.set(-5, 2, -4);
      scene.add(dirLight2);

      // Warm Amber Micro-Voltage Rim Light (#FF801F)
      clayRimLight = new THREE.DirectionalLight(0xff801f, 1.4);
      clayRimLight.position.set(-4, 3, -3);
      scene.add(clayRimLight);

      const studioRimLight = new THREE.DirectionalLight(0xffffff, 2.8);
      studioRimLight.position.set(3.5, 4, -4);
      scene.add(studioRimLight);

      flight = new THREE.Group();
      pieceRoot = new THREE.Group();
      holder = new THREE.Group();
      scene.add(flight);
      flight.add(pieceRoot);
      pieceRoot.add(holder);

      // Soft Ground Contact Shadow Disc
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
        sGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
        sGrad.addColorStop(0.3, 'rgba(15, 23, 42, 0.18)');
        sGrad.addColorStop(0.65, 'rgba(15, 23, 42, 0.04)');
        sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
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
              if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).envMapIntensity !== undefined) {
                (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.0;
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

    // Initialize Lenis smooth scroll
    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      });

      (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    } catch (e) {
      console.warn('Lenis setup note:', e);
    }

    // Scroll reveal observer
    const sections = document.querySelectorAll('main > section, footer');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.25 }
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

    // Kinetic reaction when user switches curriculum pillar tabs
    let tabHopImpulse = 0;
    let tabTiltImpulse = 0;
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      const idx = customEvent.detail?.index ?? 0;
      tabHopImpulse = 0.055;
      tabTiltImpulse = idx % 2 === 0 ? 5 : -5;
    };
    window.addEventListener('chess-tab-change', handleTabChange);

    // Initial state matching station 0
    const initialTarget = targetAt(0, window.innerWidth < 768);
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

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = (time: number) => {
      if (isDestroyed) return;
      animId = requestAnimationFrame(animate);

      if (lenis) {
        lenis.raf(time);
      }

      if (!renderer || !scene || !camera || !flight || !pieceRoot) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      const scrollY = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset || 0);
      const isMobile = window.innerWidth < 768;
      const p = getProgressFromScroll(scrollY);
      const target = targetAt(p, isMobile);

      // --- Seamless Card 04 Perch Landing (Quintic Smoothstep Blending) ---
      // Evaluates landing coordinates using cached document Y (zero reflows)
      const curriculumIdx = SECTION_IDS.indexOf('curriculum');
      const targetPerchP = curriculumIdx >= 0 ? curriculumIdx : 3.0;
      const perchDist = Math.abs(p - targetPerchP);
      const perchBlendRange = 0.45;
      const perchProximity = perchDist < perchBlendRange ? 1 - perchDist / perchBlendRange : 0;
      const perchWeight = smoothstepQuintic(perchProximity);
      const hoverScale = 1 - perchWeight;

      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = Math.tan(fovRad / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;

      if (perchWeight > 0.001 && layoutCache.perchDoc) {
        const { x: clipX, docY } = layoutCache.perchDoc;
        const currentScreenTopY = docY - scrollY;
        const clipTopY = 1 - 2 * (currentScreenTopY / layoutCache.vh);

        const rookWorldHeight = halfH * 2 * 0.36 * cur.s;
        const baseOffsetNDC = (rookWorldHeight * 0.5) / halfH;
        const perchTargetY = clipTopY + baseOffsetNDC + 0.04;

        target.x = THREE.MathUtils.lerp(target.x, clipX, perchWeight);
        target.y = THREE.MathUtils.lerp(target.y, perchTargetY, perchWeight);
      }

      // Add kinetic tab hop & tilt impulse (active in Curriculum)
      target.y += tabHopImpulse;
      target.yaw += tabTiltImpulse;

      tabHopImpulse = THREE.MathUtils.damp(tabHopImpulse, 0, 8.0, dt);
      tabTiltImpulse = THREE.MathUtils.damp(tabTiltImpulse, 0, 6.0, dt);

      // --- Frame-Rate Independent Exponential Damping (THREE.MathUtils.damp) ---
      // Mathematically identical behavior at 60Hz, 120Hz, and 144Hz displays
      const prevX = cur.x;
      const prevY = cur.y;

      cur.x = THREE.MathUtils.damp(cur.x, target.x, 8.2, dt);
      cur.y = THREE.MathUtils.damp(cur.y, target.y, 8.2, dt);
      cur.z = THREE.MathUtils.damp(cur.z, target.z, 8.2, dt);

      cur.s = THREE.MathUtils.damp(cur.s, target.s, 7.0, dt);
      cur.yaw = lerpAngle(cur.yaw, target.yaw, 1 - Math.exp(-dt * 6.5));
      cur.pitch = THREE.MathUtils.damp(cur.pitch, target.pitch, 6.0, dt);
      cur.roll = THREE.MathUtils.damp(cur.roll, target.roll, 6.0, dt);

      // --- Dynamic Bank Tilting & Inertial Drag ---
      // Leans naturally into turns proportionally to filtered lateral velocity
      const latVel = (cur.x - prevX) / Math.max(dt, 0.001);
      const vertVel = (cur.y - prevY) / Math.max(dt, 0.001);

      const targetBankRoll = cur.roll - clamp(latVel * 16.0, -18, 18);
      const targetBankPitch = cur.pitch - clamp(vertVel * 14.0, -12, 12);
      cur.bankRoll = THREE.MathUtils.damp(cur.bankRoll, targetBankRoll, 7.0, dt);
      cur.bankPitch = THREE.MathUtils.damp(cur.bankPitch, targetBankPitch, 7.0, dt);

      // --- Filtered Pointer Parallax ---
      mouse.sx = THREE.MathUtils.damp(mouse.sx, mouse.x, 3.5, dt);
      mouse.sy = THREE.MathUtils.damp(mouse.sy, mouse.y, 3.5, dt);

      // Subtle breath hover (suppressed when settled on Card 04)
      const hover = (Math.sin(t * 1.6) * 0.025 + Math.sin(t * 2.7) * 0.01) * hoverScale;

      // Section 03 Clay rim lighting when near Titleholders section (p around 3.0)
      if (clayRimLight) {
        const darkProximity = Math.max(0, 1 - Math.abs(p - 3.0) * 1.2);
        const darkIntensity = Math.pow(darkProximity, 1.4);
        const heroProximity = Math.max(0, 1 - p * 1.5);
        clayRimLight.intensity = darkIntensity * 3.6 + heroProximity * 0.85;
        if (dirLight1) dirLight1.intensity = 2.6 - darkIntensity * 0.8;
        if (dirLight2) dirLight2.intensity = 1.8 + darkIntensity * 0.6;
      }

      // Soft ground contact shadow disc fades as piece lifts into flight
      if (shadowMat) {
        shadowMat.opacity = clamp(0.65 * (1 - p * 0.9), 0, 0.65);
      }

      // Graceful Exit Before Footer: fades out completely before the footer to prevent any CTA collisions
      if (canvas && modelLoaded) {
        // Access is section 4. Fades out between p = 4.1 and 4.4, completely invisible before Footer (p = 5.0)
        const footerExitAlpha = p < 4.1 ? 1 : clamp(1 - (p - 4.1) / 0.3, 0, 1);
        canvas.style.opacity = `${footerExitAlpha}`;
        canvas.style.visibility = footerExitAlpha <= 0.001 ? 'hidden' : 'visible';
      }

      // Set final smoothed transform
      flight.position.set(
        cur.x * halfW + Math.sin(t * 1.1) * 0.015 * hoverScale + mouse.sx * 0.045,
        cur.y * halfH + hover * halfH * 0.35 + mouse.sy * 0.035 * hoverScale,
        cur.z + Math.sin(t * 0.8) * 0.06 * hoverScale
      );

      flight.scale.setScalar(halfH * 2 * 0.36 * cur.s);

      // Controlled Grandmaster Yaw & Dynamic Banking Rotation
      const yawRad = THREE.MathUtils.degToRad(cur.yaw + mouse.sx * 5.0);
      flight.rotation.set(0, yawRad, 0);

      pieceRoot.rotation.set(
        THREE.MathUtils.degToRad(cur.bankRoll),
        0,
        THREE.MathUtils.degToRad(cur.bankPitch + mouse.sy * 2.2),
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
    <>
      <div className="loader" id="loader" ref={loaderRef}>
        <svg viewBox="0 0 40 40">
          <path d="M8 36h24v-4H8z M12 32l1.5-14h13L28 32z M9 18V8h4v4h4V8h6v4h4V8h4v10z" />
        </svg>
      </div>

      <canvas id="rook" ref={canvasRef} style={{ zIndex: 35, pointerEvents: 'none' }} />
    </>
  );
}
