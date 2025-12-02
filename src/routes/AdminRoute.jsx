import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth"
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({Children}) => {
    const {user, loading} = useAuth();
    const {userRole, isLoading} = useUserRole();
     

    if(loading || isLoading){
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if(!user || userRole !== 'admin'){
        return <Navigate to='/forbidden' state={{from:location.pathname}}/>
    }



  return Children;
}

export default AdminRoute
