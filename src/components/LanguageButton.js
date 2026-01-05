import React from "react";
import { useLanguage } from "./LanguageContext";

const LanguageButton = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button onClick={toggleLanguage} className="control-btn">
            {language.toUpperCase()}
        </button>
    );
};

export default LanguageButton;