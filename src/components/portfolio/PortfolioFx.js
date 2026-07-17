import React from "react";

const PortfolioFx = () => {
    React.useEffect(() => {
        const root = document.querySelector(".portfolio-app");
        const prefersReducedMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!root || prefersReducedMotion) {
            return undefined;
        }

        let frameId = 0;

        const handlePointerMove = (event) => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                root.style.setProperty("--cursor-x", `${event.clientX}px`);
                root.style.setProperty("--cursor-y", `${event.clientY}px`);
                // Normalized -1..1 offset from viewport center, used to drive the
                // hero's 3D parallax tilt.
                const tiltX = (event.clientX / window.innerWidth - 0.5) * 2;
                const tiltY = (event.clientY / window.innerHeight - 0.5) * 2;
                root.style.setProperty("--tilt-x", tiltX.toFixed(3));
                root.style.setProperty("--tilt-y", tiltY.toFixed(3));
            });
        };

        const handlePointerDown = (event) => {
            const burst = document.createElement("span");
            burst.className = "portfolio-click-burst";
            burst.style.left = `${event.clientX}px`;
            burst.style.top = `${event.clientY}px`;
            root.appendChild(burst);
            window.setTimeout(() => burst.remove(), 700);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerdown", handlePointerDown);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    return null;
};

export default PortfolioFx;
