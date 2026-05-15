import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";
import PortfolioAbout from "../components/portfolio/PortfolioAbout";
import PortfolioBlog from "../components/portfolio/PortfolioBlog";
import PortfolioCrypto from "../components/portfolio/PortfolioCrypto";
import PortfolioHome from "../components/portfolio/PortfolioHome";
import PortfolioNav from "../components/portfolio/PortfolioNav";
import { initialCoins } from "../data/portfolioContent";

const Base = ({ initialPage = "home" }) => {
    const { language } = useLanguage();
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const routedPage = location.pathname.startsWith("/blog")
        ? "blog"
        : location.state?.activePage || initialPage;
    const [activePage, setActivePage] = React.useState(routedPage);
    const [activeTag, setActiveTag] = React.useState("all");
    const [cryptoPrices, setCryptoPrices] = React.useState(initialCoins);
    const avatarSrc = `${process.env.PUBLIC_URL}/assets/img/vendor-logo.jpg`;

    React.useEffect(() => {
        document.title =
            language === "vi"
                ? "Tran Ngoc Tam - Ky su Backend"
                : "Tran Ngoc Tam - Backend Engineer";
    }, [language]);

    React.useEffect(() => {
        setActivePage(routedPage);
    }, [routedPage]);

    React.useEffect(() => {
        if (activePage !== "crypto") {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setCryptoPrices((previousCoins) =>
                previousCoins.map((coin) => {
                    const delta = (Math.random() - 0.48) * 0.003;
                    const nextPrice = coin.price * (1 + delta);
                    const nextChange = Number(
                        (coin.change + (Math.random() - 0.48) * 0.1).toFixed(2)
                    );

                    return {
                        ...coin,
                        price: nextPrice,
                        change: nextChange,
                    };
                })
            );
        }, 5000);

        return () => window.clearInterval(interval);
    }, [activePage]);

    const handlePageChange = (page) => {
        setActivePage(page);

        if (page === "blog") {
            navigate("/blog");
        } else {
            navigate("/", { state: { activePage: page } });
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="portfolio-app">
            <PortfolioNav
                activePage={activePage}
                language={language}
                onPageChange={handlePageChange}
            />

            {activePage === "home" && (
                <PortfolioHome
                    avatarSrc={avatarSrc}
                    language={language}
                    onPageChange={handlePageChange}
                />
            )}

            {activePage === "about" && (
                <PortfolioAbout avatarSrc={avatarSrc} language={language} />
            )}

            {activePage === "blog" && (
                <PortfolioBlog
                    activeTag={activeTag}
                    detailSlug={slug}
                    language={language}
                    onTagChange={setActiveTag}
                />
            )}

            {activePage === "crypto" && (
                <PortfolioCrypto coins={cryptoPrices} language={language} />
            )}
        </div>
    );
};

export default Base;
