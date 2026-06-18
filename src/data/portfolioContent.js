import { localized } from "../utils/localization";

export const navigationLabels = {
    projects: localized("Projects", "Dự án"),
    home: localized("Home", "Trang chủ"),
    about: localized("About", "Giới thiệu"),
    blog: localized("Blog", "Bài viết"),
    roadmap: localized("Roadmap", "Roadmap"),
    dailyPlan: localized("Plan", "Plan"),
    marketAnalysis: localized("Market Analysis", "Market Analysis"),
    crypto: localized("Crypto", "Crypto"),
    more: localized("More", "Thêm"),
    hire: localized("Hire Me", "Liên hệ"),
};

export const socialLinks = [
    {
        id: "github",
        label: "GitHub",
        url: "https://github.com/tamfuldev",
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/tam001/",
    },
    {
        id: "facebook",
        label: "Facebook",
        url: "https://www.facebook.com/tam.ngoc.5648/",
    },
    {
        id: "youtube",
        label: "YouTube",
        url: "https://www.youtube.com/@tamcactus",
    },
    {
        id: "reddit",
        label: "Reddit",
        url: "https://www.reddit.com/user/GolfOther8411/",
    },
    {
        id: "email",
        label: "Email",
        url: "mailto:ngoctam2303001@gmail.com",
    }
];

export const heroContent = {
    kicker: localized("// Backend Engineer - Ho Chi Minh City", "// Kỹ sư Backend - Thành phố Hồ Chí Minh"),
    titleLine1: localized("I build backend", "Tôi xây backend"),
    titleLine2: localized("that do not break", "vận hành bền vững"),
    titleLine3: localized("under pressure.", "dưới áp lực."),
    taglineLead: localized("Hi, I'm ", "Xin chào, tôi là "),
    taglineName: localized("Tran Ngoc Tam.", "Trần Ngọc Tâm."),
    taglineTail: localized(
        " 4+ years in, I still get the most satisfaction from fixing the thing nobody else wants to touch — the slow query, the leaky cache, the API that works on staging but breaks in prod. Laravel, Redis, and Docker are my daily tools. Reliability is the goal. ",
        " 4+ năm trong nghề, điều tôi vẫn thấy thỏa mãn nhất là xử lý những thứ không ai muốn đụng vào — câu truy vấn chạy chậm, cache bị rò rỉ, hay cái API hoạt động tốt trên staging nhưng lại vỡ ngay khi lên production. Laravel, Redis và Docker là những công cụ tôi dùng hằng ngày. Và mục tiêu cuối cùng vẫn luôn là: hệ thống phải đáng tin cậy."
    ),
    primaryCta: localized("View My Work", "Xem kinh nghiệm"),
    secondaryCta: localized("Download CV", "Tải CV xuống"),
    featuredLabel: localized("// Featured Work", "// Dự án nổi bật"),
    featuredTitle: localized("What I have built", "Những gì tôi đã xây dựng"),
    featuredDescription: localized(
        "A compact look at the backend systems, performance work, infrastructure, and product tooling I have improved in production.",
        "Một lát cắt gọn về các hệ thống backend, tối ưu hiệu năng, hạ tầng và công cụ sản phẩm tôi đã cải thiện trong môi trường production."
    ),
    featuredCta: localized("Explore all projects", "Xem tất cả dự án"),
    footer: localized(
        "Backend Engineer",
        "Kỹ sư Backend"
    ),
};

export const stats = [
    { value: "4+", label: localized("Years Exp.", "Năm KN") },
    { value: "2", label: localized("Companies", "Công ty") },
    { value: "10+", label: localized("Projects", "Dự án") },
    { value: "INF", label: localized("Coffee", "Cà phê") },
];

export const featuredProjects = [
    {
        tag: localized("Backend System", "Hệ thống backend"),
        title: localized("Scalable API Platform", "Nền tảng API mở rộng cao"),
        description: localized(
            "Architected RESTful API system handling thousands of concurrent requests with Redis caching layer reducing response time by 60%.",
            "Thiết kế hệ thống RESTful API xử lý hàng nghìn request đồng thời, kết hợp Redis cache giúp giảm thời gian phản hồi 60%."
        ),
        outcome: localized("60% faster responses", "Phản hồi nhanh hơn 60%"),
        tech: ["Laravel", "Redis", "MySQL"],
    },
    {
        tag: localized("Performance", "Hiệu năng"),
        title: localized("Query Optimization Engine", "Tối ưu truy vấn dữ liệu"),
        description: localized(
            "Refactored legacy database queries and implemented smart indexing strategies, achieving significant improvements in system throughput.",
            "Refactor truy vấn CSDL cũ và áp dụng chiến lược indexing hợp lý để cải thiện rõ rệt thông lượng hệ thống."
        ),
        outcome: localized("Cleaner reporting flow", "Luồng báo cáo gọn hơn"),
        tech: ["MySQL", "Redis", "PHP"],
    },
    {
        tag: localized("DevOps", "DevOps"),
        title: localized("Containerized Deployment", "Triển khai bảng container"),
        description: localized(
            "Dockerized multi-service applications ensuring consistent environments across development, staging, and production pipelines.",
            "Đóng gói ứng dụng nhiều service bảng Docker để giữ môi trường dev, staging va production nhất quán."
        ),
        outcome: localized("Repeatable releases", "Release lặp lại ổn định"),
        tech: ["Docker", "Laravel", "Nginx"],
    },
    {
        tag: localized("Async Processing", "Xử lý bất đồng bộ"),
        title: localized("Queue Worker Reliability", "Ổn định queue worker"),
        description: localized(
            "Improved background job handling with clearer retries, safer failure paths, and better separation between heavy work and user-facing requests.",
            "Cải thiện xử lý background job với retry rõ ràng hơn, luồng lỗi an toàn hơn và tách bạch tác vụ nặng khỏi request người dùng."
        ),
        outcome: localized("Less production noise", "Giảm nhiễu production"),
        tech: ["Queue/Job", "Redis", "Laravel"],
    },
    {
        tag: localized("Product Tooling", "Công cụ sản phẩm"),
        title: localized("Portfolio Blog CMS", "CMS blog portfolio"),
        description: localized(
            "Built a protected content workflow for creating, editing, translating, and publishing portfolio articles with Firebase-backed storage.",
            "Xây workflow nội dung được bảo vệ để tạo, sửa, dịch và publish bài viết portfolio với dữ liệu lưu trên Firebase."
        ),
        outcome: localized("Faster publishing", "Publish nhanh hơn"),
        tech: ["React", "Firebase", "Firestore"],
    },
    {
        tag: localized("Integration", "Tích hợp"),
        title: localized("Third-party API Integrations", "Tích hợp API bên thứ ba"),
        description: localized(
            "Designed API integration flows with validation, request tracing, and practical contracts for teams consuming external services.",
            "Thiết kế luồng tích hợp API có validation, tracing request và contract rõ ràng cho đội ngũ sử dụng dịch vụ bên ngoài."
        ),
        outcome: localized("Safer handoffs", "Bàn giao an toàn hơn"),
        tech: ["REST API", "OAuth", "Webhooks"],
    },
];

export const projectsContent = {
    title: localized("Selected Projects", "Dự án tiêu biểu"),
    eyebrow: localized("// production_case_studies", "// case_study_thuc_te"),
    description: localized(
        "A focused collection of backend systems, performance work, deployment pipelines, and product infrastructure I have built or improved.",
        "Tổng hợp các hệ thống backend, tối ưu hiệu năng, pipeline triển khai và hạ tầng sản phẩm tối đa xây dựng hoặc cải tiến."
    ),
    cta: localized("Open project", "Xem dự án"),
    impactLabel: localized("Impact", "Tác động"),
    footer: localized("Backend Engineer", "Kỹ sư Backend"),
};

export const portfolioProjects = [
    // {
    //     accent: "backend",
    //     title: localized("Scalable API Platform", "Nen tang API mo rong cao"),
    //     category: localized("Backend System", "He thong backend"),
    //     period: "2024 - 2025",
    //     description: localized(
    //         "Designed Laravel REST APIs for high-traffic product flows with caching, validation, and clean service boundaries.",
    //         "Thiet ke REST API bang Laravel cho cac luong san pham traffic cao, ket hop cache, validation va phan lop service ro rang."
    //     ),
    //     impact: [
    //         localized("Reduced API response time by up to 60% with Redis caching.", "Giam toi 60% thoi gian phan hoi API bang Redis cache."),
    //         localized("Improved maintainability with service/repository boundaries.", "Tang kha nang bao tri bang service/repository ro rang."),
    //         localized("Handled concurrent requests more safely under production load.", "Xu ly request dong thoi on dinh hon trong production."),
    //     ],
    //     tech: ["Laravel", "Redis", "MySQL", "REST API"],
    //     url: "https://github.com/tamfuldev",
    // },
    // {
    //     accent: "performance",
    //     title: localized("Query Optimization Engine", "Bo toi uu truy van"),
    //     category: localized("Performance", "Hieu nang"),
    //     period: "2023 - 2024",
    //     description: localized(
    //         "Refactored slow reporting queries, added indexing strategies, and profiled execution plans to remove bottlenecks.",
    //         "Refactor cac query bao cao cham, them chien luoc index va phan tich execution plan de go nut that hieu nang."
    //     ),
    //     impact: [
    //         localized("Optimized heavy database screens with targeted indexes.", "Toi uu cac man hinh du lieu nang bang index dung muc tieu."),
    //         localized("Reduced repeated queries through caching and eager loading.", "Giam query lap lai bang cache va eager loading."),
    //         localized("Made profiling repeatable for future debugging.", "Tao quy trinh profiling de debug ve sau de hon."),
    //     ],
    //     tech: ["MySQL", "Redis", "Laravel", "EXPLAIN"],
    //     url: "https://github.com/tamfuldev",
    // },
    // {
    //     accent: "devops",
    //     title: localized("Containerized Deployment Pipeline", "Pipeline trien khai container"),
    //     category: localized("DevOps", "DevOps"),
    //     period: "2023",
    //     description: localized(
    //         "Dockerized multi-service Laravel applications with Nginx, queues, and environment consistency across stages.",
    //         "Docker hoa ung dung Laravel nhieu service voi Nginx, queue va moi truong nhat quan giua cac giai doan."
    //     ),
    //     impact: [
    //         localized("Reduced environment mismatch between local and production.", "Giam lech moi truong giua local va production."),
    //         localized("Made queue workers and web services easier to operate.", "Giup van hanh queue worker va web service de hon."),
    //         localized("Improved release confidence with repeatable setup.", "Tang do tin cay khi release bang setup lap lai duoc."),
    //     ],
    //     tech: ["Docker", "Nginx", "Linux", "Queue Workers"],
    //     url: "https://github.com/tamfuldev",
    // },
    // {
    //     accent: "product",
    //     title: localized("Portfolio Blog CMS", "CMS blog portfolio"),
    //     category: localized("Full-stack Tooling", "Cong cu full-stack"),
    //     period: "2026",
    //     description: localized(
    //         "Built a Firebase-powered admin dashboard to create, translate, categorize, and publish rich blog content.",
    //         "Xay dashboard admin dung Firebase de tao, dich, phan loai va publish blog rich content."
    //     ),
    //     impact: [
    //         localized("Added protected admin workflow with Firebase auth.", "Them workflow admin duoc bao ve bang Firebase auth."),
    //         localized("Supports rich text, multi-category posts, search and filters.", "Ho tro rich text, nhieu category, search va filter."),
    //         localized("Public blog detail pages use clean slug URLs.", "Trang chi tiet blog public dung URL slug gon gang."),
    //     ],
    //     tech: ["React", "Firebase", "React-Quill", "Firestore"],
    //     url: "https://github.com/tamfuldev",
    // },
];

export const aboutContent = {
    name: localized("Tran Ngoc Tam", "Trần Ngọc Tâm"),
    role: localized("Backend Engineer", "Kỹ sư Backend"),
    bioPrimary: localized(
        "I build backends that don't wake people up at 3am.",
        "Tôi xây dựng những backend không khiến ai phải thức dậy lúc 3 giờ sáng."
    ),
    bioDescription: localized(
        "With 4+ years in web development and a focus on the Laravel ecosystem, I've learned that good architecture is only half the job — the other half is obsessing over the details that make systems reliable at scale: query optimization, caching strategies, and APIs that actually make sense to the team consuming them.",
        "Với hơn 4 năm kinh nghiệm phát triển web và tập trung vào hệ sinh thái Laravel, tôi đã nhận ra rằng kiến trúc tốt mới chỉ là một nửa công việc — nửa còn lại là sự tỉ mỉ trong từng chi tiết giúp hệ thống hoạt động ổn định ở quy mô lớn: tối ưu hóa truy vấn, chiến lược caching, và các API thực sự có ý nghĩa với đội ngũ sử dụng chúng."
    ),
    bioLead: localized("Currently at ", "Hiện đang làm việc tại "),
    bioHighlight: "Wacontre Co., Ltd",
    bioTail: localized(
        " building high-availability backend systems. Graduated with Honors in Information Technology from Thu Duc College in 2022.",
        " xây dựng các hệ thống backend yêu cầu độ sẵn sàng cao. Tốt nghiệp Công nghệ thông tin loại Giỏi tại Cao đẳng Thủ Đức năm 2022."
    ),
    emailLabel: localized("Email", "Email"),
    portfolioLabel: localized("Portfolio Site", "Trang portfolio"),
    skillsTitle: localized("Skills and Expertise", "Kỹ năng và chuyên môn"),
    experienceTitle: localized("Experience", "Kinh nghiệm"),
    footer: localized("Backend Engineer", "Kỹ sư Backend"),
};

export const skillColumns = [
    [
        {
            title: localized("Programming Languages", "Ngôn ngữ lập trình"),
            items: ["PHP", "JavaScript", "HTML, CSS"],
        },
        {
            title: localized("Frameworks & Platforms", "Frameworks & nền tảng"),
            items: [
                "Laravel",
                "Twig",
                "TailwindCSS",
                "GraphQL"
            ],
        },
    ],
    [
        {
            title: localized("Database", "Cơ sở dữ liệu"),
            items: ["MySQL", "Redis/Cache", "Firebase", "Elasticsearch"],
        },
        {
            title: localized("Version Control", "Quản lý mã nguồn"),
            items: ["Git/GitHub", "Bitbucket", "SourceTree", "Docker"],
        },
        {
            title: localized("IDE & Tools", "IDE & công cụ"),
            items: ["Visual Studio Code", "Postman/Bruno", "Swagger/OpenAPI", "Backlog", "Linux"],
        },
    ],
    [
        {
            title: localized("Foreign Language", "Ngoại ngữ"),
            items: [
                localized("English - Technical Reading", "Tiếng Anh - Đọc tài liệu kỹ thuật"),
            ],
        },
        {
            title: localized("Knowledge", "Kiến thức"),
            items: [
                localized(
                    "Deep understanding about OOP, Design Patterns, and SOLID principles.",
                    "Hiểu sâu về OOP, Design Pattern và nguyên tắc SOLID."
                ),
                localized(
                    "Good understanding about performance optimization, query tuning, and caching strategy.",
                    "Nắm tốt tối ưu hiệu năng, tinh chỉnh truy vấn và chiến lược cache."
                ),
                localized(
                    "Good understanding software design, database design, RESTful API, and Security.",
                    "Nắm tốt thiết kế phần mềm, thiết kế CSDL, RESTful API và Security."
                ),
                localized(
                    "Good teamwork, code review, communication, and Agile/Scrum workflow.",
                    "Làm việc nhóm, code review, giao tiếp và quy trình Agile/Scrum tốt."
                ),
            ],
        },
        {
            title: localized("AI & Developer Tools", "AI & công cụ lập trình"),
            items: ["Claude Code", "OpenAI Codex"],
        },
    ],
];

export const experiences = [
    {
        date: "2022 - Present",
        role: localized("Backend Engineer", "Backend Engineer"),
        company: "Wacontre Co., Ltd",
        mutedDot: false,
        summary: localized(
            "Working on production Laravel systems with a focus on API reliability, performance tuning, caching, and maintainable backend architecture.",
            "Làm việc trên các hệ thống Laravel production, tập trung vào độ ổn định API, tối ưu hiệu năng, caching và kiến trúc backend dễ bảo trì."
        ),
        tech: ["Laravel", "PHP", "MySQL", "Redis", "Docker", "REST API", "Queue/Job"],
        points: [
            localized(
                "Developed and maintained scalable Laravel backend systems ensuring high availability and performance.",
                "Phát triển và bảo trì các hệ thống backend Laravel có khả năng mở rộng, đảm bảo độ sẵn sàng và hiệu năng cao."
            ),
            localized(
                "Designed RESTful API and integrated third-party services to enhance product functionality.",
                "Thiết kế RESTful API và tích hợp dịch vụ bên thứ ba để mở rộng tính năng sản phẩm."
            ),
            localized(
                "Optimized performance through Redis caching and query tuning, achieving significant speed improvements.",
                "Tối ưu hiệu năng bằng Redis cache và tinh chỉnh truy vấn, giúp cải thiện tốc độ đáng kể."
            ),
            localized(
                "Implemented background jobs, queue flows, validation, and error handling for safer production operations.",
                "Triển khai background jobs, luồng queue, validation và xử lý lỗi để vận hành production an toàn hơn."
            ),
            localized(
                "Collaborated with frontend and product teams to define API contracts, review edge cases, and release features in sprint cycles.",
                "Phối hợp với frontend và product để thống nhất API contract, review edge cases và release tính năng theo sprint."
            ),
        ],
    },
    {
        date: "2021 - 2022",
        role: localized("Junior Fullstack Engineer", "Junior Fullstack Engineer"),
        company: "Onicorn Media, JSC",
        mutedDot: false,
        summary: localized(
            "Built and maintained Laravel web applications across backend features, admin screens, bug fixes, and product delivery support.",
            "Xây dựng và bảo trì ứng dụng web Laravel, tham gia backend features, màn hình admin, fix bug và hỗ trợ bàn giao sản phẩm."
        ),
        tech: ["Laravel", "PHP", "JavaScript", "MySQL", "HTML/CSS", "Git"],
        points: [
            localized(
                "Participated in Laravel web application development and maintenance, improving overall code quality.",
                "Tham gia phát triển và bảo trì ứng dụng web Laravel, đồng thời nâng cao chất lượng code tổng thể."
            ),
            localized(
                "Collaborated cross-functionally to ship features and hotfixes in tight sprint cycles.",
                "Phối hợp liên phòng ban để phát hành tính năng và hotfix trong các sprint gấp."
            ),
            localized(
                "Enhanced application performance through systematic code reviews and optimization.",
                "Cải thiện hiệu năng ứng dụng thông qua review code và tối ưu hệ thống."
            ),
            localized(
                "Handled bug fixing, UI integration, database changes, and small feature releases from requirement to deployment handoff.",
                "Xử lý bug fixing, tích hợp UI, thay đổi database và release các feature nhỏ từ yêu cầu đến bàn giao triển khai."
            ),
        ],
    },
    {
        date: "2018 - 2022",
        role: localized("Information Technology - Honors", "Công nghệ thông tin - Loại Giỏi"),
        company: "Thu Duc College",
        mutedDot: true,
        summary: localized(
            "Built a foundation in software development, databases, web applications, and collaborative project work.",
            "Xây nền tảng về phát triển phần mềm, cơ sở dữ liệu, ứng dụng web và làm việc nhóm trong dự án."
        ),
        tech: ["PHP", "Laravel", "MySQL", "HTML/CSS", "JavaScript", "Team Projects"],
        points: [
            localized(
                "Built Laravel web apps and participated in student tech competitions.",
                "Xây dựng các web app Laravel và tham gia các cuộc thi công nghệ sinh viên."
            ),
            localized(
                "Contributed to large team projects with successful outcomes.",
                "Đóng góp vào các dự án nhóm quy mô lớn với kết quả tốt."
            ),
            localized(
                "Graduated with Honors in Information Technology.",
                "Tốt nghiệp ngành Công nghệ thông tin loại Giỏi."
            ),
        ],
    },
];

export const blogContent = {
    title: localized("Writing and Thoughts", "Bài viết và chia sẽ"),
    description: localized(
        "Deep dives on Laravel, backend architecture, performance tuning, and lessons from production systems.",
        "Những bài viết chuyên sâu về Laravel, kiến trúc backend, tối ưu hiệu năng và bài học từ hệ thống production."
    ),
    filters: [
        { id: "all", label: localized("All", "Tất cả") },
        { id: "laravel", label: localized("Laravel", "Laravel") },
        { id: "redis", label: localized("Redis", "Redis") },
        { id: "docker", label: localized("Docker", "Docker") },
        { id: "performance", label: localized("Performance", "Hiệu năng") },
    ],
    footer: localized("Backend Engineer", "Kỹ sư Backend"),
};


export const cryptoContent = {
    title: localized("Crypto Dashboard", "Bảng giá Crypto"),
    description: localized(
        "// live_binance_prices - refresh_interval=60s - not_financial_advice",
        "// gia_live_binance - cap_nhat=60s - khong_phai_loi_khuyen_tai_chinh"
    ),
    disclaimer: localized(
        "Live market data from Binance. Not financial advice. For display purposes.",
        "Data thị trường live từ Binance. Không phải lời khuyên tài chính. Chỉ dùng để hiển thị."
    ),
    footer: localized("Backend Engineer", "Kỹ sư Backend"),
};

export const initialCoins = [
    { name: "Bitcoin", symbol: "BTC", price: 81019, change: 2.27 },
    { name: "Ethereum", symbol: "ETH", price: 2272, change: 1.13 },
    { name: "BNB", symbol: "BNB", price: 681, change: 2.13 },
    { name: "Litecoin", symbol: "LTC", price: 58, change: 2.06 },
    { name: "Cardano", symbol: "ADA", price: 0.269, change: 2.39 },
    { name: "Chainlink", symbol: "LINK", price: 10.43, change: 2.76 },
    { name: "Dogecoin", symbol: "DOGE", price: 0.1158, change: 2.34 },
    { name: "Solana", symbol: "SOL", price: 165, change: 3.1 },
];
