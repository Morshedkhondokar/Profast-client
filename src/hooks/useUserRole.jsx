import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

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
      return response.data; // { email, role, created_date, ... }
    },
    enabled: !!user?.email && !authLoading, // If only email and no auth loading 
    staleTime: 5 * 60 * 1000, // 5 minutes cache  
    retry: 2, 
  });

  return {
    userRole, // { email, role, created_date, ... }
    isLoading: authLoading || roleLoading,
    error,
    refetch,
    isAdmin: userRole?.role === 'admin',
    isRider: userRole?.role === 'rider',
    isUser: userRole?.role === 'user',
  };
};

export default useUserRole;