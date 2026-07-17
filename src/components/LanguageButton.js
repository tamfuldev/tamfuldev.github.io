import React from "react";
import { useLanguage } from "./LanguageContext";
import { Helmet } from "react-helmet-async";

const LanguageButton = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <>
            <Helmet htmlAttributes={{ lang: language }} />
            <span onClick={toggleLanguage} className="language">
                {language === "en" ? "English" : "Vietnamese"}
            </span>
        </>
    );
};

export default LanguageButton;
