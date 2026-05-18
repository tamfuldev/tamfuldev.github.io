import {
    FiArrowUpRight,
    FiBox,
    FiCode,
    FiDatabase,
    FiServer,
    FiZap,
} from "react-icons/fi";
import {
    aboutContent,
    portfolioProjects,
    projectsContent,
} from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const projectIcons = {
    backend: FiServer,
    devops: FiBox,
    performance: FiZap,
    product: FiCode,
};

const PortfolioProjects = ({ language }) => (
    <div className="portfolio-page">
        <section className="portfolio-projects-wrap">
            <div className="portfolio-projects-hero">
                <div>
                    <div className="portfolio-section-label">{pick(projectsContent.eyebrow, language)}</div>
                    <h1>{pick(projectsContent.title, language)}</h1>
                </div>
                <p>{pick(projectsContent.description, language)}</p>
            </div>

            <div className="portfolio-project-showcase">
                {portfolioProjects.map((project, index) => {
                    const Icon = projectIcons[project.accent] || FiDatabase;

                    return (
                        <article
                            className={`portfolio-project-showcase-card is-${project.accent}`}
                            key={pick(project.title, "en")}
                            style={{ "--project-index": index }}
                        >
                            <div className="portfolio-project-card-orb"></div>
                            <div className="portfolio-project-card-top">
                                <div className="portfolio-project-index">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="portfolio-project-icon">
                                    <Icon />
                                </div>
                            </div>

                            <div className="portfolio-project-meta">
                                <span>{pick(project.category, language)}</span>
                                <span>{project.period}</span>
                            </div>

                            <h2>{pick(project.title, language)}</h2>
                            <p>{pick(project.description, language)}</p>

                            <div className="portfolio-project-impact">
                                <strong>{pick(projectsContent.impactLabel, language)}</strong>
                                <ul>
                                    {project.impact.map((item) => (
                                        <li key={pick(item, "en")}>{pick(item, language)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="portfolio-project-tech">
                                {project.tech.map((tech) => (
                                    <span className="portfolio-tech-chip" key={tech}>
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <a
                                className="portfolio-project-link"
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {pick(projectsContent.cta, language)}
                                <FiArrowUpRight />
                            </a>
                        </article>
                    );
                })}
            </div>
        </section>

        <PageFooter>
            <span>{pick(aboutContent.name, language)}</span> - {pick(projectsContent.footer, language)}
        </PageFooter>
    </div>
);

export default PortfolioProjects;
