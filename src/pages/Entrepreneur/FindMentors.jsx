import { useState, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Toaster } from 'react-hot-toast';

const FindMentors = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const axiosPublic = useAxiosPublic();
  const [openModalEmail, setOpenModalEmail] = useState(null);

  // Fetch mentors data
  const { data: mentors = [], isLoading, error, refetch } = useQuery(
    'mentors',
    async () => {
      const response = await axiosPublic.get('/mentors');
      return response.data;
    },
    {
      enabled: !(skillFilter.trim() === '' && interestFilter.trim() === ''),
    }
  );

  // Refetch mentors when skill or interest filter is cleared
  useEffect(() => {
    if (skillFilter.trim() === '' && interestFilter.trim() === '') {
      refetch();
    }
  }, [skillFilter, interestFilter, refetch]);

  // Filter mentors based on skills and interests
  const filteredMentors = useMemo(() => {
    const trimmedSkillFilter = skillFilter.trim().toLowerCase();
    const trimmedInterestFilter = interestFilter.trim().toLowerCase();

    return mentors.filter(mentor => {
      const hasSkills =
        trimmedSkillFilter === '' ||
        (mentor.skills && mentor.skills.some(skill => skill.toLowerCase().includes(trimmedSkillFilter)));
      
      const hasInterests =
        trimmedInterestFilter === '' ||
        (mentor.interested_fields && mentor.interested_fields.some(field => field.toLowerCase().includes(trimmedInterestFilter)));
      
      return hasSkills && hasInterests;
    });
  }, [mentors, skillFilter, interestFilter]);

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
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Find Mentors</h1>

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

        {/* Displaying Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {filteredMentors.length > 0 ? (
            filteredMentors.map(mentor => (
              <div
                className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl transition duration-300"
                key={mentor.email}
              >
                <div className="card-body items-center text-center">
                  <h2 className='card-title text-2xl'>{mentor.name}</h2>
                  <p>Interested in <b>{mentor.interested_fields.join(', ')}</b>.</p>
                  <h3 className='text-lg'>Skills: <b>{mentor.skills.join(', ')}</b></h3>

                  <section className='flex justify-between flex-row w-full mt-4'>
                    {/* See Details Button */}
                    <button
                      className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white"
                      onClick={() => setOpenModalEmail(mentor.email)}
                    >
                      See Details
                    </button>

                    {/* Contact Button */}
                    <div className="card-actions">
                      <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white">
                        <a href={`mailto:${mentor.email}`}>Contact</a>
                      </button>
                    </div>
                  </section>
                </div>

                {/* Modal Dialog */}
                {openModalEmail === mentor.email && (
                  <dialog
                    open
                    onClose={() => setOpenModalEmail(null)}
                    className="modal"
                  >
                    <div className="modal-box w-11/12 max-w-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-black">
                      <div className="p-8">
                        {/* Mentor Name */}
                        <h3 className="font-bold text-2xl text-white mb-4">
                          {mentor.name || 'N/A'}
                        </h3>

                        {/* Mentor Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-white"><span className="font-semibold">Phone Number:</span> {mentor.phone_number || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">LinkedIn:</span> {mentor.linkedin || 'N/A'}</p>
                          </div>
                          {mentor.website && (
                            <div className="col-span-1 md:col-span-2">
                              <p className="text-white"><span className="font-semibold">Website:</span> <a href={mentor.website} className="underline" target="_blank" rel="noopener noreferrer">{mentor.website}</a></p>
                            </div>
                          )}
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="font-bold text-lg text-white">Skills:</h4>
                            <p className="text-white">{mentor.skills.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Interested Fields:</h4>
                            <p className="text-white">{mentor.interested_fields.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Experience:</h4>
                            <p className="text-white">{mentor.experience}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Current Investments:</h4>
                            <p className="text-white">${mentor.total_investments.toLocaleString()}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Companies:</h4>
                            <p className="text-white">{mentor.company_names.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Open for Investments:</h4>
                            <p className="text-white">{mentor.open_for_investments ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Open for Mentorship:</h4>
                            <p className="text-white">{mentor.open_for_mentorship ? 'Yes' : 'No'}</p>
                          </div>
                        </div>

                        {/* Close Modal Button */}
                        <div className="modal-action">
                          <button className="btn bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white" onClick={() => setOpenModalEmail(null)}>Close</button>
                        </div>
                      </div>
                    </div>
                  </dialog>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-400">No mentors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMentors;
