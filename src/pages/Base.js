import React from "react";
import Home from "./Home";
import CryptoTicker from "../components/CryptoTicker";
import Header from "../components/Header";

const Base = () => {
    const [activeTab, setActiveTab] = React.useState('home');

    return (
        <>
            <Header tab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'home' && (
                <Home />
            )}

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-left">
                            <div className="footer-logo">Tam Saitama<span className="dot">.</span></div>
                            <p className="footer-tag" data-en="Analysis. Action. Precision. Results." data-vi="Phân tích. Hành động. Độ chính xác. Kết quả.">Analysis. Action. Precision. Results.</p>
                        </div>
                        <div className="footer-right">
                            <p>&copy; <span id="year">2026</span> Tam Saitama. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            <CryptoTicker />
        </>
    );
};

export default Base;