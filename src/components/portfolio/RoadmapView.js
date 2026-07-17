import React from "react";
import {
    FiBookOpen,
    FiCheckCircle,
    FiCircle,
    FiClock,
    FiExternalLink,
    FiFlag,
    FiLayers,
    FiTrendingUp,
} from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import { sanitizeRichHtml } from "../../utils/blogAdmin";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const statusMeta = {
    doing: {
        icon: <FiClock />,
        label: {
            en: "Doing",
            vi: "Đang làm",
        },
    },
    done: {
        icon: <FiCheckCircle />,
        label: {
            en: "Done",
            vi: "Đã xong",
        },
    },
    todo: {
        icon: <FiCircle />,
        label: {
            en: "Todo",
            vi: "Cần học",
        },
    },
};

const statusFilters = ["all", "todo", "doing", "done"];

const externalRoadmap = {
    category: {
        en: "roadmap.sh reference",
        vi: "tham khảo roadmap.sh",
    },
    description: {
        en: "Full official Product Manager roadmap diagram.",
        vi: "Sơ dồ Product Manager đầy đủ trên roadmap.sh.",
    },
    source: "roadmap.sh",
    title: "Product Manager",
    url: "https://roadmap.sh/product-manager",
};

const normalizeStatus = (status) => {
    const normalized = String(status || "todo").toLowerCase();

    if (["complete", "completed", "done"].includes(normalized)) {
        return "done";
    }

    if (["doing", "in-progress", "progress", "active"].includes(normalized)) {
        return "doing";
    }

    return "todo";
};

const toMillis = (value) => {
    if (!value) {
        return 0;
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortByOrder = (a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 9999;
    const orderB = Number.isFinite(b.order) ? b.order : 9999;

    if (orderA !== orderB) {
        return orderA - orderB;
    }

    return toMillis(a.createdAt) - toMillis(b.createdAt);
};

const normalizeMilestone = (milestone, index = 0) => ({
    description: milestone.description || milestone.note || "",
    id: milestone.id || `milestone-${index}`,
    order: Number.isFinite(milestone.order) ? milestone.order : index,
    status: normalizeStatus(milestone.status),
    title: milestone.title || milestone.name || "Untitled milestone",
});

const roadmapCopy = {
    allMilestones: {
        en: "All",
        vi: "Tất cả",
    },
    empty: {
        en: "No roadmap phases published yet.",
        vi: "Chưa có phase roadmap nào được public.",
    },
    error: {
        en: "Could not load roadmap data.",
        vi: "Không thể tải dữ liệu roadmap.",
    },
    filterEmpty: {
        en: "No milestones match this filter yet.",
        vi: "Chưa có milestone nào khớp bộ lọc này.",
    },
    footer: {
        en: "Public roadmap - powered",
        vi: "Public roadmap - dữ liệu",
    },
    learningMap: {
        en: "Learning map",
        vi: "Lộ trình học",
    },
    loading: {
        en: "Loading roadmap...",
        vi: "Đang tải roadmap...",
    },
    milestones: {
        en: "Milestones",
        vi: "Milestone",
    },
    phases: {
        en: "Phases",
        vi: "Phase",
    },
    phaseNav: {
        en: "Phase index",
        vi: "Mục lục phase",
    },
    progress: {
        en: "Overall progress",
        vi: "Tiến độ tổng thể",
    },
    status: {
        en: "Status",
        vi: "Trạng thái",
    },
    viewExternal: {
        en: "Open full diagram",
        vi: "Mở sơ đồ đầy đủ",
    },
    subtitle: {
        en: "A focused learning path with phases, progress, and milestone status.",
        vi: "Lộ trình học tập có phase, tiến độ và trạng thái milestone rõ ràng.",
    },
    title: {
        en: "Developer Roadmap",
        vi: "Developer Roadmap",
    },
};

const RoadmapView = ({ language = "en" }) => {
    const [error, setError] = React.useState("");
    const [filter, setFilter] = React.useState("all");
    const [loading, setLoading] = React.useState(true);
    const [phases, setPhases] = React.useState([]);

    React.useEffect(() => {
        let mounted = true;

        const unsubscribe = firestore
            .collection("roadmap")
            .onSnapshot(
                async (snapshot) => {
                    try {
                        const nextPhases = await Promise.all(
                            snapshot.docs.map(async (doc, phaseIndex) => {
                                const phase = { id: doc.id, ...doc.data() };
                                const inlineMilestones = Array.isArray(phase.milestones)
                                    ? phase.milestones.map(normalizeMilestone)
                                    : [];

                                if (inlineMilestones.length) {
                                    return {
                                        ...phase,
                                        order: Number.isFinite(phase.order) ? phase.order : phaseIndex,
                                        milestones: inlineMilestones.sort(sortByOrder),
                                    };
                                }

                                const milestonesSnapshot = await doc.ref
                                    .collection("milestones")
                                    .get();

                                return {
                                    ...phase,
                                    order: Number.isFinite(phase.order) ? phase.order : phaseIndex,
                                    milestones: milestonesSnapshot.docs
                                        .map((milestoneDoc, milestoneIndex) =>
                                            normalizeMilestone(
                                                { id: milestoneDoc.id, ...milestoneDoc.data() },
                                                milestoneIndex
                                            )
                                        )
                                        .sort(sortByOrder),
                                };
                            })
                        );

                        if (!mounted) {
                            return;
                        }

                        setPhases(nextPhases.sort(sortByOrder));
                        setError("");
                        setLoading(false);
                    } catch (loadError) {
                        if (!mounted) {
                            return;
                        }

                        setError(loadError.message);
                        setLoading(false);
                    }
                },
                (snapshotError) => {
                    if (!mounted) {
                        return;
                    }

                    setError(snapshotError.message);
                    setLoading(false);
                }
            );

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const summary = React.useMemo(() => {
        const milestones = phases.flatMap((phase) => phase.milestones || []);
        const done = milestones.filter((milestone) => milestone.status === "done").length;
        const doing = milestones.filter((milestone) => milestone.status === "doing").length;
        const total = milestones.length;
        const todo = Math.max(total - done - doing, 0);

        return {
            doing,
            done,
            phaseCount: phases.length,
            percent: total ? Math.round((done / total) * 100) : 0,
            todo,
            total,
        };
    }, [phases]);

    const visiblePhases = React.useMemo(() => {
        if (filter === "all") {
            return phases;
        }

        return phases
            .map((phase) => ({
                ...phase,
                milestones: (phase.milestones || []).filter((milestone) => milestone.status === filter),
            }))
            .filter((phase) => phase.milestones.length);
    }, [filter, phases]);

    return (
        <div className="portfolio-page">
            <section className="portfolio-roadmap-wrap">
                <header className="portfolio-roadmap-hero">
                    <div>
                        <span className="portfolio-section-label">{pick(roadmapCopy.learningMap, language)}</span>
                        <h1>{pick(roadmapCopy.title, language)}</h1>
                        <p>{pick(roadmapCopy.subtitle, language)}</p>
                    </div>

                    <div className="portfolio-roadmap-progress-card">
                        <span className="portfolio-roadmap-progress-icon">
                            <FiTrendingUp />
                        </span>
                        <div>
                            <span>{pick(roadmapCopy.progress, language)}</span>
                            <strong>{summary.percent}%</strong>
                            <small>{summary.done}/{summary.total} milestones done</small>
                        </div>
                        <div className="portfolio-roadmap-progress-track" aria-hidden="true">
                            <span style={{ width: `${summary.percent}%` }} />
                        </div>
                    </div>
                </header>

                {!loading && !error && Boolean(phases.length) && (
                    <div className="portfolio-roadmap-toolbar">
                        <div className="portfolio-roadmap-stat">
                            <FiLayers />
                            <span>{summary.phaseCount}</span>
                            <small>{pick(roadmapCopy.phases, language)}</small>
                        </div>
                        <div className="portfolio-roadmap-stat">
                            <FiBookOpen />
                            <span>{summary.total}</span>
                            <small>{pick(roadmapCopy.milestones, language)}</small>
                        </div>

                        <div className="portfolio-roadmap-filters" aria-label={pick(roadmapCopy.status, language)}>
                            {statusFilters.map((status) => {
                                const meta = statusMeta[status];
                                const label = status === "all"
                                    ? pick(roadmapCopy.allMilestones, language)
                                    : pick(meta.label, language);
                                const count = status === "all" ? summary.total : summary[status];

                                return (
                                    <button
                                        className={filter === status ? "is-active" : ""}
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        type="button"
                                    >
                                        {meta?.icon}
                                        <span>{label}</span>
                                        <strong>{count}</strong>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <section className="portfolio-roadmap-external" aria-label={externalRoadmap.title}>
                    <div>
                        <span>{pick(externalRoadmap.category, language)}</span>
                        <h2>{externalRoadmap.title}</h2>
                        <p>{pick(externalRoadmap.description, language)}</p>
                    </div>
                    <a href={externalRoadmap.url} rel="noreferrer" target="_blank">
                        <FiExternalLink />
                        {pick(roadmapCopy.viewExternal, language)}
                    </a>
                </section>

                {loading && <div className="portfolio-roadmap-state">{pick(roadmapCopy.loading, language)}</div>}

                {!loading && error && (
                    <div className="portfolio-roadmap-state is-error">
                        {pick(roadmapCopy.error, language)}
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && !phases.length && (
                    <div className="portfolio-roadmap-state">{pick(roadmapCopy.empty, language)}</div>
                )}

                {!loading && !error && Boolean(phases.length) && (
                    <div className="portfolio-roadmap-layout">
                        <aside className="portfolio-roadmap-index" aria-label={pick(roadmapCopy.phaseNav, language)}>
                            <strong>{pick(roadmapCopy.phaseNav, language)}</strong>
                            {phases.map((phase, index) => (
                                <a href={`#roadmap-phase-${phase.id}`} key={phase.id}>
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    {phase.title || phase.name || "Untitled phase"}
                                </a>
                            ))}
                        </aside>

                        {visiblePhases.length ? (
                            <div className="portfolio-roadmap-timeline">
                                {visiblePhases.map((phase) => {
                                    const phaseIndex = phases.findIndex((item) => item.id === phase.id);
                                    const phaseMilestones = phase.milestones || [];
                                    const phaseDone = phaseMilestones.filter((milestone) => milestone.status === "done").length;
                                    const phasePercent = phaseMilestones.length
                                        ? Math.round((phaseDone / phaseMilestones.length) * 100)
                                        : 0;

                                    return (
                                        <article className="portfolio-roadmap-phase" id={`roadmap-phase-${phase.id}`} key={phase.id}>
                                            <div className="portfolio-roadmap-marker">
                                                <span>{String(phaseIndex + 1).padStart(2, "0")}</span>
                                            </div>

                                            <div className="portfolio-roadmap-card">
                                                <div className="portfolio-roadmap-card-head">
                                                    <div>
                                                        <span className="portfolio-roadmap-phase-kicker">
                                                            Phase {phaseIndex + 1}
                                                        </span>
                                                        <h2>{phase.title || phase.name || "Untitled phase"}</h2>
                                                    </div>
                                                    <div className="portfolio-roadmap-phase-meta">
                                                        <span>{phasePercent}%</span>
                                                        <FiFlag />
                                                    </div>
                                                </div>

                                                {phase.description && (
                                                    <div
                                                        className="portfolio-roadmap-rich"
                                                        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(phase.description) }}
                                                    />
                                                )}

                                                <div className="portfolio-roadmap-milestones">
                                                    {phaseMilestones.map((milestone) => {
                                                        const meta = statusMeta[milestone.status] || statusMeta.todo;

                                                        return (
                                                            <div
                                                                className={`portfolio-roadmap-milestone is-${milestone.status}`}
                                                                key={milestone.id}
                                                            >
                                                                <span className="portfolio-roadmap-status-icon">
                                                                    {meta.icon}
                                                                </span>
                                                                <div>
                                                                    <strong>{milestone.title}</strong>
                                                                    {milestone.description && (
                                                                        <div
                                                                            className="portfolio-roadmap-milestone-description"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: sanitizeRichHtml(milestone.description),
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <span className={`portfolio-roadmap-badge is-${milestone.status}`}>
                                                                    {pick(meta.label, language)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}

                                                    {!phaseMilestones.length && (
                                                        <div className="portfolio-roadmap-milestone is-empty">
                                                            <span className="portfolio-roadmap-status-icon">
                                                                <FiCircle />
                                                            </span>
                                                            <div>
                                                                <strong>No milestones yet</strong>
                                                                <small>Add milestones in admin to show them here.</small>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="portfolio-roadmap-state">{pick(roadmapCopy.filterEmpty, language)}</div>
                        )}
                    </div>
                )}
            </section>

            <PageFooter language={language}>{pick(roadmapCopy.footer, language)}</PageFooter>
        </div>
    );
};

export default RoadmapView;
