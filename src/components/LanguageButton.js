import React from "react";
import { useLanguage } from "./LanguageContext";
import { Helmet, HelmetProvider } from "react-helmet-async";

const LanguageButton = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <HelmetProvider>
            <Helmet htmlAttributes={{ lang: language }} />

            <button
                type="button"
                onClick={toggleLanguage}
                className="control-btn"
                aria-label="Toggle language"
            >
                {language.toUpperCase()}
            </button>
        </HelmetProvider>
    );
};

export default LanguageButton;
