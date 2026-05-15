import { FiCheck, FiRefreshCw, FiX } from "react-icons/fi";

const BlogEditor = ({
    form,
    isEditing,
    saving,
    onCancel,
    onChange,
    onGenerateSlug,
    onSubmit,
}) => (
    <aside className="admin-editor">
        <div className="admin-editor-head">
            <div>
                <p className="admin-kicker">{isEditing ? "// edit_post" : "// new_post"}</p>
                <h2>{isEditing ? "Edit Blog" : "Create Blog"}</h2>
            </div>
            <button type="button" className="admin-icon-btn" onClick={onCancel} title="Close editor">
                <FiX />
            </button>
        </div>

        <form onSubmit={onSubmit} className="admin-form">
            <label>
                Title EN
                <input
                    value={form.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    placeholder="Redis caching strategies..."
                    required
                />
            </label>

            <label>
                Title VI
                <input
                    value={form.titleVi}
                    onChange={(event) => onChange("titleVi", event.target.value)}
                    placeholder="Chien luoc cache Redis..."
                />
            </label>

            <label>
                Slug
                <div className="admin-inline-input">
                    <input
                        value={form.slug}
                        onChange={(event) => onChange("slug", event.target.value)}
                        placeholder="redis-caching-strategies"
                        required
                    />
                    <button type="button" onClick={onGenerateSlug} title="Generate slug">
                        <FiRefreshCw />
                    </button>
                </div>
            </label>

            <div className="admin-form-grid">
                <label>
                    Categories
                    <input
                        value={form.category}
                        onChange={(event) => onChange("category", event.target.value)}
                        placeholder="Laravel, PHP, Firebase"
                    />
                    <small className="admin-field-help">
                        Add unlimited categories, separated by commas. Saved to Firebase as categories[].
                    </small>
                </label>
                <label>
                    Status
                    <select
                        value={form.status}
                        onChange={(event) => onChange("status", event.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </label>
            </div>

            <label>
                Excerpt EN
                <textarea
                    value={form.excerpt}
                    onChange={(event) => onChange("excerpt", event.target.value)}
                    placeholder="Short summary shown in blog lists..."
                    rows={3}
                />
            </label>

            <label>
                Excerpt VI
                <textarea
                    value={form.excerptVi}
                    onChange={(event) => onChange("excerptVi", event.target.value)}
                    placeholder="Tom tat ngan hien thi o danh sach blog..."
                    rows={3}
                />
            </label>

            <label>
                Content EN
                <textarea
                    value={form.content}
                    onChange={(event) => onChange("content", event.target.value)}
                    placeholder="Write the post body here..."
                    rows={9}
                />
            </label>

            <label>
                Content VI
                <textarea
                    value={form.contentVi}
                    onChange={(event) => onChange("contentVi", event.target.value)}
                    placeholder="Nhap noi dung tieng Viet tai day..."
                    rows={9}
                />
            </label>

            <label>
                Tags
                <input
                    value={form.tags}
                    onChange={(event) => onChange("tags", event.target.value)}
                    placeholder="laravel, redis, performance"
                />
            </label>

            <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                    <FiCheck />
                    {saving ? "Saving..." : "Save Blog"}
                </button>
            </div>
        </form>
    </aside>
);

export default BlogEditor;
