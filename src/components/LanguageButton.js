import React from "react";
import { useLanguage } from "./LanguageContext";

const LanguageButton = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="control-btn"
            aria-label="Toggle language"
        >
            {language.toUpperCase()}
        </button>
    );
};

export default LanguageButton;
