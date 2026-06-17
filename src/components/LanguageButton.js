import React from "react";
import { useLanguage } from "./LanguageContext";
import { Helmet, HelmetProvider } from "react-helmet-async";

const LanguageButton = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <HelmetProvider>
            <Helmet htmlAttributes={{ lang: language }} />
            <span onClick={toggleLanguage} className="language">
                {language == "en" ? "English" : "Vietnamese"}
            </span>
        </HelmetProvider>
    );
};

export default LanguageButton;
