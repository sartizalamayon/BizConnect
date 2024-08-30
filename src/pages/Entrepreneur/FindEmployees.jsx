import { useState, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Toaster } from 'react-hot-toast';

const FindEmployees = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const axiosPublic = useAxiosPublic();
  const [openModalEmail, setOpenModalEmail] = useState(null);

  // Fetch students data
  const { data: students = [], isLoading, error, refetch } = useQuery(
    'students',
    async () => {
      const response = await axiosPublic.get('/students');
      return response.data;
    },
    {
      enabled: !(skillFilter.trim() === '' && interestFilter.trim() === ''),
    }
  );

  // Refetch students when skill or interest filter is cleared
  useEffect(() => {
    if (skillFilter.trim() === '' && interestFilter.trim() === '') {
      refetch();
    }
  }, [skillFilter, interestFilter, refetch]);

  // Filter students based on skills and interests
  const filteredStudents = useMemo(() => {
    const trimmedSkillFilter = skillFilter.trim().toLowerCase();
    const trimmedInterestFilter = interestFilter.trim().toLowerCase();

    return students.filter(student => {
      const hasSkills =
        trimmedSkillFilter === '' ||
        (student.skills && student.skills.some(skill => skill.toLowerCase().includes(trimmedSkillFilter)));
      
      const hasInterests =
        trimmedInterestFilter === '' ||
        (student.interested_fields && student.interested_fields.some(field => field.toLowerCase().includes(trimmedInterestFilter)));
      
      return hasSkills && hasInterests;
    });
  }, [students, skillFilter, interestFilter]);

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
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Find Employees</h1>

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

        {/* Displaying Students */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div
                className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl transition duration-300"
                key={student.email}
              >
                <div className="card-body items-center text-center">
                  <h2 className='card-title text-2xl'>{student.email}</h2>
                  <p>Interested in <b>{student.interested_fields.join(', ')}</b>.</p>
                  <h3 className='text-lg'>Skills: <b>{student.skills.join(', ')}</b></h3>

                  <section className='flex justify-between flex-row w-full mt-4'>
                    {/* See Details Button */}
                    <button
                      className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white"
                      onClick={() => setOpenModalEmail(student.email)}
                    >
                      See Details
                    </button>

                    {/* Contact Button */}
                    <div className="card-actions">
                      <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white">
                        <a href={`mailto:${student.email}`}>Contact</a>
                      </button>
                    </div>
                  </section>
                </div>

                {/* Modal Dialog */}
                {openModalEmail === student.email && (
                  <dialog
                    open
                    onClose={() => setOpenModalEmail(null)}
                    className="modal"
                  >
                    <div className="modal-box w-11/12 max-w-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-black">
                      <div className="p-8">
                        {/* Student Name */}
                        <h3 className="font-bold text-2xl text-white mb-4">
                          {student.email || 'N/A'}
                        </h3>

                        {/* Student Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-white"><span className="font-semibold">Major:</span> {student.major || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">Graduation Year:</span> {student.graduation_year || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">Introduction:</span> {student.introduction || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">Experience:</span> {student.experience || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">Highest Education Degree:</span> {student.highest_education_degree || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white"><span className="font-semibold">Last Result (GPA):</span> {student.last_result || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Skills:</h4>
                            <p className="text-white">{student.skills.join(', ')}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">Interested Fields:</h4>
                            <p className="text-white">{student.interested_fields.join(', ')}</p>
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
            <p className="text-center text-xl text-gray-400">No students found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindEmployees;
