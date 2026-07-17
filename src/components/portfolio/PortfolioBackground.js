import React from "react";
import * as THREE from "three";

/**
 * Ambient WebGL depth field rendered behind the whole portfolio.
 *
 * A cloud of soft, additively-blended points sits at varying Z depths and
 * drifts slowly, giving a real 3D parallax as the camera eases toward the
 * pointer. Point colors are read from the live CSS accent variables, so the
 * field re-tints itself when the light/dark theme flips.
 *
 * Guardrails: honors prefers-reduced-motion (single static frame, no loop),
 * pauses the RAF loop while the tab is hidden, caps devicePixelRatio, and
 * scales the point count down on small/low-core devices.
 */
const readAccent = (el, name, fallback) => {
    const raw = getComputedStyle(el).getPropertyValue(name).trim();
    if (!raw) {
        return new THREE.Color(fallback);
    }
    try {
        return new THREE.Color(raw);
    } catch (err) {
        return new THREE.Color(fallback);
    }
};

const vertexShader = `
    attribute float aScale;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform float uPixelRatio;
    uniform float uSize;
    void main() {
        vColor = aColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Perspective size, clamped so nothing near the camera blooms into a blob.
        gl_PointSize = clamp(uSize * aScale * uPixelRatio * (42.0 / -mvPosition.z), 0.5, 15.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    uniform float uIntensity;
    void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, alpha * 0.5 * uIntensity);
    }
`;

const PortfolioBackground = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const appEl = document.querySelector(".portfolio-app");
        if (!canvas || !appEl) {
            return undefined;
        }

        // Bail cleanly if WebGL is unavailable — the page still has its CSS bg.
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        } catch (err) {
            return undefined;
        }

        const prefersReducedMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const isCoarse =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(pointer: coarse)").matches;
        const lowCore = (navigator.hardwareConcurrency || 8) <= 4;

        const dpr = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 22;

        const count = isCoarse || lowCore ? 550 : 1100;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const scales = new Float32Array(count);

        let accentA = readAccent(appEl, "--portfolio-accent", "#45e0c8");
        let accentB = readAccent(appEl, "--portfolio-accent-2", "#8f7cf6");
        const isLight = () => document.body.classList.contains("light");

        const spreadX = 60;
        const spreadY = 40;

        const paintColors = () => {
            const tmp = new THREE.Color();
            for (let i = 0; i < count; i += 1) {
                // Weighted mix so most points lean teal with violet accents.
                const t = Math.pow(Math.random(), 1.6);
                tmp.copy(accentA).lerp(accentB, t);
                colors[i * 3] = tmp.r;
                colors[i * 3 + 1] = tmp.g;
                colors[i * 3 + 2] = tmp.b;
            }
        };

        for (let i = 0; i < count; i += 1) {
            positions[i * 3] = (Math.random() - 0.5) * spreadX;
            positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
            // All points sit in front of the camera (never near it) so the
            // starfield reads as fine, even specks with real depth.
            positions[i * 3 + 2] = -(8 + Math.random() * 48);
            scales[i] = 0.35 + Math.random() * 1.15;
        }
        paintColors();

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uPixelRatio: { value: dpr },
                uSize: { value: isCoarse ? 6 : 7 },
                uIntensity: { value: isLight() ? 0.55 : 1.0 },
            },
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Pointer parallax — eased so the camera glides rather than snaps.
        const pointer = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const handlePointer = (event) => {
            target.x = (event.clientX / window.innerWidth - 0.5) * 2;
            target.y = (event.clientY / window.innerHeight - 0.5) * 2;
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight, false);
        };

        // Re-read accent colors when the theme class on <body> changes.
        const themeObserver = new MutationObserver(() => {
            accentA = readAccent(appEl, "--portfolio-accent", "#45e0c8");
            accentB = readAccent(appEl, "--portfolio-accent-2", "#8f7cf6");
            paintColors();
            geometry.attributes.aColor.needsUpdate = true;
            material.uniforms.uIntensity.value = isLight() ? 0.55 : 1.0;
            if (prefersReducedMotion) {
                renderer.render(scene, camera);
            }
        });
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

        const clock = new THREE.Clock();
        let frameId = 0;
        let running = true;

        const renderFrame = () => {
            const elapsed = clock.getElapsedTime();
            pointer.x += (target.x - pointer.x) * 0.04;
            pointer.y += (target.y - pointer.y) * 0.04;

            points.rotation.y = elapsed * 0.04;
            points.rotation.x = Math.sin(elapsed * 0.12) * 0.06;

            camera.position.x += (pointer.x * 3.4 - camera.position.x) * 0.05;
            camera.position.y += (-pointer.y * 2.2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        const loop = () => {
            if (!running) {
                return;
            }
            renderFrame();
            frameId = window.requestAnimationFrame(loop);
        };

        const handleVisibility = () => {
            if (document.hidden) {
                running = false;
                window.cancelAnimationFrame(frameId);
            } else if (!prefersReducedMotion) {
                running = true;
                clock.getDelta();
                loop();
            }
        };

        window.addEventListener("resize", handleResize);
        document.addEventListener("visibilitychange", handleVisibility);

        if (prefersReducedMotion) {
            renderFrame();
        } else {
            window.addEventListener("pointermove", handlePointer, { passive: true });
            loop();
        }

        return () => {
            running = false;
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointer);
            document.removeEventListener("visibilitychange", handleVisibility);
            themeObserver.disconnect();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className="portfolio-webgl-bg" aria-hidden="true" />;
};

export default PortfolioBackground;
