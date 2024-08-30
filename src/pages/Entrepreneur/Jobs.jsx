import { useState, useRef, useContext } from 'react';
import { useQuery, useMutation } from 'react-query';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast, { Toaster } from 'react-hot-toast';
import { FaTrashAlt } from 'react-icons/fa';
import { AuthContext } from '../../auth/AuthProvider';

const Jobs = () => {
  const {user} = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  // Create a reference to the form
  const formRef = useRef();

  const [jobData, setJobData] = useState({
    job_title: '',
    job_description: '',
    job_requirements: [],
    skills: [],
    company_name: '',
    deadline: ''
  });

  const { data: jobs, isLoading, refetch } = useQuery('jobs', async () => {
    const response = await axiosPublic.get(`/jobs/${user?.email}`);
    return response.data;
  });

  const delMutation = useMutation(
    (jobId) => axiosPublic.delete(`/jobs/${jobId}`),
    {
      onSuccess: () => {
        refetch();
        toast('Job Deleted Successfully');
      },
      onError: () => {
        toast.error('Error Deleting Job');
      }
    }
  );

  const handleDelete = (jobId) => {
    delMutation.mutate(jobId);
  };

  const mutation = useMutation(
    (newJob) => axiosPublic.post(`/job/new/${user?.email}`, newJob),
    {
      onSuccess: () => {
        refetch();
        toast('Job Posted Successfully');
        formRef.current.reset(); // Clear the form after successful submission
        setJobData({
          job_title: '',
          job_description: '',
          job_requirements: [],
          skills: [],
          company_name: '',
          deadline: ''
        });
      },
      onError: () => {
        toast.error('Error Posting Job');
      }
    }
  );

  const handleSubmit = (e) => {
    
    e.preventDefault();
    mutation.mutate(jobData);
  };

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] lg:ml-40 bg-gray-950 text-gray-300">
      <Toaster position='top-right' />
      <div className="container mx-auto pb-7">
        <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>Post a Job</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-gray-400">Job Title</label>
            <input
              type="text"
              name="job_title"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, job_title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Job Description</label>
            <textarea
              name="job_description"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, job_description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Job Requirements</label>
            <textarea
              name="job_requirements"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, job_requirements: e.target.value.split('\n') })}
              placeholder="Enter each requirement on a new line"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Skills</label>
            <input
              type="text"
              name="skills"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
              placeholder="Enter skills separated by commas"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Company Name</label>
            <input
              type="text"
              name="company_name"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, company_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              className="w-full bg-gray-700 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              onChange={(e) => setJobData({ ...jobData, deadline: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Post Job
          </button>
        </form>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h1 className='text-center text-4xl font-bold text-[#d4a1e9] py-7'>My Job Postings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs?.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg relative"
                >
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">
                    {job.job_title}
                  </h3>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">Description:</span> {job.job_description}
                  </p>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">Requirements:</span> {job.job_requirements.join(', ')}
                  </p>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">Skills:</span> {job.skills.join(', ')}
                  </p>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">Company Name:</span> {job.company_name}
                  </p>
                  <p className="text-gray-200 mb-2">
                    <span className="font-semibold">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
