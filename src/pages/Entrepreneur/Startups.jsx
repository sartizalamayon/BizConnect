import { useContext, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from '../../auth/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';

const Startups = () => {
  const {user} = useContext(AuthContext);
  const [startupData, setStartupData] = useState({
    email : user?.email,
    startup_name: '',
    description: '',
    total_funding_raised: '',
    funding_goal: '',
    current_funding: '',
    open_for_fund_raising: false,
    date: '',
    industry: ''
  });
  const axiosPublic = useAxiosPublic();
  
  const { data: startups, isLoading, refetch } = useQuery('startups', async () => {
    const response = await axiosPublic.get(`/startups/${user?.email}`);
    return response.data;
  });

  const mutation = useMutation(
    (newStartup) => axiosPublic.post('/startup/new', newStartup),
    {
      onSuccess: () => {
        refetch();
        toast('StartUp Added Successfully');
        setStartupData({
          startup_name: '',
          description: '',
          total_funding_raised: '',
          funding_goal: '',
          current_funding: '',
          open_for_fund_raising: false,
          date: '',
          industry: ''
        });
      },
      onError: () => {
        toast.error('Error Adding Startup');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(startupData);
    
  };

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] lg:ml-40 bg-gray-950 text-gray-300">
      <Toaster position='top-right' />
      <div className="container mx-auto pb-7">
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Add Startup</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Adjusted form size and styling */}
          <div>
            <label className="block text-gray-400">Startup Name</label>
            <input
              type="text"
              name="startup_name"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, startup_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Description</label>
            <textarea
              name="description"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Total Funding Raised</label>
            <input
              type="number"
              name="total_funding_raised"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, total_funding_raised: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Funding Goal</label>
            <input
              type="number"
              name="funding_goal"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, funding_goal: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Current Funding</label>
            <input
              type="number"
              name="current_funding"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, current_funding: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Open for Fund Raising</label>
            <input
              type="checkbox"
              name="open_for_fund_raising"
              className="w-6 h-6 text-purple-500 bg-gray-700 border rounded focus:outline-none focus:border-purple-500"
              onChange={(e) => setStartupData({ ...startupData, open_for_fund_raising: e.target.checked })}
            />
          </div>

          <div>
            <label className="block text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Industry</label>
            <input
              type="text"
              name="industry"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setStartupData({ ...startupData, industry: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Add Startup
          </button>
        </form>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
          <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>My Startups</h1>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Converted table rows to cards */}
            {startups?.map((startup) => (
              <div key={startup._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-purple-400 mb-2">{startup.startup_name}</h3>
                <p><span className="font-semibold">Description:</span> {startup.description}</p>
                <p><span className="font-semibold">Total Funding Raised:</span> ${startup.total_funding_raised}</p>
                <p><span className="font-semibold">Funding Goal:</span> ${startup.funding_goal}</p>
                <p><span className="font-semibold">Current Funding:</span> ${startup.current_funding}</p>
                <p><span className="font-semibold">Open for Fund Raising:</span> {startup.open_for_fund_raising ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Date:</span> {new Date(startup.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Industry:</span> {startup.industry}</p>
              </div>
            ))}
          </div>
          </>)}
      </div>
    </div>
  );
};

export default Startups;
