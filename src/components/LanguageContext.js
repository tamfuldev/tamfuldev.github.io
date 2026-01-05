import React from 'react';

const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
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
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => React.useContext(LanguageContext);

