const Home = () => {

    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-left">
                            <div className="hero-badges">
                                <span className="badge" data-en="🚀 FULLSTACK" data-vi="🚀 FULLSTACK">🚀 FULLSTACK</span>
                                <span className="badge" data-en="⛓️ BLOCKCHAIN" data-vi="⛓️ CHUỖI BLOCKCHAIN">⛓️ BLOCKCHAIN</span>
                                <span className="badge" data-en="🌐 WEB3" data-vi="🌐 WEB3">🌐 WEB3</span>
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

                            <div className="hero-socials">
                                <a href="https://github.com/yourusername" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
                                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                                <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
                            </div>
                        </div>

                        <div className="hero-right">
                            <div className="portrait-box">
                                <img src="assets/img/avatar.png" alt="Saitama" className="portrait floating" />
                                <div className="portrait-glow"></div>

                                <div className="tech-icon-float php"><i className="fa-brands fa-php"></i></div>
                                <div className="tech-icon-float laravel"><i className="fa-brands fa-laravel"></i></div>
                                <div className="tech-icon-float html5"><i className="fa-brands fa-html5"></i></div>
                                <div className="tech-icon-float css3"><i className="fa-brands fa-css3"></i></div>
                                <div className="tech-icon-float react"><i className="fa-brands fa-react"></i></div>
                                <div className="tech-icon-float node"><i className="fa-brands fa-node-js"></i></div>
                                <div className="tech-icon-float ethereum"><i className="fa-brands fa-ethereum"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title" data-en="Technical Skills" data-vi="技術スキル">Technical Skills</h2>

                    <div className="skills-grid">
                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">🎯</span>
                                <span className="skill-name" data-en="Offensive Security" data-vi="攻撃的セキュリティ">Offensive Security</span>
                            </div>
                        </div>

                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">🔍</span>
                                <span className="skill-name" data-en="Penetration Testing" data-vi="ペネトレーションテスト">Penetration Testing</span>
                            </div>
                        </div>

                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">⚔️</span>
                                <span className="skill-name" data-en="Red Team Operations" data-vi="レッドチーム作戦">Red Team Operations</span>
                            </div>
                        </div>

                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">💣</span>
                                <span className="skill-name" data-en="Exploit Development" data-vi="エクスプロイト開発">Exploit Development</span>
                            </div>
                        </div>

                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">🌐</span>
                                <span className="skill-name" data-en="Web Security" data-vi="ウェブセキュリティ">Web Security</span>
                            </div>
                        </div>

                        <div className="skill-card">
                            <div className="skill-header">
                                <span className="skill-icon">🏆</span>
                                <span className="skill-name" data-en="Bug Bounty" data-vi="バグ報奨金">Bug Bounty</span>
                            </div>
                        </div>
                    </div>

                    <div className="lang-showcase">
                        <h3 data-en="Programming Languages" data-vi="プログラミング言語">Programming Languages</h3>
                        <div className="lang-grid">
                            <span>PHP</span>
                            <span>Java</span><span>TypeScript</span><span>JavaScript</span>
                            <span>PowerShell</span><span>Bash</span>
                            <span>HTML5</span><span>CSS3</span>
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

            <section id="blogs" className="section">
                <div className="container">
                    <h2 className="section-title" data-en="Recent posts" data-vi="Bài viết gần đây">Recent posts</h2>

                </div>
            </section>
        </>
    );
}

export default Home;