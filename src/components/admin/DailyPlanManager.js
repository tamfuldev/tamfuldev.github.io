import React from "react";
import { FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { firestore } from "../../configs/firebase";
import { normalizeRichText, sanitizeRichHtml } from "../../utils/blogAdmin";
import DailyTaskForm from "./DailyTaskForm";

const emptyTaskForm = {
    notes: "",
    priority: "medium",
    status: "todo",
    title: "",
};

const toDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const taskStatusLabel = {
    doing: "Doing",
    done: "Done",
    todo: "Todo",
};

const DailyPlanManager = () => {
    const [dateKey, setDateKey] = React.useState(() => toDateKey());
    const [editingTaskId, setEditingTaskId] = React.useState(null);
    const [error, setError] = React.useState("");
    const [form, setForm] = React.useState(emptyTaskForm);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [tasks, setTasks] = React.useState([]);

    const planRef = React.useMemo(() => firestore.collection("dailyPlan").doc(dateKey), [dateKey]);
    const tasksRef = React.useMemo(() => planRef.collection("tasks"), [planRef]);

    React.useEffect(() => {
        setLoading(true);

        const unsubscribe = tasksRef.orderBy("order", "asc").onSnapshot(
            (snapshot) => {
                const nextTasks = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                setTasks(nextTasks);
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [tasksRef]);

    React.useEffect(() => {
        setEditingTaskId(null);
        setForm(emptyTaskForm);
    }, [dateKey]);

    const taskSummary = React.useMemo(() => {
        const done = tasks.filter((task) => task.status === "done").length;
        const doing = tasks.filter((task) => task.status === "doing").length;
        const high = tasks.filter((task) => task.priority === "high").length;

        return { doing, done, high, total: tasks.length };
    }, [tasks]);

    const handleChange = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setEditingTaskId(null);
        setForm(emptyTaskForm);
    };

    const handleEditTask = (task) => {
        setEditingTaskId(task.id);
        setForm({
            notes: task.notes || "",
            priority: task.priority || "medium",
            status: task.status || "todo",
            title: task.title || "",
        });
    };

    const touchPlan = async () => {
        await planRef.set(
            {
                date: dateKey,
                updatedAt: new Date(),
            },
            { merge: true }
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        setSaving(true);
        setError("");

        const payload = {
            notes: normalizeRichText(form.notes),
            priority: form.priority,
            status: form.status,
            title: form.title.trim(),
            updatedAt: new Date(),
        };

        try {
            await touchPlan();

            if (editingTaskId) {
                await tasksRef.doc(editingTaskId).update(payload);
            } else {
                await tasksRef.add({
                    ...payload,
                    createdAt: new Date(),
                    order: tasks.length,
                });
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (task) => {
        const confirmed = window.confirm(`Delete task "${task.title || "Untitled"}"?`);

        if (!confirmed) {
            return;
        }

        try {
            await tasksRef.doc(task.id).delete();
            await touchPlan();
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const handleToggleTask = async (task) => {
        const nextStatus = task.status === "done" ? "todo" : "done";

        try {
            await tasksRef.doc(task.id).update({
                completedAt: nextStatus === "done" ? new Date() : null,
                status: nextStatus,
                updatedAt: new Date(),
            });
            await touchPlan();
        } catch (toggleError) {
            setError(toggleError.message);
        }
    };

    const handlePriorityChange = async (task, priority) => {
        try {
            await tasksRef.doc(task.id).update({
                priority,
                updatedAt: new Date(),
            });
            await touchPlan();
        } catch (priorityError) {
            setError(priorityError.message);
        }
    };

    return (
        <>
            {error && <div className="admin-alert">{error}</div>}

            <section className="admin-daily-layout">
                <aside className="admin-panel">
                    <div className="admin-panel-head">
                        <div>
                            <h2>Daily Plan</h2>
                        </div>
                    </div>

                    <label className="admin-date-picker">
                        Pick date
                        <input type="date" value={dateKey} onChange={(event) => setDateKey(event.target.value)} />
                    </label>

                    <div className="admin-daily-stats">
                        <div>
                            <strong>{taskSummary.total}</strong>
                            <span>Total</span>
                        </div>
                        <div>
                            <strong>{taskSummary.doing}</strong>
                            <span>Doing</span>
                        </div>
                        <div>
                            <strong>{taskSummary.done}</strong>
                            <span>Done</span>
                        </div>
                        <div>
                            <strong>{taskSummary.high}</strong>
                            <span>High</span>
                        </div>
                    </div>

                    <DailyTaskForm
                        editingTaskId={editingTaskId}
                        form={form}
                        saving={saving}
                        onCancel={resetForm}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                </aside>

                <section className="admin-panel">
                    <div className="admin-panel-head">
                        <div>
                            <p className="admin-kicker">{`// tasks_${dateKey}`}</p>
                            <h2>Tasks</h2>
                        </div>
                    </div>

                    {loading && <div className="admin-empty compact">Loading tasks from Firebase...</div>}

                    {!loading && !tasks.length && (
                        <div className="admin-empty compact">No tasks for this date yet.</div>
                    )}

                    <div className="admin-task-list">
                        {tasks.map((task) => (
                            <article className={`admin-task-card ${task.status === "done" ? "is-done" : ""}`} key={task.id}>
                                <button
                                    type="button"
                                    className="admin-task-toggle"
                                    onClick={() => handleToggleTask(task)}
                                    title="Toggle todo/done"
                                >
                                    <FiCheckCircle />
                                </button>

                                <div className="admin-task-body">
                                    <div className="admin-task-title-row">
                                        <strong>{task.title}</strong>
                                        <span className={`admin-task-priority ${task.priority || "medium"}`}>
                                            {task.priority || "medium"}
                                        </span>
                                    </div>
                                    {task.notes && (
                                        <div
                                            className="admin-rich-preview"
                                            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(task.notes) }}
                                        />
                                    )}
                                    <div className="admin-task-meta">
                                        <span>{taskStatusLabel[task.status] || "Todo"}</span>
                                        <select
                                            value={task.priority || "medium"}
                                            onChange={(event) => handlePriorityChange(task, event.target.value)}
                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-row-actions">
                                    <button type="button" className="admin-icon-btn small" onClick={() => handleEditTask(task)} title="Edit task">
                                        <FiEdit2 />
                                    </button>
                                    <button type="button" className="admin-icon-btn small danger" onClick={() => handleDeleteTask(task)} title="Delete task">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default DailyPlanManager;
