import React from "react";
import { createPortal } from "react-dom";
import {
    FiArrowUpRight,
    FiBox,
    FiCode,
    FiDatabase,
    FiArchive,
    FiFolder,
    FiGlobe,
    FiInfo,
    FiServer,
    FiX,
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
import { hasHtmlContent, normalizeRichText, sanitizeRichHtml } from "../../utils/blogAdmin";

const projectIcons = {
    backend: FiServer,
    devops: FiBox,
    performance: FiZap,
    product: FiCode,
};

const projectPreviewImages = {
    backend: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    devops: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    performance: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    product: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
};

const projectCopy = {
    en: {
        close: "Close",
        demo: "Live demo",
        details: "Details",
        links: "Links",
        project: "Project",
        repository: "Repository",
        techStack: "Tech stack",
    },
    vi: {
        close: "Đóng",
        demo: "Xem demo",
        details: "Chi tiết",
        links: "Liên kết",
        project: "Dự án",
        repository: "Kho lưu trữ",
        techStack: "Công nghệ",
    },
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

const toLocalizedImpact = (project) => {
    if (Array.isArray(project.impact) || Array.isArray(project.impactVi)) {
        const englishImpact = Array.isArray(project.impact)
            ? project.impact
            : project.impact
                ? [project.impact]
                : [];
        const vietnameseImpact = Array.isArray(project.impactVi) ? project.impactVi : [];

        return englishImpact.map((item, index) =>
            toLocalized(item, vietnameseImpact[index] || item)
        );
    }

    return toLocalized(project.impact, project.impactVi);
};

const normalizeImageUrl = (value) => {
    const imageUrl = String(value || "").trim();

    if (/^(https?:\/\/|\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(imageUrl)) {
        return imageUrl;
    }

    return "";
};

const getProjectImage = (project) =>
    normalizeImageUrl(project.imageUrl || project.image || project.coverImage || project.thumbnailUrl) ||
    projectPreviewImages[project.accent] ||
    projectPreviewImages.backend;

const normalizeProject = (project) => ({
    ...project,
    accent: project.accent || "backend",
    category: toLocalized(project.category, project.categoryVi),
    demoUrl: project.demoUrl || project.liveUrl || project.url || "",
    description: toLocalized(project.description, project.descriptionVi),
    impact: toLocalizedImpact(project),
    imageAlt: project.imageAlt || "",
    imageUrl: getProjectImage(project),
    order: Number.isFinite(project.order) ? project.order : 9999,
    period: project.period || "",
    projectUrl: project.projectUrl || project.productUrl || project.caseStudyUrl || "",
    repositoryUrl: project.repositoryUrl || project.repoUrl || project.githubUrl || project.sourceUrl || "",
    sourceUrl: project.sourceUrl || project.repositoryUrl || project.repoUrl || project.githubUrl || "",
    tech: Array.isArray(project.tech) ? project.tech : [],
    title: toLocalized(project.title, project.titleVi),
    url: project.url || "",
});

const hasDisplayContent = (value) => Boolean(normalizeRichText(value));

const RichProjectContent = ({ className, value }) => {
    const content = normalizeRichText(value);

    if (!content) {
        return null;
    }

    if (hasHtmlContent(content)) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }}
            />
        );
    }

    return <div className={className}>{content}</div>;
};

const ProjectImpactContent = ({ language, project }) => {
    const hasImpact = Array.isArray(project.impact)
        ? project.impact.some((item) => hasDisplayContent(pick(item, language)))
        : hasDisplayContent(pick(project.impact, language));

    if (!hasImpact) {
        return null;
    }

    return (
        <div className="portfolio-project-impact">
            <strong className="label-impact">{pick(projectsContent.impactLabel, language)}</strong>
            {Array.isArray(project.impact) ? (
                <ul>
                    {project.impact.map((item) => {
                        const impact = pick(item, language);

                        return hasDisplayContent(impact) ? (
                            <li key={pick(item, "en") || impact}>
                                <RichProjectContent
                                    className="portfolio-project-impact-item"
                                    value={impact}
                                />
                            </li>
                        ) : null;
                    })}
                </ul>
            ) : (
                <RichProjectContent
                    className="portfolio-project-impact-rich"
                    value={pick(project.impact, language)}
                />
            )}
        </div>
    );
};

const sortProjects = (a, b) => {
    if (a.order !== b.order) {
        return a.order - b.order;
    }

    return toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt);
};

const PortfolioProjects = ({ language }) => {
    const copy = projectCopy[language] || projectCopy.en;
    const [firebaseProjects, setFirebaseProjects] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedProject, setSelectedProject] = React.useState(null);

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

    React.useEffect(() => {
        if (!selectedProject) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedProject(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedProject]);

    React.useEffect(() => {
        if (!selectedProject) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedProject]);

    const projects = firebaseProjects.length ? firebaseProjects : portfolioProjects.map(normalizeProject).sort(sortProjects);
    const selectedProjectTitle = selectedProject ? pick(selectedProject.title, language) : "";
    const selectedProjectDescription = selectedProject ? pick(selectedProject.description, language) : "";
    const selectedDemoUrl = selectedProject?.demoUrl || selectedProject?.url;
    const selectedProjectUrl = selectedProject?.projectUrl;
    const selectedRepositoryUrl = selectedProject?.repositoryUrl || selectedProject?.sourceUrl;

    return (
        <div className="portfolio-page">
            <section className="portfolio-projects-wrap">
                <div className="portfolio-projects-hero">
                    <div>
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
                        const projectTitle = pick(project.title, language);
                        const demoUrl = project.demoUrl || project.url;
                        const projectUrl = project.projectUrl;
                        const repositoryUrl = project.repositoryUrl || project.sourceUrl;

                        return (
                            <article
                                className={`portfolio-project-showcase-card is-${project.accent}`}
                                key={project.id || pick(project.title, "en")}
                                style={{ "--project-index": index }}
                            >
                                <div className="portfolio-project-card-orb"></div>
                                <div className="portfolio-project-preview">
                                    <img
                                        alt={project.imageAlt || `${projectTitle} preview`}
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.hidden = true;
                                        }}
                                        src={project.imageUrl}
                                    />
                                </div>
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

                                <h2>{projectTitle}</h2>
                                <button
                                    className="portfolio-project-detail-trigger"
                                    onClick={() => setSelectedProject(project)}
                                    type="button"
                                >
                                    <FiInfo />
                                    {copy.details}
                                </button>

                                <div className="portfolio-project-tech">
                                    {project.tech.map((tech) => (
                                        <span className="portfolio-tech-chip" key={tech}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {(demoUrl || projectUrl || repositoryUrl) && (
                                    <div className="portfolio-project-actions">
                                        {demoUrl && (
                                            <a
                                                className="portfolio-project-link is-demo"
                                                href={demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <FiGlobe />
                                                {copy.demo}
                                                <FiArrowUpRight />
                                            </a>
                                        )}
                                        {projectUrl && (
                                            <a
                                                className="portfolio-project-link is-project"
                                                href={projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <FiFolder />
                                                {copy.project}
                                                <FiArrowUpRight />
                                            </a>
                                        )}
                                        {repositoryUrl && (
                                            <a
                                                className="portfolio-project-link is-repository"
                                                href={repositoryUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <FiArchive />
                                                {copy.repository}
                                                <FiArrowUpRight />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>

            {selectedProject && typeof document !== "undefined" && createPortal(
                <div className="portfolio-app portfolio-project-modal-root">
                    <div
                        className="portfolio-project-modal-backdrop"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                setSelectedProject(null);
                            }
                        }}
                        role="presentation"
                    >
                        <section
                            aria-labelledby="portfolio-project-modal-title"
                            aria-modal="true"
                            className={`portfolio-project-modal is-${selectedProject.accent}`}
                            role="dialog"
                        >
                            <button
                                aria-label={copy.close}
                                className="portfolio-project-modal-close"
                                onClick={() => setSelectedProject(null)}
                                type="button"
                            >
                                <FiX />
                            </button>

                            <div className="portfolio-project-modal-hero">
                                <img
                                    alt={selectedProject.imageAlt || `${selectedProjectTitle} preview`}
                                    onError={(event) => {
                                        event.currentTarget.hidden = true;
                                    }}
                                    src={selectedProject.imageUrl}
                                />
                                <div className="portfolio-project-modal-hero-content">
                                    <div className="portfolio-project-meta">
                                        <span>{pick(selectedProject.category, language)}</span>
                                        <span>{selectedProject.period}</span>
                                    </div>

                                    <h2 id="portfolio-project-modal-title">{selectedProjectTitle}</h2>
                                </div>
                            </div>

                            <div className="portfolio-project-modal-body">
                                <div className="portfolio-project-modal-main">
                                    <RichProjectContent
                                        className="portfolio-project-description portfolio-project-modal-description"
                                        value={selectedProjectDescription}
                                    />

                                    <ProjectImpactContent language={language} project={selectedProject} />
                                </div>

                                <aside className="portfolio-project-modal-sidebar">
                                    {selectedProject.tech.length > 0 && (
                                        <div className="portfolio-project-modal-section">
                                            <strong>{copy.techStack}</strong>
                                            <div className="portfolio-project-tech">
                                                {selectedProject.tech.map((tech) => (
                                                    <span className="portfolio-tech-chip" key={tech}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(selectedDemoUrl || selectedProjectUrl || selectedRepositoryUrl) && (
                                        <div className="portfolio-project-modal-section">
                                            <strong>{copy.links}</strong>
                                            <div className="portfolio-project-actions portfolio-project-modal-actions">
                                                {selectedDemoUrl && (
                                                    <a
                                                        className="portfolio-project-link is-demo"
                                                        href={selectedDemoUrl}
                                                        rel="noreferrer"
                                                        target="_blank"
                                                    >
                                                        <FiGlobe />
                                                        {copy.demo}
                                                        <FiArrowUpRight />
                                                    </a>
                                                )}
                                                {selectedProjectUrl && (
                                                    <a
                                                        className="portfolio-project-link is-project"
                                                        href={selectedProjectUrl}
                                                        rel="noreferrer"
                                                        target="_blank"
                                                    >
                                                        <FiFolder />
                                                        {copy.project}
                                                        <FiArrowUpRight />
                                                    </a>
                                                )}
                                                {selectedRepositoryUrl && (
                                                    <a
                                                        className="portfolio-project-link is-repository"
                                                        href={selectedRepositoryUrl}
                                                        rel="noreferrer"
                                                        target="_blank"
                                                    >
                                                        <FiArchive />
                                                        {copy.repository}
                                                        <FiArrowUpRight />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </aside>
                            </div>
                        </section>
                    </div>
                </div>,
                document.body
            )}

            <PageFooter>
                <span>{pick(aboutContent.name, language)}</span> - {pick(projectsContent.footer, language)}
            </PageFooter>
        </div>
    );
};

export default PortfolioProjects;
