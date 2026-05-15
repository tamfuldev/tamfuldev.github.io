import { localized } from "../utils/localization";

export const navigationLabels = {
    home: localized("Home", "Trang chu"),
    about: localized("About", "Gioi thieu"),
    blog: localized("Blog", "Bai viet"),
    crypto: localized("Crypto", "Crypto"),
    hire: localized("Hire Me", "Lien he"),
};

export const heroContent = {
    kicker: localized("// Backend Engineer - Ho Chi Minh City", "// Ky su Backend - Ho Chi Minh City"),
    titleLine1: localized("I build backends", "Toi xay backend"),
    titleLine2: localized("that do not break", "van hanh ben vung"),
    titleLine3: localized("under pressure.", "duoi ap luc."),
    taglineLead: localized("Hi, I am ", "Xin chao, toi la "),
    taglineName: "Tran Ngoc Tam",
    taglineTail: localized(
        " - 4+ years crafting scalable systems with Laravel, Redis, and Docker. I turn complex server problems into clean, fast, reliable solutions.",
        " - hon 4 nam xay dung he thong co kha nang mo rong voi Laravel, Redis va Docker. Toi bien bai toan server phuc tap thanh giai phap gon, nhanh va dang tin cay."
    ),
    primaryCta: localized("View My Work", "Xem kinh nghiem"),
    secondaryCta: localized("Get In Touch", "Lien he"),
    featuredLabel: localized("// Featured Work", "// Du an noi bat"),
    featuredTitle: localized("What I have built", "Nhung gi toi da xay dung"),
    footer: localized(
        "Backend Engineer - Ho Chi Minh City, VN - ngoctam2303001@gmail.com",
        "Ky su Backend - Ho Chi Minh City, VN - ngoctam2303001@gmail.com"
    ),
};

export const stats = [
    { value: "4+", label: localized("Years Exp.", "Nam KN") },
    { value: "2", label: localized("Companies", "Cong ty") },
    { value: "10+", label: localized("Projects", "Du an") },
    { value: "INF", label: localized("Coffee", "Ca phe") },
];

export const featuredProjects = [
    {
        tag: localized("Backend System", "He thong backend"),
        title: localized("Scalable API Platform", "Nen tang API mo rong cao"),
        description: localized(
            "Architected RESTful API system handling thousands of concurrent requests with Redis caching layer reducing response time by 60%.",
            "Thiet ke he thong RESTful API xu ly hang nghin request dong thoi, ket hop Redis cache giup giam thoi gian phan hoi 60%."
        ),
        tech: ["Laravel", "Redis", "MySQL"],
    },
    {
        tag: localized("Performance", "Hieu nang"),
        title: localized("Query Optimization Engine", "Toi uu truy van du lieu"),
        description: localized(
            "Refactored legacy database queries and implemented smart indexing strategies, achieving significant improvements in system throughput.",
            "Refactor truy van CSDL cu va ap dung chien luoc indexing hop ly de cai thien ro ret thong luong he thong."
        ),
        tech: ["MySQL", "Redis", "PHP"],
    },
    {
        tag: localized("DevOps", "DevOps"),
        title: localized("Containerized Deployment", "Trien khai bang container"),
        description: localized(
            "Dockerized multi-service applications ensuring consistent environments across development, staging, and production pipelines.",
            "Dong goi ung dung nhieu service bang Docker de giu moi truong dev, staging va production nhat quan."
        ),
        tech: ["Docker", "Laravel", "Nginx"],
    },
];

export const aboutContent = {
    name: "Tran Ngoc Tam",
    role: localized("Backend Engineer", "Ky su Backend"),
    bioPrimary: localized(
        "Backend-focused developer with 4+ years building robust, scalable web systems. I specialize in the Laravel ecosystem and love solving performance problems, whether it is a clean API architecture or squeezing milliseconds out of slow queries with Redis caching strategies.",
        "Lap trinh vien tap trung vao backend voi hon 4 nam xay dung he thong web ben vung, co kha nang mo rong. Toi chuyen sau he sinh thai Laravel va thich giai quyet bai toan hieu nang, tu kien truc API gon gang den toi uu tung mili giay trong truy van cham bang cache Redis."
    ),
    bioLead: localized("Currently at ", "Hien dang lam viec tai "),
    bioHighlight: "Wacontre Co., Ltd",
    bioTail: localized(
        " building high-availability backend systems. Graduated with Honors in Information Technology from Thu Duc College in 2022.",
        " xay dung cac he thong backend yeu cau do san sang cao. Tot nghiep Cong nghe Thong tin loai Gioi tai Cao dang Thu Duc nam 2022."
    ),
    emailLabel: localized("Email", "Email"),
    portfolioLabel: localized("Portfolio Site", "Trang portfolio"),
    skillsTitle: localized("Skills and Expertise", "Ky nang va chuyen mon"),
    experienceTitle: localized("Experience", "Kinh nghiem"),
    footer: localized("Backend Engineer - ngoctam2303001@gmail.com", "Ky su Backend - ngoctam2303001@gmail.com"),
};

export const skillGroups = [
    {
        label: localized("Core Stack", "Cong nghe chinh"),
        level: "primary",
        items: ["Laravel", "PHP", "RESTful APIs", "Redis", "MySQL"],
    },
    {
        label: localized("Infrastructure", "Ha tang"),
        level: "tertiary",
        items: ["Docker", "Nginx", "Linux", "Queue Workers"],
    },
    {
        label: localized("Practices", "Thuc hanh"),
        level: "secondary",
        items: [
            localized("Performance Optimization", "Toi uu hieu nang"),
            localized("Query Tuning", "Tinh chinh truy van"),
            localized("Code Review", "Code review"),
            localized("API Design", "Thiet ke API"),
            localized("Caching Strategy", "Chien luoc cache"),
        ],
    },
];

export const experiences = [
    {
        date: "2022 - Present",
        role: localized("Backend Developer", "Lap trinh vien Backend"),
        company: "Wacontre Co., Ltd",
        mutedDot: false,
        points: [
            localized(
                "Developed and maintained scalable Laravel backend systems ensuring high availability and performance.",
                "Phat trien va bao tri cac he thong backend Laravel co kha nang mo rong, dam bao do san sang va hieu nang cao."
            ),
            localized(
                "Designed RESTful APIs and integrated third-party services to enhance product functionality.",
                "Thiet ke RESTful API va tich hop dich vu ben thu ba de mo rong tinh nang san pham."
            ),
            localized(
                "Optimized performance through Redis caching and query tuning, achieving significant speed improvements.",
                "Toi uu hieu nang bang Redis cache va tinh chinh truy van, giup cai thien toc do dang ke."
            ),
        ],
    },
    {
        date: "2021 - 2022",
        role: localized("Junior Backend Developer", "Lap trinh vien Backend Junior"),
        company: "Onicorn Media, JSC",
        mutedDot: false,
        points: [
            localized(
                "Participated in Laravel web application development and maintenance, improving overall code quality.",
                "Tham gia phat trien va bao tri ung dung web Laravel, dong thoi nang cao chat luong code tong the."
            ),
            localized(
                "Collaborated cross-functionally to ship features and hotfixes in tight sprint cycles.",
                "Phoi hop lien phong ban de phat hanh tinh nang va hotfix trong cac sprint gap."
            ),
            localized(
                "Enhanced application performance through systematic code reviews and optimization.",
                "Cai thien hieu nang ung dung thong qua review code va toi uu co he thong."
            ),
        ],
    },
    {
        date: "2018 - 2022",
        role: localized("Information Technology - Honors", "Cong nghe Thong tin - Loai Gioi"),
        company: "Thu Duc College",
        mutedDot: true,
        points: [
            localized(
                "Built Laravel web apps and participated in student tech competitions.",
                "Xay dung cac web app Laravel va tham gia cac cuoc thi cong nghe sinh vien."
            ),
            localized(
                "Contributed to large team projects with successful outcomes.",
                "Dong gop vao cac du an nhom quy mo lon voi ket qua tot."
            ),
        ],
    },
];

export const blogContent = {
    title: localized("Writing and Thoughts", "Bai viet va chia se"),
    description: localized(
        "Deep dives on Laravel, backend architecture, performance tuning, and lessons from production systems.",
        "Nhung bai viet chuyen sau ve Laravel, kien truc backend, toi uu hieu nang va bai hoc tu he thong production."
    ),
    filters: [
        { id: "all", label: localized("All", "Tat ca") },
        { id: "laravel", label: localized("Laravel", "Laravel") },
        { id: "redis", label: localized("Redis", "Redis") },
        { id: "docker", label: localized("Docker", "Docker") },
        { id: "performance", label: localized("Performance", "Hieu nang") },
    ],
    footer: localized("Backend Engineer", "Ky su Backend"),
};

export const blogPosts = [
    {
        title: localized(
            "Redis Caching Strategies in Laravel: A Practical Guide",
            "Chien luoc cache Redis trong Laravel: Huong dan thuc chien"
        ),
        description: localized(
            "How I reduced API response times by 60% using smart cache invalidation patterns and Redis data structures.",
            "Cach toi giam 60% thoi gian phan hoi API bang mau invalidation hop ly va cau truc du lieu Redis."
        ),
        tag: "redis",
        date: "May 2025",
        readTime: localized("8 min read", "8 phut doc"),
    },
    {
        title: localized(
            "Designing RESTful APIs that Scale: Lessons from Production",
            "Thiet ke RESTful API co kha nang mo rong: Bai hoc tu production"
        ),
        description: localized(
            "Patterns and anti-patterns I have encountered building APIs for high-traffic Laravel backends at Wacontre.",
            "Nhung pattern va anti-pattern toi gap khi xay API cho backend Laravel co luong truy cap cao tai Wacontre."
        ),
        tag: "laravel",
        date: "Apr 2025",
        readTime: localized("12 min read", "12 phut doc"),
    },
    {
        title: localized(
            "Dockerizing Your Laravel App: From Dev to Production",
            "Docker hoa ung dung Laravel: Tu dev den production"
        ),
        description: localized(
            "A step-by-step walkthrough of the Docker setup I use to ensure environment consistency across all stages.",
            "Huong dan tung buoc ve cau hinh Docker toi dung de giu moi truong nhat quan qua moi giai doan."
        ),
        tag: "docker",
        date: "Mar 2025",
        readTime: localized("10 min read", "10 phut doc"),
    },
    {
        title: localized(
            "N+1 Query Problem: How to Find and Kill It in Laravel",
            "Van de N+1 Query: Cach phat hien va xu ly trong Laravel"
        ),
        description: localized(
            "Using Laravel Debugbar, query logs, and eager loading to eliminate the most common performance killer.",
            "Su dung Laravel Debugbar, query log va eager loading de loai bo nguyen nhan gay cham pho bien."
        ),
        tag: "performance",
        date: "Feb 2025",
        readTime: localized("7 min read", "7 phut doc"),
    },
    {
        title: localized(
            "Queue Workers and Horizon: Managing Background Jobs at Scale",
            "Queue Worker va Horizon: Quan ly tac vu nen o quy mo lon"
        ),
        description: localized(
            "Setting up Laravel Horizon with Redis for reliable async processing without the headaches.",
            "Cach thiet lap Laravel Horizon voi Redis de xu ly bat dong bo on dinh va de quan ly."
        ),
        tag: "laravel",
        date: "Jan 2025",
        readTime: localized("9 min read", "9 phut doc"),
    },
    {
        title: localized(
            "MySQL Index Optimization: Stop Guessing, Start Profiling",
            "Toi uu index MySQL: Dung doan, hay do va phan tich"
        ),
        description: localized(
            "Real-world indexing strategies and how to use EXPLAIN to understand what MySQL is actually doing.",
            "Chien luoc indexing thuc te va cach dung EXPLAIN de hieu MySQL dang xu ly dieu gi."
        ),
        tag: "performance",
        date: "Dec 2024",
        readTime: localized("11 min read", "11 phut doc"),
    },
];

export const cryptoContent = {
    title: localized("Crypto Dashboard", "Bang gia Crypto"),
    description: localized(
        "// simulated_prices - refresh_interval=5s - not_financial_advice",
        "// gia_mo_phong - cap_nhat=5s - khong_phai_loi_khuyen_tai_chinh"
    ),
    disclaimer: localized(
        "Simulated data only. Not financial advice. For display purposes.",
        "Du lieu mo phong. Khong phai loi khuyen tai chinh. Chi dung de hien thi."
    ),
    footer: localized("Backend Engineer", "Ky su Backend"),
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
