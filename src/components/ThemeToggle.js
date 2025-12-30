import React from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = React.useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    React.useEffect(() => {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    }

    return (
        <button id="themeToggle" className="control-btn" aria-label="Toggle theme" onClick={toggleTheme}>
            <svg className="theme-icon" viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="5" fill="currentColor"></circle>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"></line>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"></line> 
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"></line>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"></line>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"></line>
            </svg>
        </button>
    );
}

export default ThemeToggle;