import { FiArchive, FiCheckCircle, FiEdit3, FiGrid } from "react-icons/fi";
import { getBlogCategories } from "../../utils/blogAdmin";

const BlogStats = ({ blogs }) => {
    const published = blogs.filter((blog) => blog.status === "published").length;
    const drafts = blogs.filter((blog) => blog.status === "draft").length;
    const categories = new Set(blogs.flatMap((blog) => getBlogCategories(blog))).size;

    const stats = [
        { label: "Total posts", value: blogs.length, icon: FiGrid },
        { label: "Published", value: published, icon: FiCheckCircle },
        { label: "Drafts", value: drafts, icon: FiEdit3 },
        { label: "Categories", value: categories, icon: FiArchive },
    ];

    return (
        <section className="admin-stats">
            {stats.map(({ icon: Icon, label, value }) => (
                <article className="admin-stat-card" key={label}>
                    <Icon />
                    <span>{label}</span>
                    <strong>{value}</strong>
                </article>
            ))}
        </section>
    );
};

export default BlogStats;
