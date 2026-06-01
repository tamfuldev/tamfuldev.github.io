import LanguageButton from "../LanguageButton";
import ThemeToggle from "../ThemeToggle";
import { navigationLabels } from "../../data/portfolioContent";
import { pick } from "../../utils/localization";

const primaryPages = ["home", "about", "projects"];
const privateGroupedPages = ["roadmap", "dailyPlan"];
const publicGroupedPages = ["blog", "crypto", "marketAnalysis"];

const PortfolioNav = ({ activePage, canAccessPrivatePages = false, language, onPageChange }) => {
    const groupedPages = canAccessPrivatePages
        ? [...privateGroupedPages, ...publicGroupedPages]
        : publicGroupedPages;
    const activeGroupedPage = groupedPages.includes(activePage) ? activePage : "";

    return (
        <nav className="portfolio-nav">
            <div className="portfolio-nav-inner">
                <div className="portfolio-nav-main">
                    <button type="button" className="portfolio-logo" onClick={() => onPageChange("home")}>
                        Tam<span>.</span>
                    </button>
                    <div className="portfolio-nav-links">
                        {primaryPages.map((page) => (
                            <button
                                key={page}
                                type="button"
                                className={`portfolio-nav-link${activePage === page ? " is-active" : ""}`}
                                onClick={() => onPageChange(page)}
                            >
                                {pick(navigationLabels[page], language)}
                            </button>
                        ))}

                        <label className={`portfolio-nav-select${activeGroupedPage ? " is-active" : ""}`}>
                            <span className="sr-only">{pick(navigationLabels.more, language)}</span>
                            <select
                                aria-label={pick(navigationLabels.more, language)}
                                value={activeGroupedPage}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        onPageChange(event.target.value);
                                    }
                                }}
                            >
                                <option value="">{pick(navigationLabels.more, language)}</option>
                                {groupedPages.map((page) => (
                                    <option key={page} value={page}>
                                        {pick(navigationLabels[page], language)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="portfolio-controls">
                        <LanguageButton />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PortfolioNav;
