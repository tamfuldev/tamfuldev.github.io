import { localized } from "../utils/localization";

export const navigationLabels = {
    projects: localized("Projects", "Dự án"),
    home: localized("Home", "Trang chủ"),
    about: localized("About", "Giới thiệu"),
    blog: localized("Blog", "Bài viết"),
    crypto: localized("Crypto", "Crypto"),
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
        id: "twitter",
        label: "Twitter",
        url: "https://x.com/tamnus_sol",
    },
];

export const heroContent = {
    kicker: localized("// Backend Engineer - Ho Chi Minh City", "// Kỹ sư Backend - Thành phố Hồ Chí Minh"),
    titleLine1: localized("I build backends", "Tôi xây backend"),
    titleLine2: localized("that do not break", "vận hành bền vững"),
    titleLine3: localized("under pressure.", "dưới áp lực."),
    taglineLead: localized("Hi, I am ", "Xin chào, tôi là "),
    taglineName: localized("Tran Ngoc Tam", "Trần Ngọc Tâm"),
    taglineTail: localized(
        " - 4+ years crafting scalable systems with Laravel, Redis, and Docker. I turn complex server problems into clean, fast, reliable solutions.",
        " - hơn 4 năm xây dựng hệ thống có khả năng mở rộng với Laravel, Redis va Docker. Tôi biến bài toán server phức tạp thành giải pháp gọn, nhanh và đáng tin cậy."
    ),
    primaryCta: localized("View My Work", "Xem kinh nghiệm"),
    secondaryCta: localized("Get In Touch", "Liên hệ"),
    featuredLabel: localized("// Featured Work", "// Dự án nổi bật"),
    featuredTitle: localized("What I have built", "Những gì tôi đã xây dựng"),
    footer: localized(
        "Backend Engineer - Ho Chi Minh City, VN - ngoctam2303001@gmail.com",
        "Kỹ sư Backend - Thành phố Hồ Chí Minh, VN - ngoctam2303001@gmail.com"
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
        tech: ["Laravel", "Redis", "MySQL"],
    },
    {
        tag: localized("Performance", "Hiệu năng"),
        title: localized("Query Optimization Engine", "Tối ưu truy vấn dữ liệu"),
        description: localized(
            "Refactored legacy database queries and implemented smart indexing strategies, achieving significant improvements in system throughput.",
            "Refactor truy vấn CSDL cũ và áp dụng chiến lược indexing hợp lý để cải thiện rõ rệt thông lượng hệ thống."
        ),
        tech: ["MySQL", "Redis", "PHP"],
    },
    {
        tag: localized("DevOps", "DevOps"),
        title: localized("Containerized Deployment", "Triển khai bảng container"),
        description: localized(
            "Dockerized multi-service applications ensuring consistent environments across development, staging, and production pipelines.",
            "Đóng gói ứng dụng nhiều service bảng Docker để giữ môi trường dev, staging va production nhất quán."
        ),
        tech: ["Docker", "Laravel", "Nginx"],
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
    footer: localized("Backend Engineer - project portfolio", "Kỹ sư Backend - portfolio dự án"),
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
        "Backend-focused developer with 4+ years building robust, scalable web systems. I specialize in the Laravel ecosystem and love solving performance problems, whether it is a clean API architecture or squeezing milliseconds out of slow queries with Redis caching strategies.",
        "Lập trình viên tập trung vào backend với hơn 4 năm xây dựng hệ thống web bền vững, có khả năng mở rộngKỹ sư Backend. Tôi chuyên sâu hệ sinh thái Laravel và thích giải quyết bài toán hiệu năng, từ kiến trúc API gọn và tôi ưu từng mili giây trong truy vấn chậm bằng cache Redis."
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
    footer: localized("Backend Engineer - ngoctam2303001@gmail.com", "Kỹ sư Backend - ngoctam2303001@gmail.com"),
};

export const skillGroups = [
    {
        label: localized("Core Stack", "Công nghệ chính"),
        level: "primary",
        items: ["Laravel", "PHP", "RESTful APIs", "Redis", "MySQL"],
    },
    {
        label: localized("Infrastructure", "Hạ tầng"),
        level: "tertiary",
        items: ["Docker", "Nginx", "Linux", "Queue Workers"],
    },
    {
        label: localized("Practices", "Thực hành"),
        level: "secondary",
        items: [
            localized("Performance Optimization", "Tối ưu hiệu năng"),
            localized("Query Tuning", "Tinh chỉnh truy vấn"),
            localized("Code Review", "Code review"),
            localized("API Design", "Thiết kế API"),
            localized("Caching Strategy", "Chiến lược cache"),
        ],
    },
];

export const experiences = [
    {
        date: "2022 - Present",
        role: localized("Backend Developer", "Lập trình viên Backend"),
        company: "Wacontre Co., Ltd",
        mutedDot: false,
        points: [
            localized(
                "Developed and maintained scalable Laravel backend systems ensuring high availability and performance.",
                "Phát triển và bảo trì các hệ thống backend Laravel có khả năng mở rộng, đảm bảo độ sẵn sàng và hiệu năng cao."
            ),
            localized(
                "Designed RESTful APIs and integrated third-party services to enhance product functionality.",
                "Thiết kế RESTful API và tích hợp dịch vụ bên thứ ba để mở dụng tính năng sản phẩm."
            ),
            localized(
                "Optimized performance through Redis caching and query tuning, achieving significant speed improvements.",
                "Tối ưu hiệu năng bằng Redis cache và tinh chỉnh truy vấn, giúp cải thiện tốc độ đáng kể."
            ),
        ],
    },
    {
        date: "2021 - 2022",
        role: localized("Junior Backend Developer", "Lập trình viên Backend Junior"),
        company: "Onicorn Media, JSC",
        mutedDot: false,
        points: [
            localized(
                "Participated in Laravel web application development and maintenance, improving overall code quality.",
                "Tham gia phát triển và bảo trì ứng dụng web Laravel, đồng thời nâng cao chất lương code tổng thể."
            ),
            localized(
                "Collaborated cross-functionally to ship features and hotfixes in tight sprint cycles.",
                "Phối hợp liên phòng ban để phát hành tính năng và hotfix trong các sprint gấp."
            ),
            localized(
                "Enhanced application performance through systematic code reviews and optimization.",
                "Cải thiện hiệu năng ứng dụng thông qua review code va tối ưu hệ thống."
            ),
        ],
    },
    {
        date: "2018 - 2022",
        role: localized("Information Technology - Honors", "Công nghệ thông tin - Loai Gioi"),
        company: "Thu Duc College",
        mutedDot: true,
        points: [
            localized(
                "Built Laravel web apps and participated in student tech competitions.",
                "Xây dựng các web app Laravel và tham gia các cuộc thi công nghệ sinh viên."
            ),
            localized(
                "Contributed to large team projects with successful outcomes.",
                "Đóng góp vào các dự án nhóm quy mô lớn với kết quả tốt."
            ),
        ],
    },
];

export const blogContent = {
    title: localized("Writing and Thoughts", "Bài viết và chia sẽ"),
    description: localized(
        "Deep dives on Laravel, backend architecture, performance tuning, and lessons from production systems.",
        "Nhưng bài viết chuyên sâu về Laravel, kiến trúc backend, tối ưu hiệu năng và bài học từ hệ thống production."
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
    title: localized("Crypto Dashboard", "Bang gia Crypto"),
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
