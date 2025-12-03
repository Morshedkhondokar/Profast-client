import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

// hooks/useUserRole.js - 
const useUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  console.log("useUserRole: User email from useAuth:", user?.email); // ✅ Add this

  const {
    data: userRole = null,
    isLoading: roleLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error('No user email found');
      }

      const response = await axiosSecure.get(`/users/role/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email && !authLoading,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  }); 

  return {
    userRole,
    isLoading: authLoading || roleLoading,
    error,
    refetch,
    isAdmin: userRole?.role === 'admin',
    isRider: userRole?.role === 'rider',
    isUser: userRole?.role === 'user',
  };
};
export default useUserRole;