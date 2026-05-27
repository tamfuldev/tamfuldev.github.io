import {
    aboutContent,
    featuredProjects,
    heroContent,
    stats,
} from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";
import SocialLinks from "./SocialLinks";

const PortfolioHome = ({ avatarSrc, language, onPageChange }) => (
    <div className="portfolio-page">
        <section className="portfolio-hero">
            <div className="portfolio-hero-bg"></div>
            <div className="portfolio-hero-content">
                <div className="portfolio-hero-text">
                    <div className="portfolio-kicker">{pick(heroContent.kicker, language)}</div>
                    <h1>
                        {pick(heroContent.titleLine1, language)}
                        <br />
                        <span>{pick(heroContent.titleLine2, language)}</span>
                        <br />
                        {pick(heroContent.titleLine3, language)}
                    </h1>
                    <p className="portfolio-tagline">
                        {pick(heroContent.taglineLead, language)}
                        <strong>{pick(heroContent.taglineName, language)}</strong>
                        <p>{pick(heroContent.taglineTail, language)}</p>
                    </p>
                    <SocialLinks />
                    <div className="portfolio-hero-cta">
                        <button
                            type="button"
                            className="portfolio-btn portfolio-btn-primary"
                            onClick={() => onPageChange("projects")}
                        >
                            {pick(heroContent.primaryCta, language)}
                        </button>
                        <a
                            className="portfolio-btn portfolio-btn-secondary"
                            href="mailto:ngoctam2303001@gmail.com"
                        >
                            {pick(heroContent.secondaryCta, language)}
                        </a>
                    </div>
                </div>

                <div className="portfolio-orbit-wrap">
                    <div className="portfolio-orbit-ring portfolio-orbit-ring-1">
                        <div className="portfolio-orbit-icon portfolio-top-center">PHP</div>
                        <div className="portfolio-orbit-icon portfolio-bottom-center">SQL</div>
                    </div>
                    <div className="portfolio-orbit-ring portfolio-orbit-ring-2">
                        <div className="portfolio-orbit-icon portfolio-top-center">Redis</div>
                        <div className="portfolio-orbit-icon portfolio-right-center">API</div>  
                        <div className="portfolio-orbit-icon portfolio-bottom-center">Docker</div>
                        <div className="portfolio-orbit-icon portfolio-left-center">Laravel</div>
                    </div>
                    <div className="portfolio-avatar-circle">
                        <img src={avatarSrc} alt={pick(aboutContent.name, language)} />
                    </div>
                </div>
            </div>
        </section>

        <section className="portfolio-stats-bar">
            {stats.map((stat) => (
                <div key={stat.value + pick(stat.label, language)} className="portfolio-stat-item">
                    <div className="portfolio-stat-num">{stat.value}</div>
                    <div className="portfolio-stat-label">{pick(stat.label, language)}</div>
                </div>
            ))}
        </section>

        <section className="portfolio-featured">
            <div className="portfolio-section-label">
                {pick(heroContent.featuredLabel, language)}
            </div>
            <div className="portfolio-section-title">
                {pick(heroContent.featuredTitle, language)}
            </div>
            <div className="portfolio-projects-grid">
                {featuredProjects.map((project) => (
                    <article key={pick(project.title, "en")} className="portfolio-project-card">
                        <div className="portfolio-project-tag">{pick(project.tag, language)}</div>
                        <h3>{pick(project.title, language)}</h3>
                        <p>{pick(project.description, language)}</p>
                        <div className="portfolio-project-tech">
                            {project.tech.map((tech) => (
                                <span key={tech} className="portfolio-tech-chip">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </section>

        <PageFooter>
            <span>{pick(aboutContent.name, language)}</span> - {pick(heroContent.footer, language)}
        </PageFooter>
    </div>
);

export default PortfolioHome;
