import React from "react";
import { Helmet } from "react-helmet-async";
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
import {
    aboutContent,
    blogContent,
    cryptoContent,
    initialCoins,
    navigationLabels,
    projectsContent,
    socialLinks,
} from "../data/portfolioContent";
import { pick } from "../utils/localization";

// WebGL ambient field — deferred so three.js stays out of the initial bundle.
const PortfolioBackground = React.lazy(() =>
    import("../components/portfolio/PortfolioBackground")
);

const SITE_URL = "https://tamfuldev.github.io";

const canonicalPathByPage = {
    home: "/",
    about: "/about",
    projects: "/projects",
    roadmap: "/roadmap",
    blog: "/blog",
    dailyPlan: "/daily-plan",
    marketAnalysis: "/market-analysis",
};

const Base = ({ canAccessPrivatePages = false, initialPage = "home" }) => {
    const { language } = useLanguage();
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const routedPage = location.pathname.startsWith("/about")
        ? "about"
        : location.pathname.startsWith("/blog")
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

    const siteTitle = language === "vi"
        ? "Trần Ngọc Tâm - Kỹ sư Backend"
        : "Tran Ngoc Tam - Backend Engineer";
    const siteDescription = language === "vi"
        ? "Trần Ngọc Tâm là kỹ sư backend tại Thành phố Hồ Chí Minh, xây dựng hệ thống Laravel, Redis, Docker, Firebase đáng tin cậy và sẵn sàng cho production."
        : "Tran Ngoc Tam is a backend engineer in Ho Chi Minh City building reliable Laravel, Redis, Docker, Firebase, and production-ready web systems.";
    const pageMetaByPage = {
        home: { description: siteDescription },
        about: { description: pick(aboutContent.bioPrimary, language) },
        projects: { description: pick(projectsContent.description, language) },
        blog: { description: pick(blogContent.description, language) },
        crypto: { description: pick(cryptoContent.description, language) },
    };
    const pageMeta = pageMetaByPage[activePage] || { description: siteDescription };
    const pageTitle = activePage === "home"
        ? siteTitle
        : `${pick(navigationLabels[activePage], language)} - ${siteTitle}`;
    const canonicalPath = activePage === "blog" && slug
        ? `/blog/${slug}`
        : canonicalPathByPage[activePage] || "/";
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const personJsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: pick(aboutContent.name, language),
        jobTitle: pick(aboutContent.role, language),
        url: SITE_URL,
        sameAs: socialLinks.filter((link) => link.id !== "email").map((link) => link.url),
    };

    React.useEffect(() => {
        setActivePage(routedPage);
    }, [routedPage]);

    const handlePageChange = (page) => {
        setActivePage(page);

        if (page === "about") {
            navigate("/about");
        } else if (page === "blog") {
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
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageMeta.description} />
                <link rel="canonical" href={canonicalUrl} />
                {activePage === "home" && (
                    <script type="application/ld+json">
                        {JSON.stringify(personJsonLd)}
                    </script>
                )}
            </Helmet>
            <React.Suspense fallback={null}>
                <PortfolioBackground />
            </React.Suspense>
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
