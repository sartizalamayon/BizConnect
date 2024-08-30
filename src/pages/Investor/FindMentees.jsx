import { useEffect, useState } from 'react';

const FindEmployees = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [userDetails, setUserDetails] = useState({});

  // Function to fetch entrepreneur data
  useEffect(() => {
    fetch('/public/entrprofile.json')
      .then(res => res.json())
      .then(data => {
        setEntrepreneurs(data);
        setFilteredEntrepreneurs(data);
      });
  }, []);

  // Function to fetch user details
  useEffect(() => {
    fetch('/public/user.json')
      .then(res => res.json())
      .then(data => {
        // Organize user details by email for easy lookup
        const userDetailsMap = {};
        data.forEach(user => {
          userDetailsMap[user.email] = user;
        });
        setUserDetails(userDetailsMap);
      });
  }, []);

  // Function to filter entrepreneurs based on skills and interests
  useEffect(() => {
    const filtered = entrepreneurs.filter(entrepreneur =>
      entrepreneur.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())) &&
      (interestFilter === '' || entrepreneur.interested_fields.some(field => field.toLowerCase().includes(interestFilter.toLowerCase())))
    );
    setFilteredEntrepreneurs(filtered);
  }, [skillFilter, interestFilter, entrepreneurs]);

  // Function to calculate age based on birth year
  function age(birthYear) {
    return 2024 - parseInt(birthYear, 10);
  }

  // Render function
  return (
    <div className="bg-gray-950 text-gray-300 lg:ml-40">
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

        {/* Displaying Entrepreneurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {filteredEntrepreneurs.map(entrepreneur => (
            <div className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl" key={entrepreneur.email}>

              {/* Card Body */}
              <div className="card-body items-center text-center">
                {userDetails[entrepreneur.email] && (
                  <div>
                    <h2 className='card-title text-2xl'>{userDetails[entrepreneur.email].name}</h2>
                  </div>
                )}
                <p>Interested in <b>{entrepreneur.interested_fields.join(', ')}</b>.</p>
                <h3 className='text-lg'>Skills: <b>{entrepreneur.skills.join(', ')}</b></h3>

                {/* Fetch and display entrepreneur details */}
                <section className='flex justify-between flex-row w-full'>
                  <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white" onClick={() => document.getElementById(`modal${entrepreneur.email}`).showModal()}>See Details</button>

                  {/* Modal Dialog Definition */}
                  <dialog id={`modal${entrepreneur.email}`} className="modal">
                    <div className="modal-box w-11/12 max-w-5xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-black">
                      <div className="p-8">
                        {/* Entrepreneur Name */}
                        <h3 className="font-bold text-2xl text-white mb-4">{entrepreneur.name}</h3>

                        {/* User Details */}
                        {userDetails[entrepreneur.email] && (
                          <div className="mb-6">
                            <h2 className="text-2xl text-white font-bold">{userDetails[entrepreneur.email].name}</h2>
                            <p className="text-white">Phone Number: {userDetails[entrepreneur.email]?.phone_number}</p>
                            <p className="text-white">LinkedIn: {userDetails[entrepreneur.email]?.linkedin}</p>
                            {userDetails[entrepreneur.email]?.website && <p className="text-white">Website: {userDetails[entrepreneur.email].website}</p>}
                          </div>
                        )}

                        {/* Additional Details */}
                        <div className="flex flex-wrap mb-6">
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Skills:</h4>
                            <p className="text-white">{entrepreneur.skills.join(', ')}</p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Interested Field:</h4>
                            <p className="text-white">{entrepreneur.interested_fields.join(', ')}</p>
                          </div>
                        </div>

                        {/* Employment and Experience Details */}
                        <div className="flex flex-wrap mb-6">
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Current Employment Type:</h4>
                            <p className="text-white">{entrepreneur.current_employment_status ? 'Employed' : 'Unemployed'}</p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Experience:</h4>
                            <p className="text-white">{entrepreneur.experience}</p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            {userDetails[entrepreneur.email] && (
                              <div className="mb-6">
                                <h4 className="font-bold text-lg text-white">Age: {age(userDetails[entrepreneur.email].birth_year)}</h4>
                              </div>
                            )}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Total Fund Raised:</h4>
                            <p className="text-white">${entrepreneur.total_fund_raised}</p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <h4 className="font-bold text-lg text-white">Company Names:</h4>
                            <p className="text-white">{entrepreneur.company_names.join(', ')}</p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="mb-6">
                          <h4 className="font-bold text-lg text-white">Email:</h4>
                          <p className="text-white"><a href={`mailto:${entrepreneur.email}`}>{entrepreneur.email}</a></p>
                        </div>

                        {/* Modal Dialog Action */}
                        <div className="flex justify-end">
                          <button className="btn btn-ghost bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-white font-bold hover:text-white" onClick={() => document.getElementById(`modal${entrepreneur.email}`).close()}>Close</button>
                        </div>
                      </div>
                    </div>
                  </dialog>

                  {/* Contact Button */}
                  <div className="card-actions">
                    <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white">
                      <a href={`mailto:${entrepreneur.email}`}>Contact</a>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindEmployees;
