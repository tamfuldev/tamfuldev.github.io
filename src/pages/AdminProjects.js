import { useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import ProjectManager from "../components/admin/ProjectManager";
import { auth } from "../configs/firebase";
import "../styles/admin.css";

const AdminProjects = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <AdminShell
            kicker="// projects_admin"
            title="Projects Manager"
            user={user}
            onLogout={handleLogout}
        >
            <ProjectManager />
        </AdminShell>
    );
};

export default AdminProjects;
