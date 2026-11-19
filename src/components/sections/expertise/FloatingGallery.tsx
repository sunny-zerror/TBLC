"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GalleryImage {
  src: string;
  width: number;
  height: number;
}

/* Depth of the flight path: photos appear at FAR, drift toward the camera and recycle at NEAR */
const FAR = -42;
const NEAR = -2;
const SPAN = NEAR - FAR;
const SPEED = 1.6; // world units per second — one pass takes ~25s
/* Distance from the centre line, so photos stream out around the heading rather than through it */
const RADIUS_MIN = 2.6;
const RADIUS_MAX = 7;
const PLANE_HEIGHT = 1.15;
/* Photos fade while they pass behind the title block (an ellipse in screen space) */
const CLEAR_X = 0.5;
const CLEAR_Y = 0.55;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Studio photos drifting through 3D space toward the viewer, behind the expertise hero.
 * A transparent WebGL canvas: the section's paper shows through. Pauses offscreen; with
 * reduced motion it holds a still scatter.
 */
export default function FloatingGallery({ images }: { images: GalleryImage[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the hero stands on its own
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const focus = new THREE.Vector3(0, 0, FAR);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const loader = new THREE.TextureLoader();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let spreadX = 1;
    let disposed = false;
    let loaded = 0;

    const planes = images.map((image, i) => {
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const scale = 0.75 + Math.random() * 0.45;
      mesh.scale.set(PLANE_HEIGHT * scale * (image.width / image.height), PLANE_HEIGHT * scale, 1);
      mesh.visible = false;
      scene.add(mesh);

      const plane = {
        mesh,
        material,
        angle: i * GOLDEN_ANGLE,
        radius: RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN),
        // Spread evenly along the path so the field is already full on first paint
        z: FAR + ((i + Math.random() * 0.6) / images.length) * SPAN,
      };

      loader.load(image.src, (texture) => {
        if (disposed) return texture.dispose();
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.map = texture;
        material.needsUpdate = true;
        mesh.visible = true;
        if (++loaded === 1) canvas.dataset.ready = "";
        if (reduceMotion) render();
      });

      return plane;
    });

    const projected = new THREE.Vector3();
    const place = () => {
      camera.updateMatrixWorld();
      for (const p of planes) {
        p.mesh.position.set(Math.cos(p.angle) * p.radius * spreadX, Math.sin(p.angle) * p.radius, p.z);
        // Rise out of the distance, then fade before the photo would fill the screen
        const travel = (p.z - FAR) / SPAN;
        const depthFade = smoothstep(0, 0.3, travel) * (1 - smoothstep(0.8, 1, travel));
        // Thin out behind the title, but never vanish entirely — the field reads as one space
        projected.copy(p.mesh.position).project(camera);
        const clearance = Math.hypot(projected.x / CLEAR_X, projected.y / CLEAR_Y);
        p.material.opacity = depthFade * (0.3 + 0.7 * smoothstep(0.55, 1.05, clearance));
      }
    };

    /* Pointer parallax: the camera leans a little toward the cursor */
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    function render() {
      camera.lookAt(focus);
      place();
      renderer.render(scene, camera);
    }

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Wide screens spread the field sideways; phones keep it close to round
      spreadX = Math.min(Math.max(camera.aspect, 0.75), 1.9);
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - (last || now)) / 1000, 0.05); // clamp after a hidden tab
      last = now;

      for (const p of planes) {
        p.z += SPEED * dt;
        if (p.z > NEAR) {
          p.z -= SPAN;
          p.angle += GOLDEN_ANGLE * (1 + Math.random());
          p.radius = RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN);
        }
      }
      const ease = 1 - Math.exp(-dt * 2.5);
      camera.position.x += (pointer.x * 0.7 - camera.position.x) * ease;
      camera.position.y += (pointer.y * 0.45 - camera.position.y) * ease;
      render();
    };
    const start = () => {
      if (frame || reduceMotion) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only run while the hero is on screen
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(wrap);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      for (const p of planes) {
        p.material.map?.dispose();
        p.material.dispose();
      }
      geometry.dispose();
      renderer.dispose();
    };
  }, [images]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas
        ref={canvasRef}
        className="block size-full opacity-0 transition-opacity duration-1000 data-ready:opacity-100"
      />
    </div>
  );
}
