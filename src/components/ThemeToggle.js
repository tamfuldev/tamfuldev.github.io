import React from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = React.useState(() => {
        return localStorage.getItem("theme") || "dark";
    });
    const isDark = theme !== "light";

    React.useEffect(() => {
        const body = document.body;
        if (isDark) {
            body.classList.remove('light');
        } else {
            body.classList.add('light');
        }
        localStorage.setItem('theme', theme);
    }, [isDark, theme])

    const handleThemeChange = (event) => {
        setTheme(event.target.checked ? "dark" : "light");
    }

    return (
        <label
            className={`theme-toggle${isDark ? " is-dark" : ""}`}
            title="Toggle dark mode"
        >
            <input
                type="checkbox"
                checked={isDark}
                onChange={handleThemeChange}
                role="switch"
                aria-label="Dark mode"
            />
            <span className="theme-toggle-track" aria-hidden="true">
                <span className="theme-toggle-icon">
                    <i className="fa-regular fa-sun"></i>
                </span>
                <span className="theme-toggle-icon">
                    <i className="fa-solid fa-moon"></i>
                </span>
                <span className="theme-toggle-thumb"></span>
            </span>
        </label>
    );
}

export default ThemeToggle;
