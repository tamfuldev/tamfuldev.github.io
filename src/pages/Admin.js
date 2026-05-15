import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import BlogEditor from "../components/admin/BlogEditor";
import BlogStats from "../components/admin/BlogStats";
import BlogTable from "../components/admin/BlogTable";
import BlogToolbar from "../components/admin/BlogToolbar";
import { auth, firestore } from "../configs/firebase";
import "../styles/admin.css";
import {
    emptyBlogForm,
    getBlogCategories,
    mapBlogToForm,
    normalizeTags,
    slugify,
} from "../utils/blogAdmin";

const BLOG_COLLECTION = "blogs";

const toMillis = (value) => {
    if (!value) {
        return 0;
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const Admin = ({ initialMode = "list" }) => {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const [blogs, setBlogs] = React.useState([]);
    const [editorOpen, setEditorOpen] = React.useState(initialMode === "create");
    const [error, setError] = React.useState("");
    const [form, setForm] = React.useState(emptyBlogForm);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [selectedBlog, setSelectedBlog] = React.useState(null);
    const [statusFilter, setStatusFilter] = React.useState("all");
    const user = auth.currentUser;

    React.useEffect(() => {
        setLoading(true);
        const unsubscribe = firestore.collection(BLOG_COLLECTION).onSnapshot(
            (snapshot) => {
                const nextBlogs = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt));

                setBlogs(nextBlogs);
                setError("");
                setLoading(false);
            },
            (snapshotError) => {
                setError(snapshotError.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        if (initialMode === "create") {
            setSelectedBlog(null);
            setForm(emptyBlogForm);
            setEditorOpen(true);
        }
    }, [initialMode]);

    React.useEffect(() => {
        if (!blogId) {
            return;
        }

        const blog = blogs.find((item) => item.id === blogId || item.slug === blogId);

        if (blog) {
            setSelectedBlog(blog);
            setForm(mapBlogToForm(blog));
            setEditorOpen(true);
            setError("");
            return;
        }

        if (!loading) {
            setError(`Blog "${blogId}" was not found.`);
        }
    }, [blogId, blogs, loading]);

    const filteredBlogs = React.useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return blogs.filter((blog) => {
            const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
            const haystack = [
                blog.title,
                blog.titleVi,
                blog.slug,
                getBlogCategories(blog).join(" "),
                blog.excerpt,
                blog.excerptVi,
                Array.isArray(blog.tags) ? blog.tags.join(" ") : "",
            ]
                .join(" ")
                .toLowerCase();

            return matchesStatus && (!keyword || haystack.includes(keyword));
        });
    }, [blogs, search, statusFilter]);

    const handleCreate = () => {
        setSelectedBlog(null);
        setForm(emptyBlogForm);
        setEditorOpen(true);
        navigate("/admin/blog/create");
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setForm(mapBlogToForm(blog));
        setEditorOpen(true);
        navigate(`/admin/blog/edit/${blog.id}`);
    };

    const handleFormChange = (field, value) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const handleGenerateSlug = () => {
        setForm((currentForm) => ({
            ...currentForm,
            slug: slugify(currentForm.title),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        const now = new Date();
        const categories = normalizeTags(form.category);
        const payload = {
            title: form.title.trim(),
            titleVi: form.titleVi.trim(),
            slug: slugify(form.slug || form.title),
            category: categories[0] || "General",
            categories,
            status: form.status,
            excerpt: form.excerpt.trim(),
            excerptVi: form.excerptVi.trim(),
            content: form.content.trim(),
            contentVi: form.contentVi.trim(),
            tags: normalizeTags(form.tags),
            updatedAt: now,
            updatedBy: user?.email || "admin",
        };

        try {
            if (selectedBlog?.id) {
                await firestore.collection(BLOG_COLLECTION).doc(selectedBlog.id).update(payload);
            } else {
                await firestore.collection(BLOG_COLLECTION).add({
                    ...payload,
                    authorEmail: user?.email || "admin",
                    createdAt: now,
                    views: 0,
                });
            }

            setEditorOpen(false);
            setSelectedBlog(null);
            setForm(emptyBlogForm);
            navigate("/admin/blog", { replace: true });
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (blog) => {
        const confirmed = window.confirm(`Delete "${blog.title || "this post"}"?`);

        if (!confirmed) {
            return;
        }

        try {
            await firestore.collection(BLOG_COLLECTION).doc(blog.id).delete();
        } catch (deleteError) {
            setError(deleteError.message);
        }
    };

    const handleTogglePublish = async (blog) => {
        const nextStatus = blog.status === "published" ? "draft" : "published";

        try {
            await firestore.collection(BLOG_COLLECTION).doc(blog.id).update({
                status: nextStatus,
                updatedAt: new Date(),
                updatedBy: user?.email || "admin",
            });
        } catch (publishError) {
            setError(publishError.message);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (logoutError) {
            setError(logoutError.message);
        }
    };

    return (
        <AdminShell user={user} onCreate={handleCreate} onLogout={handleLogout}>
            {error && <div className="admin-alert">{error}</div>}

            <BlogStats blogs={blogs} />
            <BlogToolbar
                search={search}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
            />

            <div className={`admin-workspace${editorOpen ? " has-editor" : ""}`}>
                <BlogTable
                    blogs={filteredBlogs}
                    loading={loading}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onTogglePublish={handleTogglePublish}
                />

                {editorOpen && (
                    <BlogEditor
                        form={form}
                        isEditing={Boolean(selectedBlog)}
                        saving={saving}
                        onCancel={() => {
                            setEditorOpen(false);
                            setSelectedBlog(null);
                            navigate("/admin/blog", { replace: true });
                        }}
                        onChange={handleFormChange}
                        onGenerateSlug={handleGenerateSlug}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </AdminShell>
    );
};

export default Admin;
