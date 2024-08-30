import ProfilePicture from "../../components/ProfilePicture";
import { MdEmail, MdWork } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { FaIndustry, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { AiFillExperiment } from "react-icons/ai";
import useUser from "../../hooks/useUser";
import useInvestor from "../../hooks/useInvestor";

const InvestorProfile = () => {
  const [user] = useUser();
  const [investor] = useInvestor();
    return (
      <>
      <div className="p-4 min-h-[calc(100vh-4rem)] lg:ml-40 bg-gray-950 text-gray-300">
        <div className="container mx-auto pb-7">
          <h1 className="text-center text-4xl font-bold text-[#d4a1e9] py-7">
            {user?.name}'s Profile
          </h1>

          <div>
            <ProfilePicture gender={user?.gender} />
            <p className="mx-auto w-full flex justify-center items-center">
              @{user?.username}
            </p>
            <p className="mx-auto w-full flex justify-center items-center text-white">
              {investor?.introduction}
            </p>
            <p className="mx-auto w-full flex justify-center items-center text-white text-xl mt-2">
              <span className="border-white border-[1px] px-4 py-1 rounded-xl">Total Invesment: ${investor?.total_investments}</span>
            </p>
            

            {/*Contact */}
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-2xl text-[#d4a1e9] text-center mt-6">
                Contacts
              </h1>
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-white flex justify-center items-center gap-1">
                    <MdEmail /> {user?.email}
                  </p>
                  <p className="text-white flex justify-center items-center gap-1">
                    <BiPhone />
                    {user?.phone}
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-white flex justify-center items-center gap-1">
                    <FaLinkedin />{" "}
                    {user?.linkedin === "" ? "No linkedin info" : user?.linkedin}
                  </p>
                  <p className="text-white flex justify-center items-center gap-1">
                    <CgWebsite />
                    {user?.website === "" ? "No website info" : user?.website}
                  </p>
                </div>
              </div>
            </div>
            {/*Info */}
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-2xl text-[#d4a1e9] text-center mt-6">
                Info
              </h1>
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-white flex justify-center items-center gap-1">
                    <FaIndustry/> {investor?.open_for_investments ? "Open for Invesment":'Not open for Invesment'}
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-white flex justify-center items-center gap-1">
                    <MdWork/>{investor?.open_for_mentorship? `Open for mentorship` : `Not open for Mentorship`}
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-white flex justify-center items-center gap-1">
                    <AiFillExperiment/>{investor?.experience===''? `No Previous Expericence` : investor?.experience}
                  </p>
                </div>
              </div>
            </div>
            {/*Skills */}
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-2xl text-[#d4a1e9] text-center mt-6">
                Skills
              </h1>
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-4 flex-wrap max-w-[80%] mx-auto">
                  {investor?.skills?.map((skill,idx)=>{
                    return <p key={idx} className="border-gray-300 border-[1px] bg-[#221236] px-4 rounded-2xl py-2 text-white">{skill}</p>
                  })}
                </div>
              </div>
            </div>
            {/*Intersted fields */}
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-2xl text-[#d4a1e9] text-center mt-6">
                Intersted fields
              </h1>
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-4 flex-wrap max-w-[80%] mx-auto">
                  {investor?.interested_fields?.map((field,idx)=>{
                    return <p key={idx} className="border-gray-300 border-[1px] bg-[#221236] px-4 rounded-2xl py-2 text-white">{field}</p>
                  })}
                </div>
              </div>
            </div>
            {/*companies */}
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-2xl text-[#d4a1e9] text-center mt-6">
                Companies
              </h1>
              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-4 max-w-[80%] mx-auto">
                  {investor?.company_names?.map((company,idx)=>{
                    return <p key={idx} className="border-gray-300 border-[1px] bg-[#221236] px-4 rounded-2xl py-2 text-white">{company}</p>
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
    );
};

export default InvestorProfile;