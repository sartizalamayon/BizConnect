import { useEffect, useState, useContext } from "react";
import { useMutation } from "react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Toaster } from 'react-hot-toast';
import { AuthContext } from "../../auth/AuthProvider";
import { FaSpinner } from 'react-icons/fa'; 
import { RiRepeatLine } from "react-icons/ri";

const Guide = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [courseSuggestions, setCourseSuggestions] = useState(null);

  // Mutation to post student email
  const { mutate: postEmail, isLoading: isPosting } = useMutation(
    async (email, regan = false) => {
      const response = await axiosPublic.post(`/ai/${email}`, { regan: regan });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setCourseSuggestions(data);
        // Save the data to localStorage
        localStorage.setItem('courseSuggestions', JSON.stringify(data));
      },
      onError: (error) => {
        console.error("Error generating course suggestions:", error);
      },
    }
  );

  const handleRegen = ()=>{
    setCourseSuggestions(null)
    postEmail(user.email, true);
  }

  useEffect(() => {
    // Check if there are course suggestions in localStorage
    const storedSuggestions = localStorage.getItem('courseSuggestions');
    
    if (storedSuggestions) {
      // Parse and set the stored suggestions
      setCourseSuggestions(JSON.parse(storedSuggestions));
    } else if (user?.email) {
      // If not in localStorage, fetch new suggestions
      postEmail(user.email);
    }
  }, [user?.email, postEmail]);

  // Loading states
  if (isPosting && !courseSuggestions) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <FaSpinner className="text-6xl text-gray-300 animate-spin" />
        <p className="text-xl text-gray-300 ml-4">Please wait while the AI is generating suggestions for you...</p>
      </div>
    );
  }

  return (
    <div className="relative p-4 min-h-[calc(100vh-4rem)] lg:ml-40 bg-gray-950 text-gray-300">
      <Toaster position="top-right" />
      <button className="text-white border border-white absolute right-2 p-2 top-12 hover:bg-[#d4a1e9]" onClick={handleRegen}>
        <p className="flex justify-center items-center gap-1"><RiRepeatLine className="text-xl"/>Regenerate</p>
      </button>
      <div className="container mx-auto pb-7">
        <h1 className="text-center text-4xl font-bold text-[#d4a1e9] py-7">AI Guide</h1>

        {/* Display course suggestions */}
        {courseSuggestions && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Suggestions for You</h2>
            <div className="flex flex-col space-y-6">
              <Card title="Suggested Skills" content={courseSuggestions.suggestedSkills} />
              <Card title="Suggested Courses" content={courseSuggestions.suggestedCourses} />
              <Card title="Career Path" content={courseSuggestions.careerPath} />
              <Card title="Career Roadmap" content={courseSuggestions.careerRoadmap} />
              <Card title="Skills Roadmap" content={courseSuggestions.skillsRoadmap} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Card Component for better reusability and cleaner design
const Card = ({ title, content }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-[#d4a1e9] mb-2">{title}</h3>
      <p className="text-gray-200 leading-7 text-md">{content}</p>
    </div>
  );
};


export default Guide;
