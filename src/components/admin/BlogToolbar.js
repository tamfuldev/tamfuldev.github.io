import { FiFilter, FiSearch } from "react-icons/fi";

const BlogToolbar = ({ search, statusFilter, onSearchChange, onStatusFilterChange }) => (
    <section className="admin-toolbar">
        <label className="admin-search">
            <FiSearch />
            <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search title, excerpt, categories..."
            />
        </label>

        <label className="admin-select">
            <FiFilter />
            <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value)}
            >
                <option value="all">All status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
            </select>
        </label>
    </section>
);

export default BlogToolbar;
