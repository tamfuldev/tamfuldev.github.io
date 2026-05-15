import {
    FiEdit3,
    FiExternalLink,
    FiFileText,
    FiHome,
    FiLogOut,
    FiPlus,
    FiShield,
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

const AdminShell = ({ children, onCreate, onLogout, user }) => (
    <div className="admin-app">
        <aside className="admin-sidebar">
            <div className="admin-brand">
                <span className="admin-brand-mark">T</span>
                <div>
                    <strong>Tam CMS</strong>
                    <span>Blog control</span>
                </div>
            </div>

            <nav className="admin-menu" aria-label="Admin navigation">
                <NavLink
                    className={({ isActive }) => `admin-menu-item${isActive ? " is-active" : ""}`}
                    end
                    to="/admin"
                >
                    <FiHome />
                    Dashboard
                </NavLink>
                <NavLink
                    className={({ isActive }) => `admin-menu-item${isActive ? " is-active" : ""}`}
                    to="/admin/blog"
                >
                    <FiFileText />
                    Blogs
                </NavLink>
                <button type="button" className="admin-menu-item" onClick={onCreate}>
                    <FiEdit3 />
                    Write
                </button>
                <Link className="admin-menu-item" to="/blog">
                    <FiExternalLink />
                    Public Blog
                </Link>
            </nav>

            <div className="admin-access-card">
                <FiShield />
                <div>
                    <strong>Firebase protected</strong>
                    <span>{user?.email || "Signed in admin"}</span>
                </div>
            </div>
        </aside>

        <main className="admin-main">
            <header className="admin-topbar">
                <div>
                    <p className="admin-kicker">{"// portfolio_blog_admin"}</p>
                    <h1>Blog Manager</h1>
                </div>
                <div className="admin-topbar-actions">
                    <button type="button" className="admin-btn admin-btn-primary" onClick={onCreate}>
                        <FiPlus />
                        New Blog
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={onLogout} title="Sign out">
                        <FiLogOut />
                    </button>
                </div>
            </header>

            {children}
        </main>
    </div>
);

export default AdminShell;
