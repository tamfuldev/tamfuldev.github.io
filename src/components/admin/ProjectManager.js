import React from "react";
import { FiEdit2, FiExternalLink, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { auth, firestore } from "../../configs/firebase";
import { hasHtmlContent, normalizeRichText, sanitizeRichHtml, stripHtml } from "../../utils/blogAdmin";
import { quillFormats, quillModules } from "./quillConfig";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PROJECT_COLLECTION = "projects";

const emptyProjectForm = {
    accent: "backend",
    category: "",
    categoryVi: "",
    description: "",
    descriptionVi: "",
    impact: "",
    impactVi: "",
    imageAlt: "",
    imageUrl: "",
    order: "0",
    period: "",
    status: "published",
    tech: "",
    title: "",
    titleVi: "",
    url: "",
};

const accentOptions = ["backend", "performance", "devops", "product"];

const splitTags = (value) =>
    String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const joinTags = (value) => (Array.isArray(value) ? value.join(", ") : "");

const escapeHtml = (value) =>
    String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const legacyListToRichText = (value) => {
    if (!Array.isArray(value)) {
        return value || "";
    }

    const items = value
        .map((item) => String(item || "").trim())
        .filter(Boolean);

    if (!items.length) {
        return "";
    }

    return `<ul>${items
        .map((item) => `<li>${hasHtmlContent(item) ? sanitizeRichHtml(item) : escapeHtml(item)}</li>`)
        .join("")}</ul>`;
};

const toMillis = (value) => {
    if (!value) {
        return 0;
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortProjects = (a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 9999;
    const orderB = Number.isFinite(b.order) ? b.order : 9999;

    if (orderA !== orderB) {
        return orderA - orderB;
    }

    return toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt);
};

const mapProjectToForm = (project) => ({
    accent: project.accent || "backend",
    category: project.category || "",
    categoryVi: project.categoryVi || "",
    description: project.description || "",
    descriptionVi: project.descriptionVi || "",
    impact: legacyListToRichText(project.impact),
    impactVi: legacyListToRichText(project.impactVi),
    imageAlt: project.imageAlt || "",
    imageUrl: project.imageUrl || project.image || project.coverImage || project.thumbnailUrl || "",
    order: String(project.order ?? 0),
    period: project.period || "",
    status: project.status || "published",
    tech: joinTags(project.tech),
    title: project.title || "",
    titleVi: project.titleVi || "",
    url: project.url || "",
});

const ProjectManager = () => {
    const [editingProject, setEditingProject] = React.useState(null);
    const [error, setError] = React.useState("");
    const [form, setForm] = React.useState(emptyProjectForm);
    const [loading, setLoading] = React.useState(true);
    const [projects, setProjects] = React.useState([]);
    const [saving, setSaving] = React.useState(false);

    const projectsRef = React.useMemo(() => firestore.collection(PROJECT_COLLECTION), []);
    const user = auth.currentUser;

    React.useEffect(() => {
        setLoading(true);

        const unsubscribe = projectsRef.onSnapshot(
            (snapshot) => {
                const nextProjects = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort(sortProjects);

                setProjects(nextProjects);
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [projectsRef]);

    const handleChange = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setEditingProject(null);
        setForm(emptyProjectForm);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setForm(mapProjectToForm(project));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        setSaving(true);
        setError("");

        const now = new Date();
        const payload = {
            accent: form.accent,
            category: form.category.trim(),
            categoryVi: form.categoryVi.trim(),
            description: normalizeRichText(form.description),
            descriptionVi: normalizeRichText(form.descriptionVi),
            impact: normalizeRichText(form.impact),
            impactVi: normalizeRichText(form.impactVi),
            imageAlt: form.imageAlt.trim(),
            imageUrl: form.imageUrl.trim(),
            order: Number(form.order) || 0,
            period: form.period.trim(),
            status: form.status,
            tech: splitTags(form.tech),
            title: form.title.trim(),
            titleVi: form.titleVi.trim(),
            updatedAt: now,
            updatedBy: user?.email || "admin",
            url: form.url.trim(),
        };

        try {
            if (editingProject?.id) {
                await projectsRef.doc(editingProject.id).update(payload);
            } else {
                await projectsRef.add({
                    ...payload,
                    createdAt: now,
                    createdBy: user?.email || "admin",
                });
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(`Delete project "${project.title || "Untitled"}"?`);

        if (!confirmed) {
            return;
        }

        try {
            await projectsRef.doc(project.id).delete();
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const handleToggleStatus = async (project) => {
        const nextStatus = project.status === "published" ? "draft" : "published";

        try {
            await projectsRef.doc(project.id).update({
                status: nextStatus,
                updatedAt: new Date(),
                updatedBy: user?.email || "admin",
            });
        } catch (statusError) {
            setError(statusError.message);
        }
    };

    return (
        <>
            {error && <div className="admin-alert">{error}</div>}

            <section className="admin-project-layout">
                <aside className="admin-panel admin-project-editor">
                    <div className="admin-panel-head">
                        <div>
                            <h2>{editingProject ? "Edit Project" : "Create Project"}</h2>
                        </div>
                        {editingProject && (
                            <button type="button" className="admin-icon-btn" onClick={resetForm} title="Cancel edit">
                                <FiX />
                            </button>
                        )}
                    </div>

                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-grid">
                            <label>
                                Title EN
                                <input
                                    value={form.title}
                                    onChange={(event) => handleChange("title", event.target.value)}
                                    placeholder="Scalable API Platform"
                                    required
                                />
                            </label>
                            <label>
                                Title VI
                                <input
                                    value={form.titleVi}
                                    onChange={(event) => handleChange("titleVi", event.target.value)}
                                    placeholder="Nen tang API..."
                                />
                            </label>
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                Category EN
                                <input
                                    value={form.category}
                                    onChange={(event) => handleChange("category", event.target.value)}
                                    placeholder="Backend System"
                                />
                            </label>
                            <label>
                                Category VI
                                <input
                                    value={form.categoryVi}
                                    onChange={(event) => handleChange("categoryVi", event.target.value)}
                                    placeholder="He thong backend"
                                />
                            </label>
                        </div>

                        <label>
                            Description EN
                            <ReactQuill
                                className="admin-quill admin-quill-compact"
                                formats={quillFormats}
                                modules={quillModules}
                                onChange={(value) => setForm((current) => ({ ...current, description: value }))}
                                value={form.description}
                                placeholder="What was built and why it matters..."
                                theme="snow"
                            />
                        </label>

                        <label>
                            Description VI
                            <ReactQuill
                                className="admin-quill admin-quill-compact"
                                formats={quillFormats}
                                modules={quillModules}
                                onChange={(value) => setForm((current) => ({ ...current, descriptionVi: value }))}
                                value={form.descriptionVi}
                                placeholder="Mô tả dự án bằng tiếng Việt..."
                                theme="snow"
                            />
                        </label>

                        <div className="admin-form-grid">
                            <label>
                                Period
                                <input
                                    value={form.period}
                                    onChange={(event) => handleChange("period", event.target.value)}
                                    placeholder="2024 - 2026"
                                />
                            </label>
                            <label>
                                Order
                                <input
                                    min="0"
                                    type="number"
                                    value={form.order}
                                    onChange={(event) => handleChange("order", event.target.value)}
                                />
                            </label>
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                Accent
                                <select value={form.accent} onChange={(event) => handleChange("accent", event.target.value)}>
                                    {accentOptions.map((accent) => (
                                        <option key={accent} value={accent}>
                                            {accent}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Status
                                <select value={form.status} onChange={(event) => handleChange("status", event.target.value)}>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            Tech stack
                            <input
                                value={form.tech}
                                onChange={(event) => handleChange("tech", event.target.value)}
                                placeholder="Laravel, Redis, MySQL"
                            />
                            <small className="admin-field-help">Separate tech items with commas.</small>
                        </label>

                        <label>
                            Impact EN
                            <ReactQuill
                                className="admin-quill admin-quill-compact"
                                formats={quillFormats}
                                modules={quillModules}
                                onChange={(value) => setForm((current) => ({ ...current, impact: value }))}
                                value={form.impact}
                                placeholder="Impact summary, bullets, metrics..."
                                theme="snow"
                            />
                        </label>

                        <label>
                            Impact VI
                            <ReactQuill
                                className="admin-quill admin-quill-compact"
                                formats={quillFormats}
                                modules={quillModules}
                                onChange={(value) => setForm((current) => ({ ...current, impactVi: value }))}
                                value={form.impactVi}
                                placeholder="Tóm tắt tác động, bullet, số liệu..."
                                theme="snow"
                            />
                        </label>

                        <label>
                            Project URL
                            <input
                                value={form.url}
                                onChange={(event) => handleChange("url", event.target.value)}
                                placeholder="https://github.com/..."
                            />
                        </label>

                        <div className="admin-form-grid">
                            <label>
                                Preview image URL
                                <input
                                    value={form.imageUrl}
                                    onChange={(event) => handleChange("imageUrl", event.target.value)}
                                    placeholder="https://.../project-screenshot.jpg"
                                />
                                <small className="admin-field-help">Used as the project card image.</small>
                            </label>
                            <label>
                                Image alt text
                                <input
                                    value={form.imageAlt}
                                    onChange={(event) => handleChange("imageAlt", event.target.value)}
                                    placeholder="Dashboard preview"
                                />
                            </label>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-btn admin-btn-ghost" onClick={resetForm}>
                                Clear
                            </button>
                            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || !form.title.trim()}>
                                <FiSave />
                                {saving ? "Saving..." : editingProject ? "Save Project" : "Create Project"}
                            </button>
                        </div>
                    </form>
                </aside>

                <section className="admin-panel">
                    <div className="admin-panel-head">
                        <div>
                            <h2>Projects</h2>
                        </div>
                    </div>

                    {loading && <div className="admin-empty compact">Loading projects from Firebase...</div>}

                    {!loading && !projects.length && (
                        <div className="admin-empty compact">No projects yet. Create the first portfolio project.</div>
                    )}

                    <div className="admin-project-list">
                        {projects.map((project) => (
                            <article
                                className={`admin-project-card${project.imageUrl ? " has-image" : ""}`}
                                key={project.id}
                            >
                                {project.imageUrl && (
                                    <img
                                        alt={project.imageAlt || project.title || "Project preview"}
                                        className="admin-project-thumb"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.hidden = true;
                                        }}
                                        src={project.imageUrl}
                                    />
                                )}
                                <div>
                                    <div className="admin-project-card-top">
                                        <span className={`admin-status ${project.status || "draft"}`}>
                                            {project.status || "draft"}
                                        </span>
                                        <span className="admin-project-order">#{project.order ?? 0}</span>
                                    </div>
                                    <h3>{project.title || "Untitled project"}</h3>
                                    <p>{stripHtml(project.description) || "No description yet."}</p>
                                    <div className="admin-category-list">
                                        {(project.tech || []).map((tech) => (
                                            <span className="admin-category-chip" key={tech}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="admin-row-actions">
                                    {project.url && (
                                        <a
                                            className="admin-icon-btn small"
                                            href={project.url}
                                            rel="noreferrer"
                                            target="_blank"
                                            title="Open project"
                                        >
                                            <FiExternalLink />
                                        </a>
                                    )}
                                    <button type="button" className="admin-icon-btn small" onClick={() => handleToggleStatus(project)} title="Toggle publish">
                                        {project.status === "published" ? "D" : "P"}
                                    </button>
                                    <button type="button" className="admin-icon-btn small" onClick={() => handleEdit(project)} title="Edit project">
                                        <FiEdit2 />
                                    </button>
                                    <button type="button" className="admin-icon-btn small danger" onClick={() => handleDelete(project)} title="Delete project">
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

export default ProjectManager;
