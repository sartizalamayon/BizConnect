import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Toaster } from 'react-hot-toast';

const FindStartups = () => {
  const [industryFilter, setIndustryFilter] = useState('');
  const axiosPublic = useAxiosPublic();

  // Fetch startups data
  const { data: startups = [], isLoading, error, refetch } = useQuery(
    'startups',
    async () => {
      const response = await axiosPublic.get('/entrepreneur-startups/funding');
      return response.data;
    },
    {
      enabled: industryFilter.trim() !== '',
    }
  );

  // Refetch startups when industry filter is cleared
  useEffect(() => {
    if (industryFilter.trim() === '') {
      refetch();
    }
  }, [industryFilter, refetch]);

  // Filter startups based on industry
  const filteredStartups = useMemo(() => {
    const trimmedIndustryFilter = industryFilter.trim().toLowerCase();
    return startups.filter(startup => 
      trimmedIndustryFilter === '' || 
      (startup.industry && startup.industry.toLowerCase().includes(trimmedIndustryFilter))
    );
  }, [startups, industryFilter]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <p className="text-xl text-gray-300">Loading...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <p className="text-xl text-red-500">Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-300 lg:ml-40 min-h-screen">
      <Toaster position='top-right' />
      <div className="container mx-auto pb-7">
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Find Startups</h1>

        {/* Filters Section */}
        <div className="flex justify-center space-x-4 py-4">
          <input
            type="text"
            placeholder="Search by industry..."
            className="p-2 px-4 rounded-full bg-white text-gray-800 placeholder-gray-500"
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
          />
        </div>

        {/* Displaying Startups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {filteredStartups.length > 0 ? (
            filteredStartups.map(startup => (
              <div
                className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl transition duration-300"
                key={startup.email}
              >
                <div className="card-body items-center text-center">
                  <h2 className='card-title text-2xl'>{startup.startup_name}</h2>
                  <p><b>{startup.industry}</b></p>
                  <p className="text-gray-200 mb-2">{startup.description}</p>
                  <p><span className="font-semibold">Total Funding Raised:</span> ${startup.total_funding_raised}</p>
                  <p><span className="font-semibold">Funding Goal:</span> ${startup.funding_goal}</p>
                  <p><span className="font-semibold">Current Funding:</span> ${startup.current_funding}</p>

                  <section className='flex justify-between flex-row w-full mt-4'>
                    {/* Contact Button */}
                    <div className="card-actions">
                      <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white">
                        <a href={`mailto:${startup.email}`}>Contact</a>
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-lg">No startups found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindStartups;
