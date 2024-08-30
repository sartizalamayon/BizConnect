import { useQuery } from 'react-query'
import { useContext } from "react";
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from './useAxiosPublic';

const useEntrepreneur = () => {
    
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const {data: entreData, refetch} = useQuery({
        queryKey: ['user-entre',user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/entrepreneurs/${user.email}`);
            return res.data
        },
    }
    )

    return [entreData, refetch]
};

export default useEntrepreneur;