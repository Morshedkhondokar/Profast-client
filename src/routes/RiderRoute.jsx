import { useLocation } from "react-router";
import useUserRole from "../hooks/useUserRole";
import useAuth from "../hooks/useAuth";

const RiderRoute = ({children}) => {
  const { user, loading } = useAuth();
    const { isRider, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    if (!user || !isRider) {
        console.log("Admin access denied. User:", user?.email, "Is Admin:", isAdmin);
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children;
}

export default RiderRoute
