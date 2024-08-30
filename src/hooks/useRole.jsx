import { useQuery } from '@tanstack/react-query'
import { useContext } from "react";
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from './useAxiosPublic';


const useRole = () => {
    
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const {data: role = []} = useQuery({
        queryKey: ['user-role',user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/role/${user.email}`);
            return res.data
        },
    }
    )

    return [role]
};

export default useRole;