// routes/AdminRoute.jsx
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isAdmin, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    if (!user || !isAdmin) {
        console.log("Admin access denied. User:", user?.email, "Is Admin:", isAdmin);
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default AdminRoute;