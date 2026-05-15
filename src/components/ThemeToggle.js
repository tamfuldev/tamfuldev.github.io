import React from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = React.useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    React.useEffect(() => {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light');
        } else {
            body.classList.remove('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    }

    return (
        <button
            type="button"
            className="control-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
        >
            <i className={`fa-${(theme === 'light') ? 'regular fa-sun' : 'solid fa-moon'}`}></i>
        </button>
    );
}

export default ThemeToggle;
