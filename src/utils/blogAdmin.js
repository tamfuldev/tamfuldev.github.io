import DOMPurify from "dompurify";

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
    DOMPurify.sanitize(String(value || ""), { USE_PROFILES: { html: true } })
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

export const hasHtmlContent = (value = "") => /<\/?[a-z][\s\S]*>/i.test(String(value || ""));

const hasImageContent = (value = "") => /<img\b[^>]*\bsrc=(["'])[^"']+\1[^>]*>/i.test(String(value || ""));

const richHtmlSanitizeConfig = {
    ALLOWED_TAGS: [
        "a",
        "b",
        "blockquote",
        "br",
        "code",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "iframe",
        "i",
        "img",
        "li",
        "ol",
        "p",
        "pre",
        "s",
        "span",
        "strong",
        "u",
        "ul",
    ],
    ALLOWED_ATTR: [
        "allow",
        "allowfullscreen",
        "alt",
        "class",
        "data-checked",
        "data-list",
        "dir",
        "frameborder",
        "height",
        "href",
        "loading",
        "rel",
        "referrerpolicy",
        "sandbox",
        "src",
        "style",
        "target",
        "title",
        "width",
    ],
    ADD_ATTR: ["target"],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|data:image\/(?:png|jpe?g|gif|webp);base64,)/i,
    FORBID_TAGS: ["button", "embed", "form", "input", "link", "meta", "object", "script", "style"],
};

const allowedStyleProperties = new Set(["background-color", "color", "direction", "text-align"]);
const allowedTextAlignValues = new Set(["center", "end", "justify", "left", "right", "start"]);
const allowedDirectionValues = new Set(["ltr", "rtl"]);
const trustedVideoHosts = ["youtube.com", "youtube-nocookie.com", "youtu.be", "vimeo.com", "player.vimeo.com"];

const isSafeCssValue = (property, value) => {
    const normalizedValue = String(value || "").trim().toLowerCase();

    if (!normalizedValue || /(?:expression|javascript:|url\s*\()/i.test(normalizedValue)) {
        return false;
    }

    if (property === "text-align") {
        return allowedTextAlignValues.has(normalizedValue);
    }

    if (property === "direction") {
        return allowedDirectionValues.has(normalizedValue);
    }

    const probe = document.createElement("span");
    probe.style.setProperty(property, value);

    return Boolean(probe.style.getPropertyValue(property));
};

const enforceSafeStyles = (root) => {
    root.querySelectorAll("[style]").forEach((node) => {
        const probe = document.createElement("span");
        const safeDeclarations = [];

        probe.style.cssText = node.getAttribute("style") || "";

        for (let index = 0; index < probe.style.length; index += 1) {
            const property = probe.style.item(index).toLowerCase();
            const value = probe.style.getPropertyValue(property).trim();

            if (allowedStyleProperties.has(property) && isSafeCssValue(property, value)) {
                safeDeclarations.push(`${property}: ${value}`);
            }
        }

        if (safeDeclarations.length > 0) {
            node.setAttribute("style", `${safeDeclarations.join("; ")};`);
        } else {
            node.removeAttribute("style");
        }
    });
};

const isTrustedVideoUrl = (value = "") => {
    try {
        const url = new URL(value, window.location.origin);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

        return (
            url.protocol === "https:" &&
            trustedVideoHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
        );
    } catch {
        return false;
    }
};

const enforceSafeEmbeds = (root) => {
    root.querySelectorAll("iframe").forEach((frame) => {
        const src = frame.getAttribute("src") || "";

        if (!isTrustedVideoUrl(src)) {
            frame.remove();
            return;
        }

        frame.setAttribute("class", `${frame.getAttribute("class") || ""} ql-video`.trim());
        frame.setAttribute("loading", "lazy");
        frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
        frame.setAttribute("allowfullscreen", "true");
    });
};

const enforceSafeRichHtml = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html;

    enforceSafeStyles(template.content);
    enforceSafeEmbeds(template.content);

    template.content.querySelectorAll("a[target=\"_blank\"]").forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    return template.innerHTML;
};

export const sanitizeRichHtml = (value = "") => {
    const sanitized = DOMPurify.sanitize(String(value || ""), richHtmlSanitizeConfig);

    return enforceSafeRichHtml(sanitized);
};

export const normalizeRichText = (value = "") => {
    const content = sanitizeRichHtml(value).trim();
    return stripHtml(content) || hasImageContent(content) ? content : "";
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
