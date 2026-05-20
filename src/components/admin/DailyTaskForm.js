import { FiPlus, FiSave, FiX } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillFormats, quillModules } from "./quillConfig";

const DailyTaskForm = ({
    editingTaskId,
    form,
    onCancel,
    onChange,
    onSubmit,
    saving,
}) => (
    <form className="admin-form admin-task-form" onSubmit={onSubmit}>
        <label>
            Task title
            <input
                value={form.title}
                onChange={(event) => onChange("title", event.target.value)}
                placeholder="Review Laravel queue worker"
                required
            />
        </label>

        <label>
            Notes
            <ReactQuill
                className="admin-quill admin-quill-compact"
                formats={quillFormats}
                modules={quillModules}
                onChange={(value) => onChange("notes", value)}
                value={form.notes}
                placeholder="Context, blockers, or links..."
                theme="snow"
            />
        </label>

        <div className="admin-form-grid">
            <label>
                Priority
                <select value={form.priority} onChange={(event) => onChange("priority", event.target.value)}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </label>

            <label>
                Status
                <select value={form.status} onChange={(event) => onChange("status", event.target.value)}>
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                </select>
            </label>
        </div>

        <div className="admin-form-actions">
            {editingTaskId && (
                <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>
                    <FiX />
                    Cancel
                </button>
            )}
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || !form.title.trim()}>
                {editingTaskId ? <FiSave /> : <FiPlus />}
                {saving ? "Saving..." : editingTaskId ? "Save Task" : "Add Task"}
            </button>
        </div>
    </form>
);

export default DailyTaskForm;
