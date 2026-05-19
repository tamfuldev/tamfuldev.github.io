import React from "react";
import { FiCheckCircle, FiCircle, FiClock, FiFlag, FiTrendingUp } from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const statusMeta = {
    doing: {
        icon: <FiClock />,
        label: "Doing",
    },
    done: {
        icon: <FiCheckCircle />,
        label: "Done",
    },
    todo: {
        icon: <FiCircle />,
        label: "Todo",
    },
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
    empty: {
        en: "No roadmap phases published yet.",
        vi: "Chưa có phase roadmap nào được public.",
    },
    error: {
        en: "Could not load roadmap data from Firestore.",
        vi: "Không thể tải dữ liệu roadmap từ Firestore.",
    },
    footer: {
        en: "Public roadmap - powered by Firestore",
        vi: "Public roadmap - dữ liệu từ Firestore",
    },
    loading: {
        en: "Loading roadmap from Firestore...",
        vi: "Đang tải roadmap từ Firestore...",
    },
    progress: {
        en: "Overall progress",
        vi: "Tiến độ tổng thể",
    },
    subtitle: {
        en: "A public timeline of phases and milestones, updated from Firestore without requiring login.",
        vi: "Timeline public của các phase và milestone, cập nhật từ Firestore và không cần đăng nhập.",
    },
    title: {
        en: "Roadmap",
        vi: "Roadmap",
    },
};

const RoadmapView = ({ language = "en" }) => {
    const [error, setError] = React.useState("");
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
        const total = milestones.length;

        return {
            done,
            percent: total ? Math.round((done / total) * 100) : 0,
            total,
        };
    }, [phases]);

    return (
        <div className="portfolio-page">
            <section className="portfolio-roadmap-wrap">
                <header className="portfolio-roadmap-hero">
                    <div>
                        <div className="portfolio-section-label">{"// firestore_public_view"}</div>
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
                    <div className="portfolio-roadmap-timeline">
                        {phases.map((phase, index) => (
                            <article className="portfolio-roadmap-phase" key={phase.id}>
                                <div className="portfolio-roadmap-marker">
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                </div>

                                <div className="portfolio-roadmap-card">
                                    <div className="portfolio-roadmap-card-head">
                                        <div>
                                            <span className="portfolio-roadmap-phase-kicker">
                                                Phase {index + 1}
                                            </span>
                                            <h2>{phase.title || phase.name || "Untitled phase"}</h2>
                                        </div>
                                        <FiFlag />
                                    </div>

                                    {phase.description && <p>{phase.description}</p>}

                                    <div className="portfolio-roadmap-milestones">
                                        {(phase.milestones || []).map((milestone) => {
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
                                                        {milestone.description && <small>{milestone.description}</small>}
                                                    </div>
                                                    <span className={`portfolio-roadmap-badge is-${milestone.status}`}>
                                                        {meta.label}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {!phase.milestones?.length && (
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
                        ))}
                    </div>
                )}
            </section>

            <PageFooter>{pick(roadmapCopy.footer, language)}</PageFooter>
        </div>
    );
};

export default RoadmapView;
