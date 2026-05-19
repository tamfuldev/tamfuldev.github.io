import {
    FiBriefcase,
    FiCalendar,
    FiEdit3,
    FiExternalLink,
    FiFileText,
    FiHome,
    FiLogOut,
    FiMap,
    FiPlus,
    FiShield,
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

const AdminShell = ({
    children,
    kicker = "// portfolio_admin",
    onCreate,
    onLogout,
    primaryAction,
    title = "Admin Manager",
    user,
}) => {
    const action = primaryAction || (onCreate
        ? {
            icon: <FiPlus />,
            label: "New Blog",
            onClick: onCreate,
        }
        : null);

    return (
    <div className="admin-app">
        <aside className="admin-sidebar">
            <div className="admin-brand">
                <span className="admin-brand-mark">T</span>
                <div>
                    <strong>Tam CMS</strong>
                    <span>Control center</span>
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
                <NavLink
                    className={({ isActive }) => `admin-menu-item${isActive ? " is-active" : ""}`}
                    to="/admin/projects"
                >
                    <FiBriefcase />
                    Projects
                </NavLink>
                <NavLink
                    className={({ isActive }) => `admin-menu-item${isActive ? " is-active" : ""}`}
                    to="/admin/roadmap"
                >
                    <FiMap />
                    Roadmap
                </NavLink>
                <NavLink
                    className={({ isActive }) => `admin-menu-item${isActive ? " is-active" : ""}`}
                    to="/admin/daily-plan"
                >
                    <FiCalendar />
                    Daily Plan
                </NavLink>
                {onCreate && (
                    <button type="button" className="admin-menu-item" onClick={onCreate}>
                        <FiEdit3 />
                        Write
                    </button>
                )}
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
                    <p className="admin-kicker">{kicker}</p>
                    <h1>{title}</h1>
                </div>
                <div className="admin-topbar-actions">
                    {action && (
                        <button type="button" className="admin-btn admin-btn-primary" onClick={action.onClick}>
                            {action.icon}
                            {action.label}
                        </button>
                    )}
                    <button type="button" className="admin-icon-btn" onClick={onLogout} title="Sign out">
                        <FiLogOut />
                    </button>
                </div>
            </header>

            {children}
        </main>
    </div>
    );
};

export default AdminShell;
