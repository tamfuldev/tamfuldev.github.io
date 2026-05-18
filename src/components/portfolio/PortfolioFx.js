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
