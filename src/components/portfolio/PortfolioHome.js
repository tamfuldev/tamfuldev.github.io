import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
    aboutContent,
    featuredProjects,
    heroContent,
    stats,
} from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";
import SocialLinks from "./SocialLinks";
import { FiArrowUpRight } from "react-icons/fi";

const StatItem = ({ stat, language }) => {
    const match = stat.value.match(/^(\d+)(.*)$/);

    return (
        <div className="portfolio-stat-item">
            <div className="portfolio-stat-num">
                {match ? (
                    <CountUp
                        end={Number(match[1])}
                        suffix={match[2]}
                        duration={1.6}
                        enableScrollSpy
                        scrollSpyOnce
                    />
                ) : (
                    stat.value
                )}
            </div>
            <div className="portfolio-stat-label">{pick(stat.label, language)}</div>
        </div>
    );
};

const ProjectCard = ({ project, index, language }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

    return (
        <article
            ref={ref}
            className={`portfolio-project-card portfolio-reveal${index === 0 ? " is-lead" : ""}${inView ? " is-visible" : ""}`}
            style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
        >
            <div className="portfolio-project-card-topline">
                <div className="portfolio-project-tag">{pick(project.tag, language)}</div>
                <span className="portfolio-project-number">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>
            <h3>{pick(project.title, language)}</h3>
            <p>{pick(project.description, language)}</p>
            {project.outcome && (
                <div className="portfolio-project-outcome">
                    {pick(project.outcome, language)}
                </div>
            )}
            <div className="portfolio-project-tech">
                {project.tech.map((tech) => (
                    <span key={tech} className="portfolio-tech-chip">
                        {tech}
                    </span>
                ))}
            </div>
        </article>
    );
};

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
                    <div className="portfolio-tagline">
                        <p>
                            {pick(heroContent.taglineLead, language)}
                            <strong>{pick(heroContent.taglineName, language)}</strong>
                        </p>
                        <p>{pick(heroContent.taglineTail, language)}</p>
                    </div>
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
                            href={(language === 'en' ? 'https://www.topcv.vn/xem-cv/XVZYCVJRD1YHBFxTVF0HAwcBVgZTDAsBAFRcUg8f72' : 'https://www.topcv.vn/xem-cv/BgJSBQlWBFVWVFIGVlEFXQ5fUwNeB1FXUlEFUQb335')}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {pick(heroContent.secondaryCta, language)}
                        </a>
                    </div>
                </div>

                <div className="portfolio-orbit-wrap">
                    <div className="portfolio-orbit-ring portfolio-orbit-ring-main">
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-1">PHP</div>
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-2">Redis</div>
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-3">API</div>
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-4">SQL</div>
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-5">Docker</div>
                        <div className="portfolio-orbit-icon portfolio-orbit-pos-6">Laravel</div>
                    </div>
                    <div className="portfolio-avatar-circle">
                        <img src={avatarSrc} alt={pick(aboutContent.name, language)} />
                    </div>
                </div>
            </div>
        </section>

        <section className="portfolio-stats-bar">
            {stats.map((stat) => (
                <StatItem key={stat.value + pick(stat.label, language)} stat={stat} language={language} />
            ))}
        </section>

        <section className="portfolio-featured">
            <div className="portfolio-featured-head">
                <div>
                    <div className="portfolio-section-label">
                        {pick(heroContent.featuredLabel, language)}
                    </div>
                    <h2 className="portfolio-section-title">
                        {pick(heroContent.featuredTitle, language)}
                    </h2>
                </div>
                <div className="portfolio-featured-copy">
                    <p>{pick(heroContent.featuredDescription, language)}</p>
                    <button
                        type="button"
                        className="portfolio-featured-action"
                        onClick={() => onPageChange("projects")}
                    >
                        {pick(heroContent.featuredCta, language)}
                        <FiArrowUpRight aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div className="portfolio-projects-grid">
                {featuredProjects.map((project, index) => (
                    <ProjectCard
                        key={pick(project.title, "en")}
                        project={project}
                        index={index}
                        language={language}
                    />
                ))}
            </div>
        </section>

        <PageFooter language={language}>
            <span>{pick(aboutContent.name, language)}</span> - {pick(heroContent.footer, language)}
        </PageFooter>
    </div>
);

export default PortfolioHome;
