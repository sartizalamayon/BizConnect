import { useQuery } from 'react-query'
import { useContext } from "react";
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from './useAxiosPublic';


const useStudent = () => {
    
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const {data: student, refetch} = useQuery({
        queryKey: ['user-student',user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/students/${user?.email}`);
            console.log(res.data)
            return res.data
        },
    }
    )
    return [student, refetch]
};

export default useStudent;