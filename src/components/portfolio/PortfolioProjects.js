import React from "react";
import {
    FiArrowUpRight,
    FiBox,
    FiCode,
    FiDatabase,
    FiServer,
    FiZap,
} from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import {
    aboutContent,
    portfolioProjects,
    projectsContent,
} from "../../data/portfolioContent";
import { localized, pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const projectIcons = {
    backend: FiServer,
    devops: FiBox,
    performance: FiZap,
    product: FiCode,
};

const toMillis = (value) => {
    if (!value) {
        return 0;
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const toLocalized = (value, fallback) => {
    if (typeof value === "object" && value !== null) {
        return value;
    }

    return localized(value || fallback || "", fallback || value || "");
};

const normalizeProject = (project) => ({
    ...project,
    accent: project.accent || "backend",
    category: toLocalized(project.category, project.categoryVi),
    description: toLocalized(project.description, project.descriptionVi),
    impact: (Array.isArray(project.impact) ? project.impact : []).map((item, index) =>
        toLocalized(item, project.impactVi?.[index] || item)
    ),
    order: Number.isFinite(project.order) ? project.order : 9999,
    period: project.period || "",
    tech: Array.isArray(project.tech) ? project.tech : [],
    title: toLocalized(project.title, project.titleVi),
    url: project.url || "",
});

const sortProjects = (a, b) => {
    if (a.order !== b.order) {
        return a.order - b.order;
    }

    return toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt);
};

const PortfolioProjects = ({ language }) => {
    const [firebaseProjects, setFirebaseProjects] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = firestore.collection("projects").onSnapshot(
            (snapshot) => {
                const nextProjects = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((project) => project.status !== "draft")
                    .map(normalizeProject)
                    .sort(sortProjects);

                setFirebaseProjects(nextProjects);
                setLoading(false);
            },
            () => setLoading(false)
        );

        return () => unsubscribe();
    }, []);

    const projects = firebaseProjects.length
        ? firebaseProjects
        : portfolioProjects.map(normalizeProject).sort(sortProjects);

    return (
        <div className="portfolio-page">
            <section className="portfolio-projects-wrap">
                <div className="portfolio-projects-hero">
                    <div>
                        <div className="portfolio-section-label">{pick(projectsContent.eyebrow, language)}</div>
                        <h1>{pick(projectsContent.title, language)}</h1>
                    </div>
                    <p>{pick(projectsContent.description, language)}</p>
                </div>

                {loading && <div className="portfolio-project-state">Loading projects from Firestore...</div>}

                {!loading && !projects.length && (
                    <div className="portfolio-project-state">No published projects yet.</div>
                )}

                <div className="portfolio-project-showcase">
                    {projects.map((project, index) => {
                        const Icon = projectIcons[project.accent] || FiDatabase;

                        return (
                            <article
                                className={`portfolio-project-showcase-card is-${project.accent}`}
                                key={project.id || pick(project.title, "en")}
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

                                {Boolean(project.impact.length) && (
                                    <div className="portfolio-project-impact">
                                        <strong>{pick(projectsContent.impactLabel, language)}</strong>
                                        <ul>
                                            {project.impact.map((item) => (
                                                <li key={pick(item, "en")}>{pick(item, language)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="portfolio-project-tech">
                                    {project.tech.map((tech) => (
                                        <span className="portfolio-tech-chip" key={tech}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {project.url && (
                                    <a
                                        className="portfolio-project-link"
                                        href={project.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {pick(projectsContent.cta, language)}
                                        <FiArrowUpRight />
                                    </a>
                                )}
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
};

export default PortfolioProjects;
