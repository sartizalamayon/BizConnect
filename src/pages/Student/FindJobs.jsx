// pages/FindJobs.jsx
import { useEffect, useState } from 'react';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/jobs')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setJobs(data);
        setFilteredJobs(data);
      });
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job?.skills?.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
    );
    setFilteredJobs(filtered);
  }, [skillFilter, jobs]);

  return (
    <div className="bg-gray-950 text-gray-300 lg:ml-40  pt- min-h-screen">
      <div className="container mx-auto pb-7">
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Find Jobs</h1>
        
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-5">
          {
            filteredJobs?.map((job) => (
              <div className="card bg-[#221236] hover:bg-gradient-to-r hover:from-[#8b24dd] hover:to-[#ac3cc9] shadow-xl" key={job?._id}>
                <div className="card-body items-center text-center ">
                  <h2 className="card-title text-2xl">{job?.job_title}</h2>
                  <p>Company: <b>{job.company_name}</b></p>
                  <h3 className='text-lg'>Skills: <b>{job?.skills?.join(', ')}</b></h3>
                  <section className='flex justify-between flex-row w-full'>
                    <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white" onClick={() => document.getElementById(`modal${job.email}`).showModal()}>See Details</button>
                    <dialog id={`modal${job.email}`} className="modal">
                      <div className="modal-box w-11/12 max-w-5xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-black">
                        <h3 className="font-bold text-lg text-white">{job.Job_title}</h3>
                        <div className="text-base text-white">
                          <h4>Company: {job.company_name}</h4>
                          <h4>Job Description: {job.job_description}</h4>
                          <h4>Skills: {job?.skills?.join(', ')}</h4>
                          <h4>Job Requirements: {job?.job_requirements?.join(', ')}</h4>
                          <h4>Deadline: {job.deadline}</h4>
                          <h4>E-mail: <a href={`mailto:${job.email}`}>{job.email}</a></h4>
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn btn-ghost bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-white font-bold hover:text-white">Close</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                    <div className="card-actions">
                      <button className="btn btn-ghost bg-gradient-to-r from-[#e9aafd] to-[#b4abfd] hover:bg-gradient-to-r hover:from-[#c141f8] hover:to-[#5b55fd] text-[#462a5f] font-bold hover:text-white"><a href={`mailto:${job.email}`}>Contact</a></button>
                    </div>
                  </section>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
