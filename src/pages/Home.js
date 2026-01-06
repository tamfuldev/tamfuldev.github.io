import CryptoTicker from "../components/CryptoTicker";
import Header from "../components/Header";

const Home = () => {
    return (
        <>
            <Header />

            <section id="hero" className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-left">
                            <div className="hero-badges">
                                <span className="badge" data-en="🚀 FULLSTACK" data-vi="🚀 FULLSTACK">🚀 FULLSTACK</span>
                                <span className="badge" data-en="💻 WEB DEV" data-vi="💻 LẬP TRÌNH WEB">💻 WEB DEV</span>
                                <span className="badge" data-en="⛓️ BLOCKCHAIN" data-vi="⛓️ CHUỖI BLOCKCHAIN">⛓️ BLOCKCHAIN</span>
                            </div>

                            <h1 className="hero-title" data-en="Hi — My name's Tam" data-vi="Chào — Tên tôi là Tâm">
                                Hello — My name's <span className="highlight">Tam</span>
                            </h1>

                            <p className="hero-desc"
                                data-en="I build scalable web applications and seamless user experiences. Specializing in bridging the gap between robust backend logic and interactive frontend design."
                                data-vi="Tôi xây dựng các ứng dụng web có khả năng mở rộng và trải nghiệm người dùng mượt mà. Chuyên sâu vào việc kết nối giữa logic hệ thống mạnh mẽ và thiết kế giao diện tương tác.">
                                I build scalable web applications and seamless user experiences. Specializing in bridging the gap between robust backend logic and interactive frontend design.
                            </p>

                            <div className="hero-stats">
                                <div className="stat">
                                    <div className="stat-value">10<span>+</span></div>
                                    <div className="stat-label" data-en="Tech Stack" data-vi="Công nghệ">Tech Stack</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-value">5<span>+</span></div>
                                    <div className="stat-label" data-en="Projects" data-vi="Dự án">Projects</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-value">3<span>Y</span></div>
                                    <div className="stat-label" data-en="Experience" data-vi="Kinh nghiệm">Experience</div>
                                </div>
                            </div>

                            <div className="hero-cta">
                                <a className="btn primary" href="#projects" data-en="Explore Work" data-vi="Khám phá dự án">Explore Work</a>
                                <a className="btn secondary" href="#contact" data-en="Let's Talk" data-vi="Liên hệ ngay">Let's Talk</a>
                            </div>

                            <div className="tech-stack">
                                <span>PHP</span><span>JavaScript</span><span>Java</span><span>React</span><span>MySQL</span>
                            </div>
                        </div>

                        <div className="hero-right">
                            <div className="portrait-box">
                                <img src="assets/img/avatar.png" alt="Saitama" className="portrait" />
                                <div className="portrait-glow"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="section">
                <div className="container">
                    <h2 className="section-title" data-en="About Me" data-vi="Thông tin của tôi">About Me</h2>

                    <p className="about-text" data-en="" data-vi="">

                    </p>

                    <div className="mission-box">
                        <div className="mission-icon">⚡</div>
                        <div>
                            <div className="mission-title" data-en="Mission Statement" data-vi="Tầm nhìn & Sứ mệnh">Mission Statement</div>
                            <div className="mission-text" data-en="" data-vi=""></div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" className="section">
                <div className="container">
                    <h2 className="section-title" data-en="Featured Projects" data-vi="Dự án nổi bật">Featured Projects</h2>
                    <article className="project-card">
                        <div className="project-header">
                            <span className="project-status" data-en="Active" data-vi="Hoạt động">Active</span>
                            <span className="project-cat" data-en="E-commerce" data-vi="Thương mại điện tử">E-commerce</span>
                        </div>
                        <div className="project-body">
                            <h3 className="project-title">TONEIP</h3>
                            <p className="project-desc" data-en="TONEIP is a fast and accurate IP geolocation tool providing IP location, ISP, connection type, and VPN/Proxy details." data-vi="TONEIPは、高速かつ正確なIPジオロケーションツールで、IPの位置情報、ISP、接続タイプ、VPN/プロキシの詳細を提供します。">
                                TONEIP is a fast and accurate IP geolocation tool providing IP location, ISP, connection type, and VPN/Proxy details.
                            </p>
                            <div className="project-tech">
                                <span>Shell</span>
                                <span>OSINT</span>
                                <span>Location</span>
                            </div>
                            <a href="#" target="_blank" className="project-link" data-en="View on GitHub" data-vi="Xem trên GitHub">
                                View on GitHub →
                            </a>
                        </div>
                    </article>
                </div>

            </section>


            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-left">
                            <div className="footer-logo">Tam Saitama<span className="dot">.</span></div>
                            <p className="footer-tag" data-en="Analysis. Action. Precision. Results." data-vi="Phân tích. Hành động. Độ chính xác. Kết quả.">Analysis. Action. Precision. Results.</p>
                        </div>
                        <div className="footer-right">
                            <p>&copy; <span id="year">2026</span> Tam Saitama. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
            <CryptoTicker />
        </>
    );
}

export default Home;