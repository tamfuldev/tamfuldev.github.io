import React from 'react';

const Translate = () => {
    const [language, setLanguage] = React.useState(() => {
        return localStorage.getItem("language") || "en";
    });

    const updateLanguage = (currentLang) => {
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = (currentLang === 'en') ? el.dataset.en : el.dataset.vi;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
    };

    React.useEffect(() => {
        localStorage.setItem('language', language);
        updateLanguage(language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'vi' : 'en'));
    };

    return (
        <button id="langToggle" className="control-btn" aria-label="Toggle language" onClick={toggleLanguage}>
            <span className="lang-label">{language.toUpperCase()}</span>
        </button>
    );
}

export default Translate;