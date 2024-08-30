import { useContext } from "react";
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from "react-query";


const useUser = () => {
    
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const {data, refetch} = useQuery({
        queryKey: ['user ',user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/user/${user.email}`);
            return res.data
        },
    }
    )

    return [data, refetch]
};

export default useUser;