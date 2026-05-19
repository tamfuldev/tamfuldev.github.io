import { useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import DailyPlanManager from "../components/admin/DailyPlanManager";
import { auth } from "../configs/firebase";
import "../styles/admin.css";

const AdminDailyPlan = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <AdminShell
            kicker="// daily_plan_admin"
            title="Daily Plan Manager"
            user={user}
            onLogout={handleLogout}
        >
            <DailyPlanManager />
        </AdminShell>
    );
};

export default AdminDailyPlan;
