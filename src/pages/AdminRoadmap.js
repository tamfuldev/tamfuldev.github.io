import { useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import RoadmapManager from "../components/admin/RoadmapManager";
import { auth } from "../configs/firebase";
import "../styles/admin.css";

const AdminRoadmap = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <AdminShell
            kicker="// roadmap_admin"
            title="Roadmap Manager"
            user={user}
            onLogout={handleLogout}
        >
            <RoadmapManager />
        </AdminShell>
    );
};

export default AdminRoadmap;
