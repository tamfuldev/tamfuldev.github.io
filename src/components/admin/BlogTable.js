import { FiEdit2, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { formatDate, getBlogCategories, stripHtml } from "../../utils/blogAdmin";

const BlogTable = ({ blogs, loading, onDelete, onEdit, onTogglePublish }) => {
    if (loading) {
        return <div className="admin-empty">Loading blogs from Firebase...</div>;
    }

    if (!blogs.length) {
        return <div className="admin-empty">No blog posts match this view.</div>;
    }

    return (
        <section className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => {
                        const categories = getBlogCategories(blog);

                        return (
                            <tr key={blog.id}>
                                <td>
                                    <strong>{blog.title || "Untitled post"}</strong>
                                    <span>{stripHtml(blog.excerpt) || blog.slug || "No excerpt yet"}</span>
                                </td>
                                <td>
                                    <div className="admin-category-list">
                                        {categories.length
                                            ? categories.map((category) => (
                                                <span className="admin-category-chip" key={category}>
                                                    {category}
                                                </span>
                                            ))
                                            : "-"}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className={`admin-status ${blog.status || "draft"}`}
                                        onClick={() => onTogglePublish(blog)}
                                    >
                                        {blog.status || "draft"}
                                    </button>
                                </td>
                                <td>{formatDate(blog.updatedAt || blog.createdAt)}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <a
                                            className="admin-icon-btn"
                                            href={`/blog/${blog.slug || blog.id}`}
                                            title="Open public blog detail"
                                        >
                                            <FiExternalLink />
                                        </a>
                                        <button
                                            type="button"
                                            className="admin-icon-btn"
                                            onClick={() => onEdit(blog)}
                                            title="Edit post"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => onDelete(blog)}
                                            title="Delete post"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
};

export default BlogTable;
