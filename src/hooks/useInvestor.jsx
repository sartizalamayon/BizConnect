import { useQuery } from 'react-query'
import { useContext } from "react";
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from './useAxiosPublic';


const useInvestor = () => {
    
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const {data: investorData, refetch} = useQuery({
        queryKey: ['user-investor',user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/investors/${user.email}`);
            return res.data
        },
    }
    )
    return [investorData, refetch]
};

export default useInvestor;