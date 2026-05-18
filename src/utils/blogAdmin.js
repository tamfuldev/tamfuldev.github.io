export const emptyBlogForm = {
    title: "",
    titleVi: "",
    slug: "",
    category: "Laravel, PHP",
    status: "draft",
    excerpt: "",
    excerptVi: "",
    content: "",
    contentVi: "",
    tags: "",
};

export const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

export const normalizeTags = (tags = "") => {
    const source = Array.isArray(tags) ? tags : String(tags || "").split(",");
    const seen = new Set();

    return source
        .map((tag) => String(tag).trim())
        .filter((tag) => {
            const key = tag.toLowerCase();

            if (!key || seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
};

export const getBlogCategories = (blog = {}) => {
    const categoryList = normalizeTags(blog.categories);
    const legacyCategory = normalizeTags(blog.category);

    return normalizeTags([...categoryList, ...legacyCategory]);
};

export const stripHtml = (value = "") =>
    String(value || "")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

export const hasHtmlContent = (value = "") => /<\/?[a-z][\s\S]*>/i.test(String(value || ""));

export const sanitizeRichHtml = (value = "") =>
    String(value || "")
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/\son\w+="[^"]*"/gi, "")
        .replace(/\son\w+='[^']*'/gi, "")
        .replace(/\son\w+=\S+/gi, "")
        .replace(/href=(["'])\s*javascript:[\s\S]*?\1/gi, "href=\"#\"");

export const normalizeRichText = (value = "") => {
    const content = sanitizeRichHtml(value).trim();
    return stripHtml(content) ? content : "";
};

export const mapBlogToForm = (blog) => ({
    title: blog.title || "",
    titleVi: blog.titleVi || "",
    slug: blog.slug || "",
    category: getBlogCategories(blog).join(", ") || "Laravel",
    status: blog.status || "draft",
    excerpt: blog.excerpt || "",
    excerptVi: blog.excerptVi || "",
    content: blog.content || "",
    contentVi: blog.contentVi || "",
    tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
});

export const resolveBlogText = (blog, field, language) => {
    if (language === "vi") {
        return blog[`${field}Vi`] || blog[field] || "";
    }

    return blog[field] || blog[`${field}Vi`] || "";
};

export const estimateReadTime = (blog, language = "en") => {
    const content = resolveBlogText(blog, "content", language) || resolveBlogText(blog, "excerpt", language);
    const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return language === "vi" ? `${minutes} phút đọc` : `${minutes} min read`;
};
