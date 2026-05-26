import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";
import DailyPlanCalendar from "../components/portfolio/DailyPlanCalendar";
import MarketAnalysisWidget from "../components/portfolio/MarketAnalysisWidget";
import PortfolioAbout from "../components/portfolio/PortfolioAbout";
import PortfolioBlog from "../components/portfolio/PortfolioBlog";
import PortfolioCrypto from "../components/portfolio/PortfolioCrypto";
import PortfolioFx from "../components/portfolio/PortfolioFx";
import PortfolioHome from "../components/portfolio/PortfolioHome";
import PortfolioNav from "../components/portfolio/PortfolioNav";
import PortfolioProjects from "../components/portfolio/PortfolioProjects";
import RoadmapView from "../components/portfolio/RoadmapView";
import { initialCoins } from "../data/portfolioContent";

const Base = ({ canAccessPrivatePages = false, initialPage = "home" }) => {
    const { language } = useLanguage();
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const routedPage = location.pathname.startsWith("/blog")
        ? "blog"
        : location.pathname.startsWith("/projects")
            ? "projects"
            : location.pathname.startsWith("/roadmap")
                ? "roadmap"
                : location.pathname.startsWith("/daily-plan")
                    ? "dailyPlan"
                    : location.pathname.startsWith("/market-analysis")
                        ? "marketAnalysis"
                        : location.state?.activePage || initialPage;
    const [activePage, setActivePage] = React.useState(routedPage);
    const [activeTag, setActiveTag] = React.useState("all");
    const cryptoPrices = initialCoins;
    const avatarSrc = `${process.env.PUBLIC_URL}/assets/img/vendor-logo.jpg`;

    React.useEffect(() => {
        document.title =
            language === "vi"
                ? "Trần Ngọc Tâm - Kỹ sư Backend"
                : "Tran Ngoc Tam - Backend Engineer";
    }, [language]); 

    React.useEffect(() => {
        setActivePage(routedPage);
    }, [routedPage]);

    const handlePageChange = (page) => {
        setActivePage(page);

        if (page === "blog") {
            navigate("/blog");
        } else if (page === "projects") {
            navigate("/projects");
        } else if (page === "roadmap") {
            navigate("/roadmap");
        } else if (page === "dailyPlan") {
            navigate("/daily-plan");
        } else if (page === "marketAnalysis") {
            navigate("/market-analysis");
        } else {
            navigate("/", { state: { activePage: page } });
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="portfolio-app">
            <PortfolioFx />
            <PortfolioNav
                activePage={activePage}
                canAccessPrivatePages={canAccessPrivatePages}
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

            {activePage === "projects" && ( 
                <PortfolioProjects language={language} />
            )}

            {activePage === "roadmap" && (
                <RoadmapView language={language} />
            )}

            {activePage === "dailyPlan" && (
                <DailyPlanCalendar language={language} />
            )}

            {activePage === "marketAnalysis" && (
                <MarketAnalysisWidget language={language} />
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
                <PortfolioCrypto fallbackCoins={cryptoPrices} language={language} />
            )}
        </div>
    );
};

export default Base;
