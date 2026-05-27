import React from "react";
import { FiArrowLeft, FiHome, FiTerminal } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

const notFoundCopy = {
    en: {
        eyebrow: "Route not found",
        title: "This page slipped out of the stack.",
        description: "The address may be outdated, mistyped, or still waiting to be deployed.",
        back: "Go back",
        home: "Home",
        trace: "No matching route was found for this request.",
    },
    vi: {
        eyebrow: "Không tìm thấy route",
        title: "Trang này đã lệch khỏi luồng xử lý.",
        description: "Đường dẫn có thể đã cũ, nhập sai, hoặc chưa được triển khai.",
        back: "Quay lại",
        home: "Trang chủ",
        trace: "Không tìm thấy route phù hợp cho yêu cầu này.",
    },
};

const NotFound = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const copy = notFoundCopy[language] ?? notFoundCopy.en;

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-copy">
                    <span className="notfound-kicker">{copy.eyebrow}</span>
                    <h1>404</h1>
                    <h2>{copy.title}</h2>
                    <p>{copy.description}</p>
                    <div className="notfound-actions">
                        <button type="button" onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                            {copy.back}
                        </button>
                        <Link to="/">
                            <FiHome />
                            {copy.home}
                        </Link>
                    </div>
                </div>

                <div className="notfound-panel" aria-hidden="true">
                    <div className="notfound-panel-top">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="notfound-terminal">
                        <FiTerminal />
                        <code>GET /unknown-page</code>
                    </div>
                    <pre><code>{`status: 404
message: "${copy.trace}"
next: "/"`}</code></pre>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
