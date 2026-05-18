import LanguageButton from "../LanguageButton";
import ThemeToggle from "../ThemeToggle";
import { navigationLabels } from "../../data/portfolioContent";
import { pick } from "../../utils/localization";

const PortfolioNav = ({ activePage, language, onPageChange }) => (
    <nav className="portfolio-nav">
        <button
            type="button"
            className="portfolio-logo"
            onClick={() => onPageChange("home")}
        >
            Tam<span>.</span>
        </button>

        <div className="portfolio-nav-main">
            <div className="portfolio-nav-links">
                {["home", "about", "projects", "blog", "crypto"].map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`portfolio-nav-link${activePage === page ? " is-active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {pick(navigationLabels[page], language)}
                    </button>
                ))}
            </div>

            <div className="portfolio-controls">
                <LanguageButton />
                <ThemeToggle />
                <a className="portfolio-nav-link portfolio-hire-btn" href="mailto:ngoctam2303001@gmail.com">
                    {pick(navigationLabels.hire, language)}
                </a>
            </div>
        </div>
    </nav>
);

export default PortfolioNav;
