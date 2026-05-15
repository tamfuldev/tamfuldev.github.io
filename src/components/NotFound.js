import React from "react";
import { useLanguage } from "./LanguageContext";

const notFoundCopy = {
    en: {
        title: "Oh no! It seems you've encountered a page that doesn't exist.",
        description: "Let's get you back on track.",
        action: "Go to Home Page",
    },
    vi: {
        title: "O khong! Co ve ban dang truy cap mot trang khong ton tai.",
        description: "Minh dua ban quay lai trang chu nhe.",
        action: "Quay lai trang chu",
    },
};

const NotFound = () => {
    const { language } = useLanguage();
    const copy = notFoundCopy[language] ?? notFoundCopy.en;

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404"></div>
                <h1>404</h1>
                <h2>{copy.title}</h2>
                <p>{copy.description}</p>
                <a href="/">{copy.action}</a>
            </div>
        </div>
    );
};

export default NotFound;
