import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Toaster } from 'react-hot-toast';

const FindPartners = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const axiosPublic = useAxiosPublic();

  // Fetch partners data
  const { data: partners = [], isLoading, error, refetch } = useQuery(
    'partners',
    async () => {
      const response = await axiosPublic.get('/partners');
      return response.data;
    },
    {
      enabled: !(skillFilter.trim() === '' && interestFilter.trim() === ''),
    }
  );

  // Refetch partners when skill or interest filter is cleared
  useEffect(() => {
    if (skillFilter.trim() === '' && interestFilter.trim() === '') {
      refetch();
    }
  }, [skillFilter, interestFilter, refetch]);

  // Filter partners based on skills and interests
  const filteredPartners = useMemo(() => {
    const trimmedSkillFilter = skillFilter.trim().toLowerCase();
    const trimmedInterestFilter = interestFilter.trim().toLowerCase();

    return partners.filter(partner => {
      const hasSkills =
        trimmedSkillFilter === '' ||
        (partner.skills && partner.skills.some(skill => skill.toLowerCase().includes(trimmedSkillFilter)));
      
      const hasInterests =
        trimmedInterestFilter === '' ||
        (partner.interested_fields && partner.interested_fields.some(field => field.toLowerCase().includes(trimmedInterestFilter)));
      
      return hasSkills && hasInterests;
    });
  }, [partners, skillFilter, interestFilter]);

  // Calculate age based on birth year
  const calculateAge = (birthYear) => {
    if (!birthYear) return 'N/A';
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(birthYear, 10);
  };

  // Handle modal open and close
  const [openModalEmail, setOpenModalEmail] = useState(null);

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
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Find Co-founders</h1>

        {/* Filters Section */}
        <div className="flex justify-center space-x-4 py-4">
          {/* Skill Filter */}
          <input
            type="text"
            placeholder="Search by skills..."
            className="p-2 px-4 rounded-full bg-white text-gray-800 placeholder-gray-500"
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
          />
          {/* Interest Filter */}
          <input
            type="text"
            placeholder="Search by interests..."
            className="p-2 px-4 rounded-full bg-white text-gray-800 placeholder-gray-500"
            value={interestFilter}
            onChange={e => setInterestFilter(e.target.value)}
          />
        </div>

        {/* Displaying Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {filteredPartners.length > 0 ? (
            filteredPartners.map(partner => (
              <div
                className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl transition duration-300"
                key={partner.email}
              >
                <div className="card-body items-center text-center">
                  <h2 className='card-title text-2xl'>{partner.name}</h2>
                  <p>Interested in <b>{partner.interested_fields.join(', ')}</b>.</p>
                  <h3 className='text-lg'>Skills: <b>{partner.skills.join(', ')}</b></h3>

                  <section className='flex justify-between flex-row w-full mt-4'>
                    {/* See Details Button */}
                    <button
                      className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white"
                      onClick={() => setOpenModalEmail(partner.email)}
                    >
                      See Details
                    </button>

                    {/* Contact Button */}
                    <div className="card-actions">
                      <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white">
                        <a href={`mailto:${partner.email}`}>Contact</a>
                      </button>
                    </div>
                  </section>
                </div>

                {/* Modal Dialog */}
                {openModalEmail === partner.email && (
                  <dialog
                    open
                    onClose={() => setOpenModalEmail(null)}
                    className="modal"
                  >
                    <div className="modal-box w-11/12 max-w-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-black">
                      <div className="p-8">
                        {/* Partner Name */}
                        <h3 className="font-bold text-2xl text-white mb-4">
                          {partner.name || 'N/A'}
                        </h3>

                        {/* User Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-white"><span className="font-semibold">Phone Number:</span> {partner.phone_number || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">LinkedIn:</span> {partner.linkedin || 'N/A'}</p>
                          </div>
                          {partner.website && (
                            <div className="col-span-1 md:col-span-2">
                              <p className="text-white"><span className="font-semibold">Website:</span> <a href={partner.website} className="underline" target="_blank" rel="noopener noreferrer">{partner.website}</a></p>
                            </div>
                          )}
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="font-bold text-lg text-white">Skills:</h4>
                            <p className="text-white">{partner.skills.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Interested Fields:</h4>
                            <p className="text-white">{partner.interested_fields.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Current Employment Status:</h4>
                            <p className="text-white">{partner.current_employment_status ? 'Employed' : 'Unemployed'}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Experience:</h4>
                            <p className="text-white">{partner.experience}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Age:</h4>
                            <p className="text-white">{calculateAge(partner.birth_year)}</p>
                          </div>
                        </div>

                        {/* Close Modal Button */}
                        <div className="modal-action">
                          <button className="btn bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] text-[#462a5f]" onClick={() => setOpenModalEmail(null)}>Close</button>
                        </div>
                      </div>
                    </div>
                  </dialog>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-lg">No partners found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPartners;
