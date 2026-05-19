import React from "react";
import { FiLayers, FiPlus, FiSave, FiX } from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import RoadmapPhaseCard from "./RoadmapPhaseCard";

const emptyPhaseForm = {
    description: "",
    title: "",
};

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

const RoadmapManager = () => {
    const [draggedPhaseId, setDraggedPhaseId] = React.useState(null);
    const [editingPhaseId, setEditingPhaseId] = React.useState(null);
    const [error, setError] = React.useState("");
    const [form, setForm] = React.useState(emptyPhaseForm);
    const [loading, setLoading] = React.useState(true);
    const [phases, setPhases] = React.useState([]);
    const [saving, setSaving] = React.useState(false);

    const phasesRef = React.useMemo(() => firestore.collection("roadmap"), []);

    React.useEffect(() => {
        setLoading(true);

        const unsubscribe = phasesRef.orderBy("order", "asc").onSnapshot(
            (snapshot) => {
                const nextPhases = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                setPhases(nextPhases);
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [phasesRef]);

    const resetForm = () => {
        setEditingPhaseId(null);
        setForm(emptyPhaseForm);
    };

    const handleEditPhase = (phase) => {
        setEditingPhaseId(phase.id);
        setForm({
            description: phase.description || "",
            title: phase.title || "",
        });
    };

    const handleSavePhase = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        setSaving(true);
        setError("");

        const payload = {
            description: form.description.trim(),
            title: form.title.trim(),
            updatedAt: new Date(),
        };

        try {
            if (editingPhaseId) {
                await phasesRef.doc(editingPhaseId).update(payload);
            } else {
                await phasesRef.add({
                    ...payload,
                    createdAt: new Date(),
                    order: phases.length,
                });
            }

            resetForm();
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePhase = async (phase) => {
        const confirmed = window.confirm(`Delete phase "${phase.title || "Untitled"}" and all milestones?`);

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            const phaseRef = phasesRef.doc(phase.id);
            const milestonesSnapshot = await phaseRef.collection("milestones").get();
            const batch = firestore.batch();

            milestonesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
            batch.delete(phaseRef);

            await batch.commit();
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const handlePhaseDrop = async (targetPhaseId) => {
        if (!draggedPhaseId || draggedPhaseId === targetPhaseId) {
            setDraggedPhaseId(null);
            return;
        }

        const reorderedPhases = reorderById(phases, draggedPhaseId, targetPhaseId);
        const batch = firestore.batch();

        reorderedPhases.forEach((phase, index) => {
            batch.update(phasesRef.doc(phase.id), {
                order: index,
                updatedAt: new Date(),
            });
        });

        try {
            await batch.commit();
        } catch (dropError) {
            setError(dropError.message);
        } finally {
            setDraggedPhaseId(null);
        }
    };

    return (
        <>
            {error && <div className="admin-alert">{error}</div>}

            <section className="admin-manager-hero">
                <div>
                    <p className="admin-kicker">{"// roadmap_firestore"}</p>
                    <h2>Build phases, milestones, and reorder them visually.</h2>
                    <p>
                        Firestore path: <code>roadmap/{`{phaseId}`}/milestones/{`{milestoneId}`}</code>
                    </p>
                </div>
                <div className="admin-hero-icon">
                    <FiLayers />
                </div>
            </section>

            <section className="admin-panel">
                <div className="admin-panel-head">
                    <div>
                        <p className="admin-kicker">{editingPhaseId ? "// edit_phase" : "// new_phase"}</p>
                        <h2>{editingPhaseId ? "Update Phase" : "Create Phase"}</h2>
                    </div>
                    {editingPhaseId && (
                        <button type="button" className="admin-icon-btn" onClick={resetForm} title="Cancel phase edit">
                            <FiX />
                        </button>
                    )}
                </div>

                <form className="admin-form admin-phase-form" onSubmit={handleSavePhase}>
                    <label>
                        Phase title
                        <input
                            value={form.title}
                            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                            placeholder="Backend Foundations"
                            required
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            rows="3"
                            value={form.description}
                            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                            placeholder="What this phase is about..."
                        />
                    </label>
                    <div className="admin-form-actions">
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || !form.title.trim()}>
                            {editingPhaseId ? <FiSave /> : <FiPlus />}
                            {saving ? "Saving..." : editingPhaseId ? "Save Phase" : "Add Phase"}
                        </button>
                    </div>
                </form>
            </section>

            {loading && <div className="admin-empty">Loading roadmap from Firebase...</div>}

            {!loading && !phases.length && (
                <div className="admin-empty">No phases yet. Create the first phase to start your roadmap.</div>
            )}

            <section className="admin-roadmap-board">
                {phases.map((phase) => (
                    <RoadmapPhaseCard
                        draggedPhaseId={draggedPhaseId}
                        key={phase.id}
                        phase={phase}
                        onDeletePhase={handleDeletePhase}
                        onEditPhase={handleEditPhase}
                        onPhaseDragStart={setDraggedPhaseId}
                        onPhaseDrop={handlePhaseDrop}
                    />
                ))}
            </section>
        </>
    );
};

export default RoadmapManager;
