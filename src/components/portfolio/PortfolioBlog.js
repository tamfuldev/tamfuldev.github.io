import React from "react";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import {
    aboutContent,
    blogContent,
} from "../../data/portfolioContent";
import { firestore } from "../../configs/firebase";
import {
    estimateReadTime,
    formatDate,
    getBlogCategories,
    hasHtmlContent,
    resolveBlogText,
    sanitizeRichHtml,
    stripHtml,
} from "../../utils/blogAdmin";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";
import BlogEngagement from "./BlogEngagement";

const BLOG_COLLECTION = "blogs";
const PAGE_SIZE = 5;

const blogCopy = {
    en: {
        all: "All",
        allDates: "All dates",
        allHashtags: "All hashtags",
        back: "< Back to blogs",
        breadcrumbBlog: "Blog",
        breadcrumbHome: "Home",
        empty: "No blog posts match these filters.",
        filterTitle: "Topics",
        hashtagLabel: "Filter by hashtag",
        loadMore: "Load more posts",
        loading: "Loading blog posts...",
        notFound: "This blog post was not found or is not published yet.",
        openPost: "Open blog post",
        readPost: "Read post",
        reads: (views) => `${views} reads`,
        resultCount: (count) => `${count} ${count === 1 ? "post" : "posts"} found`,
        searchLabel: "Search blogs",
        searchPlaceholder: "Search blog title, content, category, hashtag...",
        selectDateLabel: "Time",
        sortLabel: "Sort blogs",
        sortOptions: [
            { id: "newest", label: "Newest -> Oldest" },
            { id: "oldest", label: "Oldest -> Newest" },
            { id: "popular", label: "Popular / Most read" },
        ],
        toc: "Contents",
    },
    vi: {
        all: "Tất cả",
        allDates: "Tất cả ngay",
        allHashtags: "Tất cả hashtag",
        back: "< Quay lại blog",
        empty: "Không có bài viết phù hợp với bộ lọc.",
        hashtagLabel: "Lọc theo hashtag",
        loadMore: "Tải thêm bài viết",
        loading: "Đang tải bài viết...",
        notFound: "Không tìm thấy bài viết hoặc bài viết chưa được published.",
        openPost: "Mở bài viết",
        reads: (views) => `${views} lướt đọc`,
        resultCount: (count) => `${count} bài viết phù hợp`,
        searchLabel: "Tìm blog",
        searchPlaceholder: "Tìm blog theo tiêu đề, nội dung, category, hashtag...",
        sortLabel: "Sắp xếp blog",
        sortOptions: [
            { id: "newest", label: "Mới nhất -> Cũ nhất" },
            { id: "oldest", label: "Cũ nhất -> Mới nhất" },
            { id: "popular", label: "Phổ biến / Nhiều lướt đọc nhất" },
        ],
        toc: "Mục lục",
    },
};

blogCopy.vi = {
    all: "Tất cả",
    allDates: "Tất cả thời gian",
    allHashtags: "Tất cả hashtag",
    back: "< Quay lại blog",
    breadcrumbBlog: "Bài viết",
    breadcrumbHome: "Trang chủ",
    empty: "Chưa có bài viết phù hợp với bộ lọc hiện tại.",
    filterTitle: "Chủ đề",
    hashtagLabel: "Lọc theo hashtag",
    loadMore: "Tải thêm bài viết",
    loading: "Đang tải bài viết...",
    notFound: "Không tìm thấy bài viết hoặc bài viết chưa được xuất bản.",
    openPost: "Mở bài viết",
    readPost: "Đọc bài",
    reads: (views) => `${views} lượt đọc`,
    resultCount: (count) => `${count} bài viết phù hợp`,
    searchLabel: "Tìm kiếm",
    searchPlaceholder: "Tìm theo tiêu đề, nội dung, chủ đề hoặc hashtag...",
    selectDateLabel: "Thời gian",
    sortLabel: "Sắp xếp",
    sortOptions: [
        { id: "newest", label: "Mới nhất trước" },
        { id: "oldest", label: "Cũ nhất trước" },
        { id: "popular", label: "Nhiều lượt đọc" },
    ],
    toc: "Mục lục",
};

const toMillis = (value) => {
    if (!value) {
        return 0;
    }

    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const normalizeFilter = (value) =>
    String(value || "")
        .trim()
        .replace(/^#/, "")
        .toLowerCase();

const getPostTags = (post) =>
    Array.isArray(post.tags) ? post.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];

const uniqueFilters = (items) => {
    const filterMap = new Map();

    items.forEach((item) => {
        const id = normalizeFilter(item);

        if (id && !filterMap.has(id)) {
            filterMap.set(id, String(item).trim());
        }
    });

    return Array.from(filterMap, ([id, label]) => ({ id, label }));
};

const getPostDateValue = (post) => post.updatedAt || post.createdAt;

const getPostMonthKey = (post) => {
    const millis = toMillis(getPostDateValue(post));

    if (!millis) {
        return "";
    }

    const date = new Date(millis);
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${date.getFullYear()}-${month}`;
};

const formatMonthLabel = (monthKey, language) => {
    const [year, month] = monthKey.split("-").map(Number);

    if (!year || !month) {
        return monthKey;
    }

    return new Date(year, month - 1, 1).toLocaleDateString(
        language === "vi" ? "vi-VN" : "en-US",
        {
            month: "short",
            year: "numeric",
        }
    );
};

const buildBlogHaystack = (post) =>
    [
        post.title,
        post.titleVi,
        post.slug,
        stripHtml(post.excerpt),
        stripHtml(post.excerptVi),
        stripHtml(post.content),
        stripHtml(post.contentVi),
        getBlogCategories(post).join(" "),
        getPostTags(post).join(" "),
    ]
        .join(" ")
        .toLowerCase();

const splitContentBlocks = (content) =>
    content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

const createHeadingId = (text, index, usedIds) => {
    const baseId = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `section-${index + 1}`;
    let id = baseId;
    let duplicateIndex = 2;

    while (usedIds.has(id)) {
        id = `${baseId}-${duplicateIndex}`;
        duplicateIndex += 1;
    }

    usedIds.add(id);
    return id;
};

const buildBlogDetailHtml = (content) => {
    const template = document.createElement("template");
    const usedIds = new Set();
    const sanitizedContent = sanitizeRichHtml(content);

    template.innerHTML = sanitizedContent;

    const tocItems = Array.from(template.content.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading, index) => {
        const title = stripHtml(heading.textContent || "").trim();
        const id = heading.id || createHeadingId(title, index, usedIds);

        heading.id = id;

        return {
            id,
            level: heading.tagName.toLowerCase(),
            title,
        };
    }).filter((item) => item.title);

    return {
        html: template.innerHTML,
        tocItems,
    };
};

const PortfolioBlog = ({ activeTag, detailSlug, language, onTagChange }) => {
    const copy = blogCopy[language] || blogCopy.en;
    const navigate = useNavigate();
    const detailArticleRef = React.useRef(null);
    const tocAnimationFrameRef = React.useRef(0);
    const tocScrollLockRef = React.useRef(false);
    const tocScrollLockTimerRef = React.useRef(0);
    const viewedPostRef = React.useRef("");
    const [activeHashtag, setActiveHashtag] = React.useState("all");
    const [blogs, setBlogs] = React.useState([]);
    const [dateFilter, setDateFilter] = React.useState("all");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortMode, setSortMode] = React.useState("newest");
    const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
    const [activeTocId, setActiveTocId] = React.useState("");

    React.useEffect(() => {
        const unsubscribe = firestore.collection(BLOG_COLLECTION).where("status", "==", "published").onSnapshot(
            (snapshot) => {
                const publishedBlogs = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }));

                setBlogs(publishedBlogs);
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
        setVisibleCount(PAGE_SIZE);
    }, [activeTag, activeHashtag, dateFilter, searchQuery, sortMode]);

    const categoryFilters = React.useMemo(() => {
        const categories = uniqueFilters(blogs.flatMap((blog) => getBlogCategories(blog)));

        return [
            { id: "all", label: pick(blogContent.filters[0].label, language) || copy.all },
            ...categories,
        ];
    }, [blogs, copy.all, language]);

    const hashtagFilters = React.useMemo(
        () => [
            { id: "all", label: copy.allHashtags },
            ...uniqueFilters(blogs.flatMap((blog) => getPostTags(blog))),
        ],
        [blogs, copy.allHashtags]
    );

    const dateFilters = React.useMemo(() => {
        const monthKeys = Array.from(new Set(blogs.map((blog) => getPostMonthKey(blog)).filter(Boolean)))
            .sort((a, b) => b.localeCompare(a));

        return monthKeys.map((monthKey) => ({
            id: monthKey,
            label: formatMonthLabel(monthKey, language),
        }));
    }, [blogs, language]);

    const filteredPosts = React.useMemo(() => {
        const keyword = normalizeFilter(searchQuery);

        return blogs
            .filter((post) => {
                const categories = getBlogCategories(post);
                const tags = getPostTags(post);
                const matchesCategory =
                    activeTag === "all" ||
                    categories.some((category) => normalizeFilter(category) === activeTag);
                const matchesHashtag =
                    activeHashtag === "all" ||
                    tags.some((tag) => normalizeFilter(tag) === activeHashtag);
                const matchesDate = dateFilter === "all" || getPostMonthKey(post) === dateFilter;
                const matchesSearch = !keyword || buildBlogHaystack(post).includes(keyword);

                return matchesCategory && matchesHashtag && matchesDate && matchesSearch;
            })
            .sort((a, b) => {
                if (sortMode === "popular") {
                    return (Number(b.views) || 0) - (Number(a.views) || 0) ||
                        toMillis(getPostDateValue(b)) - toMillis(getPostDateValue(a));
                }

                if (sortMode === "oldest") {
                    return toMillis(getPostDateValue(a)) - toMillis(getPostDateValue(b));
                }

                return toMillis(getPostDateValue(b)) - toMillis(getPostDateValue(a));
            });
    }, [activeHashtag, activeTag, blogs, dateFilter, searchQuery, sortMode]);

    const normalizedDetailSlug = normalizeFilter(detailSlug);
    const isDetailMode = Boolean(normalizedDetailSlug);

    const selectedPost = React.useMemo(
        () =>
            normalizedDetailSlug
                ? blogs.find((post) => {
                    const publicSlug = normalizeFilter(post.slug || post.id);
                    const docId = normalizeFilter(post.id);

                    return publicSlug === normalizedDetailSlug || docId === normalizedDetailSlug;
                })
                : null,
        [blogs, normalizedDetailSlug]
    );

    React.useEffect(() => {
        if (!isDetailMode || !selectedPost?.id || viewedPostRef.current === selectedPost.id) {
            return;
        }

        viewedPostRef.current = selectedPost.id;

        firestore.collection(BLOG_COLLECTION).doc(selectedPost.id).update({
            lastViewedAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: firebase.firestore.FieldValue.increment(1),
        }).catch((viewError) => {
            // Reading the post should not fail just because view tracking failed.
            console.warn(viewError.message);
        });
    }, [isDetailMode, selectedPost]);

    const handleOpenPost = React.useCallback((post) => {
        navigate(`/blog/${post.slug || post.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [navigate]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const canLoadMore = visibleCount < filteredPosts.length;

    const detailTitle = selectedPost ? resolveBlogText(selectedPost, "title", language) : "";
    const detailExcerpt = selectedPost ? resolveBlogText(selectedPost, "excerpt", language) : "";
    const detailExcerptHasHtml = hasHtmlContent(detailExcerpt);
    const detailContent = selectedPost
        ? resolveBlogText(selectedPost, "content", language) || detailExcerpt
        : "";
    const detailBlocks = splitContentBlocks(detailContent);
    const detailHasHtml = hasHtmlContent(detailContent);
    const detailRender = React.useMemo(
        () => (detailHasHtml ? buildBlogDetailHtml(detailContent) : { html: "", tocItems: [] }),
        [detailContent, detailHasHtml]
    );
    const detailCategories = selectedPost ? getBlogCategories(selectedPost) : [];
    const detailTags = selectedPost ? getPostTags(selectedPost) : [];

    const stopTocScrollAnimation = React.useCallback(() => {
        if (tocAnimationFrameRef.current) {
            window.cancelAnimationFrame(tocAnimationFrameRef.current);
            tocAnimationFrameRef.current = 0;
        }
    }, []);

    const smoothScrollDetailTo = React.useCallback((top) => {
        const scrollContainer = detailArticleRef.current;

        if (!scrollContainer) {
            return 0;
        }

        stopTocScrollAnimation();

        const maxTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
        const targetTop = Math.min(maxTop, Math.max(0, top));
        const startTop = scrollContainer.scrollTop;
        const distance = targetTop - startTop;

        if (Math.abs(distance) < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            scrollContainer.scrollTop = targetTop;
            return 0;
        }

        const duration = Math.min(620, Math.max(260, Math.abs(distance) * 0.45));
        const startTime = window.performance.now();
        const easeInOutCubic = (progress) =>
            progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const animate = (currentTime) => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            scrollContainer.scrollTop = startTop + distance * easeInOutCubic(progress);

            if (progress < 1) {
                tocAnimationFrameRef.current = window.requestAnimationFrame(animate);
                return;
            }

            tocAnimationFrameRef.current = 0;
        };

        tocAnimationFrameRef.current = window.requestAnimationFrame(animate);
        return duration;
    }, [stopTocScrollAnimation]);

    React.useEffect(() => {
        setActiveTocId(detailRender.tocItems[0]?.id || "");
    }, [detailRender.tocItems]);

    React.useEffect(() => {
        stopTocScrollAnimation();
        detailArticleRef.current?.scrollTo({ top: 0 });
    }, [selectedPost?.id, stopTocScrollAnimation]);

    React.useEffect(() => () => {
        stopTocScrollAnimation();
        window.clearTimeout(tocScrollLockTimerRef.current);
    }, [stopTocScrollAnimation]);

    React.useEffect(() => {
        if (!isDetailMode || detailRender.tocItems.length === 0) {
            return undefined;
        }

        const scrollContainer = detailArticleRef.current;

        if (!scrollContainer) {
            return undefined;
        }

        const headings = detailRender.tocItems
            .map((item) => document.getElementById(item.id))
            .filter((heading) => heading && scrollContainer.contains(heading));

        if (headings.length === 0) {
            return undefined;
        }

        let animationFrame = 0;

        const updateActiveHeading = () => {
            animationFrame = 0;

            if (tocScrollLockRef.current) {
                return;
            }

            const containerRect = scrollContainer.getBoundingClientRect();
            const marker = containerRect.top + Math.min(140, Math.max(72, containerRect.height * 0.18));
            const currentHeading = headings.reduce((current, heading) => {
                if (heading.getBoundingClientRect().top <= marker) {
                    return heading;
                }

                return current;
            }, headings[0]);

            setActiveTocId(currentHeading.id);
        };

        const requestUpdate = () => {
            if (animationFrame) {
                return;
            }

            animationFrame = window.requestAnimationFrame(updateActiveHeading);
        };

        updateActiveHeading();
        scrollContainer.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }

            scrollContainer.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
        };
    }, [detailRender.tocItems, isDetailMode]);

    const handleTocClick = React.useCallback((event, id) => {
        event.preventDefault();
        setActiveTocId(id);

        const target = document.getElementById(id);
        const scrollContainer = detailArticleRef.current;

        if (target && scrollContainer?.contains(target)) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const top = scrollContainer.scrollTop + targetRect.top - containerRect.top - 16;

            tocScrollLockRef.current = true;
            const duration = smoothScrollDetailTo(top);
            window.clearTimeout(tocScrollLockTimerRef.current);
            tocScrollLockTimerRef.current = window.setTimeout(() => {
                tocScrollLockRef.current = false;
                setActiveTocId(id);
            }, duration + 90);
            window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
        }
    }, [smoothScrollDetailTo]);

    return (
        <div className={`portfolio-page${isDetailMode ? " is-blog-detail" : ""}`}>
            <section className={`portfolio-blog-wrap${isDetailMode ? " is-detail" : ""}`}>
                <div className="portfolio-blog-header">
                    <h1>{pick(blogContent.title, language)}</h1>
                    <p>{pick(blogContent.description, language)}</p>
                </div>

                {isDetailMode ? (
                    <>
                        {loading && (
                            <div className="portfolio-blog-state">
                                {copy.loading}
                            </div>
                        )}

                        {error && <div className="portfolio-blog-state is-error">{error}</div>}

                        {!loading && !error && !selectedPost && (
                            <div className="portfolio-blog-state">
                                {copy.notFound}
                            </div>
                        )}

                        {!loading && !error && selectedPost && (
                            <div className={`portfolio-blog-detail-shell${detailRender.tocItems.length > 0 ? " has-toc" : ""}`}>
                                {detailRender.tocItems.length > 0 && (
                                    <aside className="portfolio-blog-toc" aria-label={copy.toc}>
                                        <div className="portfolio-blog-toc-title">{copy.toc}</div>
                                        <nav>
                                            {detailRender.tocItems.map((item) => (
                                                <a
                                                    aria-current={activeTocId === item.id ? "true" : undefined}
                                                    className={`portfolio-blog-toc-link is-${item.level}${activeTocId === item.id ? " is-active" : ""}`}
                                                    href={`#${item.id}`}
                                                    key={item.id}
                                                    onClick={(event) => handleTocClick(event, item.id)}
                                                >
                                                    {item.title}
                                                </a>
                                            ))}
                                        </nav>
                                    </aside>
                                )}
                                <article className="portfolio-blog-detail" ref={detailArticleRef}>
                                    <nav className="portfolio-blog-back" aria-label="Blog breadcrumb">
                                        <button type="button" onClick={() => navigate("/")}>
                                            {copy.breadcrumbHome}
                                        </button>
                                        <span aria-hidden="true">&gt;</span>
                                        <button type="button" onClick={() => navigate("/blog")}>
                                            {copy.breadcrumbBlog}
                                        </button>
                                        <span aria-hidden="true">&gt;</span>
                                        <span className="portfolio-blog-breadcrumb-current" aria-current="page">
                                            {detailTitle}
                                        </span>
                                    </nav>

                                    <div className="portfolio-blog-detail-meta">
                                        <span>{formatDate(getPostDateValue(selectedPost))}</span>
                                        <span>{estimateReadTime(selectedPost, language)}</span>
                                        <span>{copy.reads(Number(selectedPost.views) || 0)}</span>
                                    </div>

                                    <h2>{detailTitle}</h2>
                                    {detailExcerptHasHtml ? (
                                        <div
                                            className="portfolio-blog-detail-excerpt"
                                            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(detailExcerpt) }}
                                        />
                                    ) : (
                                        detailExcerpt && (
                                            <p className="portfolio-blog-detail-excerpt">{detailExcerpt}</p>
                                        )
                                    )}

                                    <div className="portfolio-blog-detail-tags">
                                        {detailCategories.map((category) => (
                                            <button
                                                type="button"
                                                className="portfolio-filter-tag"
                                                key={category}
                                                onClick={() => {
                                                    onTagChange(normalizeFilter(category));
                                                    navigate("/blog");
                                                }}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                        {detailTags.map((tag) => (
                                            <button
                                                type="button"
                                                className="portfolio-hashtag-chip"
                                                key={tag}
                                                onClick={() => {
                                                    setActiveHashtag(normalizeFilter(tag));
                                                    navigate("/blog");
                                                }}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>

                                    {detailHasHtml ? (
                                        <div
                                            className="portfolio-blog-detail-body"
                                            dangerouslySetInnerHTML={{ __html: detailRender.html }}
                                        />
                                    ) : (
                                        <div className="portfolio-blog-detail-body">
                                            {detailBlocks.map((block) => (
                                                <p key={block}>{block}</p>
                                            ))}
                                        </div>
                                    )}

                                    <BlogEngagement blogId={selectedPost.id} language={language} />
                                </article>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="portfolio-blog-tools">
                            <label className="portfolio-blog-control portfolio-blog-search">
                                <span>{copy.searchLabel}</span>
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={copy.searchPlaceholder}
                                />
                            </label>

                            <label className="portfolio-blog-control">
                                <span>{copy.sortLabel}</span>
                                <select
                                    className="portfolio-blog-select"
                                    value={sortMode}
                                    onChange={(event) => setSortMode(event.target.value)}
                                >
                                    {copy.sortOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="portfolio-blog-control">
                                <span>{copy.selectDateLabel}</span>
                                <select
                                    className="portfolio-blog-select"
                                    value={dateFilter}
                                    onChange={(event) => setDateFilter(event.target.value)}
                                >
                                    <option value="all">{copy.allDates}</option>
                                    {dateFilters.map((filter) => (
                                        <option key={filter.id} value={filter.id}>
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="portfolio-blog-filter-panel">
                            <div className="portfolio-blog-filter-title">{copy.filterTitle}</div>
                            <div className="portfolio-blog-filters">
                                {categoryFilters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        type="button"
                                        className={`portfolio-filter-tag${activeTag === filter.id ? " is-active" : ""}`}
                                        onClick={() => onTagChange(filter.id)}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {hashtagFilters.length > 1 && (
                            <div className="portfolio-hashtag-row" aria-label={copy.hashtagLabel}>
                                {hashtagFilters.map((filter) => (
                                    <button
                                        type="button"
                                        key={filter.id}
                                        className={`portfolio-hashtag-chip${activeHashtag === filter.id ? " is-active" : ""}`}
                                        onClick={() => setActiveHashtag(filter.id)}
                                    >
                                        {filter.id === "all" ? filter.label : `#${filter.label}`}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="portfolio-blog-result-meta">
                                {copy.resultCount(filteredPosts.length)}
                            </div>
                        )}

                        {loading && (
                            <div className="portfolio-blog-state">
                                {copy.loading}
                            </div>
                        )}

                        {error && <div className="portfolio-blog-state is-error">{error}</div>}

                        {!loading && !error && !visiblePosts.length && (
                            <div className="portfolio-blog-state">
                                {copy.empty}
                            </div>
                        )}

                        {!!visiblePosts.length && (
                            <>
                                <div className="portfolio-blog-grid">
                                    {visiblePosts.map((post) => {
                                        const postCategories = getBlogCategories(post);
                                        const postTags = getPostTags(post);
                                        const title = resolveBlogText(post, "title", language);

                                        return (
                                            <article
                                                id={`blog-${post.slug || post.id}`}
                                                key={post.id}
                                                className="portfolio-blog-post"
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`${copy.openPost}: ${title}`}
                                                onClick={() => handleOpenPost(post)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        handleOpenPost(post);
                                                    }
                                                }}
                                            >
                                                <div className="portfolio-blog-post-left">
                                                    <h3>{title}</h3>
                                                    <p>{stripHtml(resolveBlogText(post, "excerpt", language))}</p>
                                                    {!!postTags.length && (
                                                        <div className="portfolio-blog-inline-tags">
                                                            {postTags.slice(0, 4).map((tag) => (
                                                                <span key={tag}>#{tag}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="portfolio-blog-post-meta">
                                                    <span className="portfolio-blog-date">
                                                        {formatDate(getPostDateValue(post))}
                                                    </span>
                                                    <div className="portfolio-blog-category-list">
                                                        {postCategories.map((category) => (
                                                            <span className="portfolio-blog-tag" key={category}>
                                                                {category}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="portfolio-blog-read-time">
                                                        {estimateReadTime(post, language)}
                                                    </span>
                                                    <span className="portfolio-blog-read-time">
                                                        {copy.reads(Number(post.views) || 0)}
                                                    </span>
                                                    <span className="portfolio-blog-read-action">
                                                        {copy.readPost}
                                                    </span>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>

                                {canLoadMore && (
                                    <div className="portfolio-load-more-wrap">
                                        <button
                                            type="button"
                                            className="portfolio-btn portfolio-btn-secondary portfolio-load-more"
                                            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                        >
                                            {copy.loadMore}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </section>

            <PageFooter>
                <span>{pick(aboutContent.name, language)}</span> - {pick(blogContent.footer, language)}
            </PageFooter>
        </div>
    );
};

export default PortfolioBlog;
