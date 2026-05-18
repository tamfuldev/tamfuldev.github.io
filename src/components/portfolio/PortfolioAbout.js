import {
    aboutContent,
    experiences,
    skillGroups,
} from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";
import SocialLinks from "./SocialLinks";

const PortfolioAbout = ({ avatarSrc, language }) => (
    <div className="portfolio-page">
        <section className="portfolio-about-wrap">
            <div className="portfolio-about-hero">
                <div className="portfolio-about-avatar">
                    <img src={avatarSrc} alt={pick(aboutContent.name, language)} />
                </div>
                <div className="portfolio-about-bio">
                    <h1>{pick(aboutContent.name, language)}</h1>
                    <div className="portfolio-role">{pick(aboutContent.role, language)}</div>
                    <p>{pick(aboutContent.bioPrimary, language)}</p>
                    <p className="portfolio-about-secondary">
                        {pick(aboutContent.bioLead, language)}
                        <strong>{aboutContent.bioHighlight}</strong>
                        {pick(aboutContent.bioTail, language)}
                    </p>
                    <div className="portfolio-contact-row">
                        <a href="mailto:ngoctam2303001@gmail.com" className="portfolio-contact-chip">
                            <span className="chip-icon">✉</span>ngoctam2303001@gmail.com
                        </a>
                        <a href="tel:+84909762942" className="portfolio-contact-chip">
                            <span className="chip-icon">☎</span>
                            +84 90 976 2942
                        </a>
                    </div>
                    <SocialLinks compact className="portfolio-about-socials" />
                </div>
            </div>

            <div className="portfolio-section-heading">
                {pick(aboutContent.skillsTitle, language)}
            </div>
            <div className="portfolio-skills-wrap">
                {skillGroups.map((group) => (
                    <div key={pick(group.label, "en")} className="portfolio-skill-category">
                        <div className="portfolio-skill-cat-label">{pick(group.label, language)}</div>
                        <div className="portfolio-skill-tags">
                            {group.items.map((item) => (
                                <span
                                    key={pick(item, "en")}
                                    className={`portfolio-skill-tag ${group.level}`}
                                >
                                    {pick(item, language)}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="portfolio-section-heading">
                {pick(aboutContent.experienceTitle, language)}
            </div>
            <div className="portfolio-timeline">
                {experiences.map((experience) => (
                    <div
                        key={`${experience.date}-${pick(experience.role, "en")}`}
                        className="portfolio-timeline-item"
                    >
                        <div
                            className={`portfolio-timeline-dot${experience.mutedDot ? " is-muted" : ""}`}
                        ></div>
                        <div className="portfolio-timeline-date">{experience.date}</div>
                        <div className="portfolio-timeline-role">
                            {pick(experience.role, language)}
                        </div>
                        <div className="portfolio-timeline-company">{experience.company}</div>
                        <ul className="portfolio-timeline-points">
                            {experience.points.map((point) => (
                                <li key={pick(point, "en")}>{pick(point, language)}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        <PageFooter>
            <span>{pick(aboutContent.name, language)}</span> - {pick(aboutContent.footer, language)}
        </PageFooter>
    </div>
);

export default PortfolioAbout;
