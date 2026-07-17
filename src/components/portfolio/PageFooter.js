import { aboutContent } from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import SocialLinks from "./SocialLinks";

const PageFooter = ({ children, language = "en" }) => (
    <footer className="portfolio-footer">
        <div className="portfolio-footer-inner">
            <div className="portfolio-footer-brand">
                <button
                    type="button"
                    className="portfolio-footer-logo"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    Tam<span>.</span>
                </button>
                <p>{children}</p>
            </div>

            <div className="portfolio-footer-contact">
                {/* <a href="mailto:ngoctam2303001@gmail.com">ngoctam2303001@gmail.com</a> */}
                <SocialLinks compact className="portfolio-footer-socials" />
            </div>
        </div>

        <div className="portfolio-footer-bottom">
            <span>{pick(aboutContent.name, language)}</span>
            <span>{pick(aboutContent.role, language)}</span>
            <span>{pick(aboutContent.location, language)}</span>
        </div>
    </footer>
);

export default PageFooter;
