import { FiCheck, FiRefreshCw, FiX } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillFormats, quillModules } from "./quillConfig";

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
                    placeholder="Chiến lược Cache Redis..."
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
                <ReactQuill
                    className="admin-quill admin-quill-compact"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={(value) => onChange("excerpt", value)}
                    placeholder="Short summary shown in blog lists..."
                    theme="snow"
                    value={form.excerpt}
                />
            </label>

            <label>
                Excerpt VI
                <ReactQuill
                    className="admin-quill admin-quill-compact"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={(value) => onChange("excerptVi", value)}
                    placeholder="Tóm tắt ngắn blog..."
                    theme="snow"
                    value={form.excerptVi}
                />
            </label>

            <label>
                Content EN
                <ReactQuill
                    className="admin-quill"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={(value) => onChange("content", value)}
                    placeholder="Write the post body here..."
                    theme="snow"
                    value={form.content}
                />
            </label>

            <label>
                Content VI
                <ReactQuill
                    className="admin-quill"
                    formats={quillFormats}
                    modules={quillModules}
                    onChange={(value) => onChange("contentVi", value)}
                    placeholder="Nhập nội dung tiếng việt tại đây..."
                    theme="snow"
                    value={form.contentVi}
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
