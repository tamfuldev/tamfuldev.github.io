import React from "react";
import {
    FiCheckCircle,
    FiEdit2,
    FiMove,
    FiPlus,
    FiSave,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { firestore } from "../../configs/firebase";
import { normalizeRichText, sanitizeRichHtml } from "../../utils/blogAdmin";
import { quillFormats, quillModules } from "./quillConfig";

const emptyMilestoneForm = {
    description: "",
    status: "todo",
    title: "",
};

const milestoneStatuses = [
    { label: "Todo", value: "todo" },
    { label: "Doing", value: "doing" },
    { label: "Done", value: "done" },
];

const reorderById = (items, sourceId, targetId) => {
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return items;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(sourceIndex, 1);
    nextItems.splice(targetIndex, 0, movedItem);

    return nextItems;
};

const RoadmapPhaseCard = ({
    draggedPhaseId,
    onDeletePhase,
    onEditPhase,
    onPhaseDragStart,
    onPhaseDrop,
    phase,
}) => {
    const [draggedMilestoneId, setDraggedMilestoneId] = React.useState(null);
    const [editingMilestoneId, setEditingMilestoneId] = React.useState(null);
    const [form, setForm] = React.useState(emptyMilestoneForm);
    const [loading, setLoading] = React.useState(true);
    const [milestones, setMilestones] = React.useState([]);
    const [saving, setSaving] = React.useState(false);

    const milestonesRef = React.useMemo(
        () => firestore.collection("roadmap").doc(phase.id).collection("milestones"),
        [phase.id]
    );

    React.useEffect(() => {
        setLoading(true);

        const unsubscribe = milestonesRef.orderBy("order", "asc").onSnapshot(
            (snapshot) => {
                const nextMilestones = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                setMilestones(nextMilestones);
                setLoading(false);
            },
            () => setLoading(false)
        );

        return () => unsubscribe();
    }, [milestonesRef]);

    const doneCount = milestones.filter((milestone) => milestone.status === "done").length;

    const resetForm = () => {
        setEditingMilestoneId(null);
        setForm(emptyMilestoneForm);
    };

    const handleEditMilestone = (milestone) => {
        setEditingMilestoneId(milestone.id);
        setForm({
            description: milestone.description || "",
            status: milestone.status || "todo",
            title: milestone.title || "",
        });
    };

    const handleSaveMilestone = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        setSaving(true);

        const payload = {
            description: normalizeRichText(form.description),
            completedAt: form.status === "done" ? new Date() : null,
            status: form.status || "todo",
            title: form.title.trim(),
            updatedAt: new Date(),
        };

        try {
            if (editingMilestoneId) {
                await milestonesRef.doc(editingMilestoneId).update(payload);
            } else {
                await milestonesRef.add({
                    ...payload,
                    createdAt: new Date(),
                    order: milestones.length,
                });
            }

            resetForm();
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMilestone = async (milestone) => {
        const confirmed = window.confirm(`Delete milestone "${milestone.title || "Untitled"}"?`);

        if (!confirmed) {
            return;
        }

        await milestonesRef.doc(milestone.id).delete();
    };

    const handleToggleMilestone = async (milestone) => {
        const nextStatus = milestone.status === "done" ? "todo" : "done";

        await milestonesRef.doc(milestone.id).update({
            completedAt: nextStatus === "done" ? new Date() : null,
            status: nextStatus,
            updatedAt: new Date(),
        });
    };

    const handleMilestoneDrop = async (targetMilestoneId) => {
        if (!draggedMilestoneId || draggedMilestoneId === targetMilestoneId) {
            setDraggedMilestoneId(null);
            return;
        }

        const reorderedMilestones = reorderById(milestones, draggedMilestoneId, targetMilestoneId);
        const batch = firestore.batch();

        reorderedMilestones.forEach((milestone, index) => {
            batch.update(milestonesRef.doc(milestone.id), {
                order: index,
                updatedAt: new Date(),
            });
        });

        await batch.commit();
        setDraggedMilestoneId(null);
    };

    const handlePhaseDragStart = (event) => {
        if (event.target.closest("button, input, textarea, select")) {
            event.preventDefault();
            return;
        }

        onPhaseDragStart(phase.id);
    };

    return (
        <article
            className={`admin-roadmap-phase${draggedPhaseId === phase.id ? " is-dragging" : ""}`}
            draggable
            onDragOver={(event) => event.preventDefault()}
            onDragEnd={() => onPhaseDragStart(null)}
            onDragStart={handlePhaseDragStart}
            onDrop={() => onPhaseDrop(phase.id)}
        >
            <header className="admin-roadmap-phase-head">
                <div className="admin-roadmap-phase-title">
                    <span className="admin-drag-handle" aria-hidden="true">
                        <FiMove />
                    </span>
                    <div>
                        <h2>{phase.title || "Untitled phase"}</h2>
                    </div>
                </div>

                <div className="admin-row-actions">
                    <button type="button" className="admin-icon-btn" onClick={() => onEditPhase(phase)} title="Edit phase">
                        <FiEdit2 />
                    </button>
                    <button type="button" className="admin-icon-btn danger" onClick={() => onDeletePhase(phase)} title="Delete phase">
                        <FiTrash2 />
                    </button>
                </div>
            </header>

            {phase.description && (
                <div
                    className="admin-roadmap-description admin-rich-preview"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(phase.description) }}
                />
            )}

            <div className="admin-roadmap-progress">
                <span>{milestones.length ? `${doneCount}/${milestones.length} done` : "No milestones yet"}</span>
                <div>
                    <span
                        style={{
                            width: milestones.length ? `${Math.round((doneCount / milestones.length) * 100)}%` : "0%",
                        }}
                    />
                </div>
            </div>

            <div className="admin-milestone-list">
                {loading && <div className="admin-empty compact">Loading milestones...</div>}

                {!loading && !milestones.length && (
                    <div className="admin-empty compact">Add the first milestone for this phase.</div>
                )}

                {milestones.map((milestone) => (
                    <div
                        className={`admin-milestone-card is-${milestone.status || "todo"}`}
                        draggable
                        key={milestone.id}
                        onDragOver={(event) => event.preventDefault()}
                        onDragEnd={() => setDraggedMilestoneId(null)}
                        onDragStart={() => setDraggedMilestoneId(milestone.id)}
                        onDrop={() => handleMilestoneDrop(milestone.id)}
                    >
                        <button
                            type="button"
                            className="admin-milestone-toggle"
                            onClick={() => handleToggleMilestone(milestone)}
                            title="Toggle milestone status"
                        >
                            <FiCheckCircle />
                        </button>
                        <div>
                            <strong>{milestone.title}</strong>
                            <span className={`admin-milestone-status is-${milestone.status || "todo"}`}>
                                {milestone.status || "todo"}
                            </span>
                            {milestone.description && (
                                <div
                                    className="admin-rich-preview"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeRichHtml(milestone.description),
                                    }}
                                />
                            )}
                        </div>
                        <div className="admin-row-actions">
                            <button type="button" className="admin-icon-btn small" onClick={() => handleEditMilestone(milestone)} title="Edit milestone">
                                <FiEdit2 />
                            </button>
                            <button type="button" className="admin-icon-btn small danger" onClick={() => handleDeleteMilestone(milestone)} title="Delete milestone">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <form className="admin-inline-form" onSubmit={handleSaveMilestone}>
                <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Milestone title"
                />
                <select
                    aria-label="Milestone status"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                >
                    {milestoneStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <ReactQuill
                    className="admin-quill admin-quill-compact"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={(value) => setForm((current) => ({ ...current, description: value }))}
                    placeholder="Short note"
                    theme="snow"
                    value={form.description}
                />
                <div className="admin-form-actions">
                    {editingMilestoneId && (
                        <button type="button" className="admin-icon-btn" onClick={resetForm} title="Cancel edit">
                            <FiX />
                        </button>
                    )}
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || !form.title.trim()}>
                        {editingMilestoneId ? <FiSave /> : <FiPlus />}
                        {saving ? "Saving..." : editingMilestoneId ? "Save" : "Add"}
                    </button>
                </div>
            </form>
        </article>
    );
};

export default RoadmapPhaseCard;
