import { useNavigate, useParams } from "react-router-dom";
import logo from "../../public/logo/BizConnect.png";
import { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import PropTypes from "prop-types";
import { MdError } from "react-icons/md";
import CreatableSelect from 'react-select/creatable';
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../auth/AuthProvider";
import useUser from "../hooks/useUser";
import useEntrepreneur from "../hooks/useEntrepreneur";
import useInvestor from "../hooks/useInvestor";
import useStudent from "../hooks/useStudent";
const Info = () => {
  const { role } = useParams();
  const { user, editing, setEditing } = useContext(AuthContext);
  const arr = ["initial", "common-part", "uncommon-part", "final"];
  const [current, setCurrent] = useState(editing? arr[1]: arr[0]);
  const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate()

    const [data, setData] = useState([]) //common data
    const [userData, commonRefetch] = useUser()
    
    useEffect(()=>{
      setData(userData)
    },[userData, user])


    const [uData, setUData] = useState({})
    // Todo: get data, uData here
    const [entre, entreRefetch] = useEntrepreneur()
    const [investor, investorRefetch] = useInvestor()
    const [student, studentRefetch] = useStudent()

    useEffect(()=>{
      if(role==='student'){
        setUData(student)
    }
    if(role==='investor'){
      setUData(investor)
    }
    if(role==='entrepreneur'){
      setUData(entre)
    }
    },[entre,investor,student, user, role, ])


    

    const [postError, setPostError] = useState(false);
  //form datas
  const [commonData, setCommonData] = useState({
    birth_year: data?.birth_year? data.birth_year : "",
    birth_day: data?.birth_day ? data.birth_day : "",
    birth_month: data?.birth_month ? data.birth_month : "",
    linkedin: data?.linkedin ? data.linkedin : "",
    website: data?.website ? data.website : "",
    gender: data?.gender ? data.gender :"male",
  });

  const [studentData, setStudentData] = useState({
    major: uData?.major ? uData?.major : "",
    graduation_year: uData?.graduation_year ? uData?.graduation_year :  "",
    introduction: uData?.introduction ? uData?.introduction :  "",
    skills: uData?.skills ? uData?.skills :  [],
    interested_fields: uData?.interested_fields ? uData?.interested_fields :  [],
    experience: uData?.experience ? uData?.experience :  "",
    current_employment_status: uData?.current_employment_status ? uData?.current_employment_status :  false, //true or false
    highest_education_degree: uData?.highest_education_degree ? uData?.highest_education_degree :  "undergrad", //ssc, hsc, undergrad
    last_result: uData?.last_result ? uData?.last_result :  0, //out of 4 float
    open_for_employment: uData?.open_for_employment ? uData?.open_for_employment :  true, //true or false
  });
  console.log(studentData)

  const [investorData, setInvestorData] = useState({
    interested_fields: uData?.interested_fields ? uData.interested_fields : [],
    skills: uData?.skills ? uData.skills : [],
    experience: uData?.experience ? uData.experience : "",
    introduction: uData?.introduction ? uData.introduction : "",
    total_investments: uData?.total_investments ? uData.total_investments : 0,
    company_names: uData?.company_names ? uData.company_names : [],
    open_for_investments: uData?.open_for_investments ? uData.open_for_investments : true,
    open_for_mentorship: uData?.open_for_mentorship ? uData.open_for_mentorship : true,
  });

  

    const [entrepreneurData, setEntrepreneurData] = useState({
    industry: uData?.industry ? uData.industry :  "",
    introduction: uData?.introduction ? uData.introduction :  "",
    current_employment_status: uData?.current_employment_status ? uData.current_employment_status :  false,
    job_title: uData?.job_title ? uData.job_title :  "",
    skills:  uData?.skills ? uData.skills : [],
    interested_fields: uData?.interested_fields ? uData.interested_fields :  [],
    experience: uData?.experience ? uData.experience :  "",
    total_fund_raised: uData?.total_fund_raised ? uData.total_fund_raised :  0,
    company_names: uData?.company_names ? uData.company_names :  [],
    open_for_partnership: uData?.open_for_partnership ? uData.open_for_partnership :  true,
    });  

    const handleNavigation = ()=>{
        if(role==='student'){
            navigate('/student')
        }
        if(role==='investor'){
            navigate('/investor')
        }
        if(role==='entrepreneur'){
            navigate('/entrepreneur')
        }
    }

    const handleCommonSubmit = async() => {
        setLoading(true);
        await axiosPublic.patch(`/users/${user?.email}`, {
            birth_year: parseInt(commonData.birth_year),
            birth_day: parseInt(commonData.birth_day),
            birth_month: parseInt(commonData.birth_month),
            linkedin: commonData.linkedin,
            website: commonData.website,
            gender: commonData.gender
        })
        .then(()=>{
          setEditing(true)
          commonRefetch()
        })
        .catch(() => {
            setPostError(true);
            setLoading(false)
        })
    }

    const hanldeSudentSubmit = async() => {
        await axiosPublic.post(`/students`, {
            email: user?.email,
            major: studentData.major,
            graduation_year: studentData.graduation_year,
            introduction: studentData.introduction,
            skills: studentData.skills,
            interested_fields: studentData.interested_fields,
            experience: studentData.experience,
            current_employment_status: studentData.current_employment_status,
            highest_education_degree: studentData.highest_education_degree,
            last_result: studentData.last_result,
            open_for_employment: studentData.open_for_employment,
            date: new Date().toISOString()
        })
        .then(()=>{
          setEditing(true)
          studentRefetch()
        })
        .catch(()=>{
            setPostError(true);
        })
        setLoading(false)
    }

    const hanldeInvestorSubmit = async() => {
        await axiosPublic.post(`/investors`, {
            email: user?.email,
            interested_fields: investorData.interested_fields,
            skills: investorData.skills,
            experience: investorData.experience,
            introduction: investorData.introduction,
            total_investments: investorData.total_investments,
            company_names: investorData.company_names,
            open_for_investments: investorData.open_for_investments,
            open_for_mentorship: investorData.open_for_mentorship,
            date: new Date().toISOString()
        })
        .then(()=>{
          setEditing(true)
          investorRefetch()
        })
        .catch(()=>{
            setPostError(true);
        })
        setLoading(false)
    }

    const hanldeEntrepreneurSubmit = async() => {
        await axiosPublic.post(`/entrepreneurs`, {
            email: user?.email,
            industry: entrepreneurData.industry,
            introduction: entrepreneurData.introduction,
            current_employment_status: entrepreneurData.current_employment_status,
            job_title: entrepreneurData.job_title,
            skills: entrepreneurData.skills,
            interested_fields: entrepreneurData.interested_fields,
            experience: entrepreneurData.experience,
            total_fund_raised: entrepreneurData.total_fund_raised,
            company_names: entrepreneurData.company_names,
            open_for_partnership: entrepreneurData.open_for_partnership,
            date: new Date().toISOString()
        })
        .catch(()=>{
            setPostError(true);
            entreRefetch()
        })
        setLoading(false)
    }    

    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-gray-900 p-8 my-7 rounded-lg shadow-md w-full max-w-xl">
        <img src={logo} alt="Website Logo" className="h-16 mb-4 mx-auto" />
        {/* Logo */}

        {current === "initial" && (
          <div className="w-full max-w-xl">
            <h2 className="text-xl font-thin mb-4 text-center text-gray-300">
              Welcome.
              <br />
              <br />
              We are glad to hear that you are {role === "student"
                ? "a"
                : "an"}{" "}
              {role}.<br />
              We have plenty lot to explore. <br />
              <br />
              <span className="text-2xl">
                <span className="font-medium">Tell us more about you</span> to
                get the best of this website
              </span>
            </h2>
            <button
              className="w-full flex justify-center items-center text-4xl text-white hover:translate-y-1"
              onClick={() => setCurrent(arr[1])}
            >
              <FaArrowRightLong />
            </button>
          </div>
        )}

        {current === "common-part" && (
          <div className="w-full max-w-xl">
            <div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-400">
                  When Ware you Born?
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full bg-gray-800 p-2  border rounded focus:outline-none focus:border-purple-500 text-white"
                  required
                  defaultValue={`${commonData.birth_year}-${commonData.birth_month}-${commonData.birth_day}`}
                  onChange={(e) => {
                    const [year, month, date] = e.target.value.split("-");

                    setCommonData({
                      ...commonData,
                      birth_year: parseInt(year),
                      birth_day: date,
                      birth_month: month,
                    });
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-400">
                  Your Linkdin Url
                </label>
                <input
                  type="text"
                  name="linkdin"
                  className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                  defaultValue={commonData.linkedin}
                  required
                  onChange={(e) =>
                    setCommonData({ ...commonData, linkedin: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-400">
                  Your Personal Website (optional)
                </label>
                <input
                  type="text"
                  name="linkdin"
                  className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                  defaultValue={commonData.website}
                  onChange={(e) =>
                    setCommonData({ ...commonData, website: e.target.value })
                  }
                />
              </div>
                <div className="mb-4">
                <label className="block mb-2 text-gray-400">
                    Gender
                </label>
                <select
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setCommonData({...commonData, gender: e.target.value})}
                defaultValue={commonData.gender}
                >
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
                <option value={"other"}>Other</option>
                </select>

                </div>
              {error && <p className="text-red-500 w-full text-center font-thin flex justify-center items-center gap-2">{error}<MdError />
              </p>}
              <div className="flex flex-row justify-between items-center mt-6">
                {editing || <button
                  className=" flex justify-center items-center text-4xl text-white hover:translate-y-1"
                  onClick={() => setCurrent(arr[0])}
                >
                  <FaArrowLeftLong />
                </button>}
                <button
                  className=" flex justify-center items-center text-4xl text-white hover:translate-y-1"
                  onClick={() => {
                    if(commonData.birth_year && commonData.linkedin){
                        setError(null)
                      setCurrent(arr[2])
                    }
                    else{
                      setError("Please fill all the fields")
                    }
                }}
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          </div>
        )}

        {current === "uncommon-part" && (
          <div className="w-full max-w-xl">
            <div>
              {role === "student" && <StudentForm studentData={studentData} setStudentData={setStudentData}/>}
                {role === "investor" && <InvestorForm investorData={investorData} setInvestorData={setInvestorData}/>}
                {role === "entrepreneur" && <EntrepreneurForm entrepreneurData={entrepreneurData} setEntrepreneurData={setEntrepreneurData} />}
                {error && <p className="text-red-500 w-full text-center font-thin flex justify-center items-center gap-2">{error}<MdError /></p>}
              <div className="flex flex-row justify-between items-center mt-6 gap-28">
                <button
                  className=" flex justify-center items-center text-4xl text-white hover:translate-y-1"
                  onClick={() => setCurrent(arr[1])}
                >
                  <FaArrowLeftLong />
                </button>
                <button
                  className=" flex justify-center items-center text-4xl text-white hover:translate-y-1"
                  onClick={() =>{
                    if(role === "student" && studentData.major && studentData.graduation_year && studentData.introduction && studentData.skills.length>0 && studentData.interested_fields.length>0 &&  studentData.highest_education_degree && studentData.last_result){
                        setError(null)
                        setCurrent(arr[3])
                        handleCommonSubmit();
                        if (!postError){
                            hanldeSudentSubmit();
                        }
                        
                    }
                    else if(role === "investor" && investorData.interested_fields.length>0 && investorData.skills.length>0 && investorData.introduction && investorData.company_names.length>0){
                        setError(null)
                      setCurrent(arr[3])
                      handleCommonSubmit();
                      if (!postError){
                        hanldeInvestorSubmit();
                    }
                        
                    }
                    else if(role === "entrepreneur" && entrepreneurData.industry && entrepreneurData.introduction && entrepreneurData.skills.length>0 && entrepreneurData.interested_fields.length>0){
                        setError(null)
                      setCurrent(arr[3])
                      handleCommonSubmit();
                      if (!postError){
                        hanldeEntrepreneurSubmit();
                    }
                        
                    }
                    else{
                      setError("Please fill all the fields")
                    } }}
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          </div>
        )}


{current === "final" && (
          <div className="w-full max-w-xl">
            <div>
            <h2 className="text-xl font-thin mb-4 text-center text-gray-300">
              {postError?<span className="text-2xl font-medium text-red-500">Error Saving Data</span>:"Thanks for the valuable info."}
              <br />
              {postError?"Please try again":"It will help us personalize your experience."}
              <br />
              <br />
              {postError? <span className="text-2xl font-medium">Resubmit the form</span>
                : <span className="text-2xl font-medium">Go to Dashboard</span>}
               </h2>
            
            {postError? <button className="w-full flex justify-center items-center text-4xl text-white hover:translate-y-1" onClick={()=>{
                    setPostError(false)
                    setCurrent(arr[2])
                }}>
                    <FaArrowLeftLong /></button>: <button
                  className="w-full flex justify-center items-center text-4xl text-white hover:translate-y-1"
                  onClick={()=>handleNavigation()}
                >
                    {loading ? <span className="loading loading-ball loading-lg"></span> :  <FaArrowRightLong />}
                </button>}
                
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;

const skillOptions = [
    { value: 'react', label: 'react'},
    { value: 'vue', label: 'vue'},
    { value: 'angular', label: 'angular'},
    { value: 'vscode', label: 'vscode'},
    { value: 'tailwind', label: 'tailwind'},
    { value: 'bootstrap', label: 'bootstrap'},
    { value: 'material-ui', label: 'material-ui'},
    { value: 'chakra-ui', label: 'chakra-ui'},
    { value: 'redux', label: 'redux'},
    { value: 'context-api', label: 'context-api'},
    { value: 'nextjs', label: 'nextjs'},
    { value: 'gatsby', label: 'gatsby'},
    { value: 'nodejs', label: 'nodejs'},
    { value: 'express', label: 'express'},
    { value: 'flask', label: 'flask'},
    { value: 'django', label: 'django'},
    { value: 'laravel', label: 'laravel'},
    { value: 'spring', label: 'spring'},
    { value: 'rails', label: 'rails'},
  ];
const fieldOptions = [
    { value: 'web development', label: 'web development'},
    { value: 'app development', label: 'app development'},
    { value: 'game development', label: 'game development'},
    { value: 'ui/ux', label: 'ui/ux'},
    { value: 'data science', label: 'data science'},
    { value: 'machine learning', label: 'machine learning'},
    { value: 'artificial intelligence', label: 'artificial intelligence'},
    { value: 'cyber security', label: 'cyber security'},
    { value: 'networking', label: 'networking'},
    { value: 'cloud computing', label: 'cloud computing'},
    { value: 'devops', label: 'devops'},
    ];


const StudentForm = ({studentData, setStudentData}) => {
    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Major</label>
                <input
                type="text"
                name='major'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, major: e.target.value})}
                defaultValue={studentData.major}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Graduation Year (or Expected) </label>
                <input
                type="number"
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, graduation_year: parseInt(e.target.value)})}
                defaultValue={studentData.graduation_year}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Introduction</label>
                <textarea
                name='introduction'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, introduction: e.target.value})}
                defaultValue={studentData.introduction}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Skills</label>
                <CreatableSelect isMulti options={skillOptions} defaultValue={studentData.skills.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setStudentData({...studentData, skills: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Interested Fields</label>
                <CreatableSelect isMulti options={fieldOptions} defaultValue={studentData.interested_fields.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setStudentData({...studentData, interested_fields: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Experience(Optional)</label>
                <input
                type="text"
                name='experience'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, experience: e.target.value})}
                defaultValue={studentData.experience}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Current Employment Status</label>
                <select
                name='current_employment_status'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => 
                    setStudentData({...studentData, current_employment_status: !studentData.current_employment_status})}
                defaultValue={studentData.current_employment_status}
                >
                <option value={true}>Employed</option>
                <option value={false}>Unemployed</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Highest Education Degree</label>
                <select
                name='highest_education_degree'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, highest_education_degree: e.target.value})}
                defaultValue={studentData.highest_education_degree}
                >
                <option value='ssc'>SSC</option>
                <option value='hsc'>HSC</option>
                <option value='undergrad'>Undergrad</option>
                <option value='msc'>Msc</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Last Result</label>
                <input
                type="number"
                name='last_result'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setStudentData({...studentData, last_result: parseFloat(e.target.value)})}
                defaultValue={studentData.last_result}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Open for Employment</label>
                <select
                name='open_for_employment'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => setStudentData({...studentData, open_for_employment: !studentData.open_for_employment})}
                defaultValue={studentData.open_for_employment}
                >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
                </select>
            </div>

            
        </div>
    )
}

StudentForm.propTypes = {
    studentData: PropTypes.object,
    setStudentData: PropTypes.func,
};

const InvestorForm = ({investorData, setInvestorData}) => {
    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Introduction</label>
                <textarea
                name='introduction'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                required
                onChange={(e) => setInvestorData({...investorData, introduction: e.target.value})}
                defaultValue={investorData.introduction}
                />
            </div>
            <div className="mb-4"> 
                <label className="block mb-2 text-gray-400">Skills</label>
                <CreatableSelect isMulti options={skillOptions} defaultValue={investorData.skills.map((val)=> {
                    return {"value": val, "label":val}
                })} onChange={(e) => setInvestorData({...investorData, skills: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Interested Fields</label>
                <CreatableSelect isMulti options={fieldOptions} defaultValue={investorData.interested_fields.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setInvestorData({...investorData, interested_fields: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Experience(Optional)</label>
                <input
                type="text"
                name='experience'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                defaultValue={investorData.experience}
                onChange={(e) => setInvestorData({...investorData, experience: e.target.value})}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Company Names(Optional)</label>
                <CreatableSelect isMulti defaultValue={investorData.company_names.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setInvestorData({...investorData, company_names: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Open for Investments</label>
                <select
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => setInvestorData({...investorData, open_for_investments: !investorData.open_for_investments})}
                defaultValue={investorData.open_for_investments}
                >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Open for Mentorship</label>
                <select
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => setInvestorData({...investorData, open_for_mentorship: !investorData.open_for_mentorship})}
                defaultValue={investorData.open_for_mentorship}
                >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
                </select>
            </div>
        </div>
    )
}

InvestorForm.propTypes = {
    investorData: PropTypes.object,
    setInvestorData: PropTypes.func,
};



const EntrepreneurForm = ({entrepreneurData,setEntrepreneurData}) => {
    return (
        <div>
            <div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Industry</label>
                <input
                type="text"
                name='industry'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setEntrepreneurData({...entrepreneurData, industry: e.target.value})}
                defaultValue={entrepreneurData.industry}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Introduction</label>
                <textarea
                name='introduction'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                required
                onChange={(e) => setEntrepreneurData({...entrepreneurData, introduction: e.target.value})}
                defaultValue={entrepreneurData.introduction}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Current Employment Status</label>
                <select
                name='current_employment_status'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => 
                    setEntrepreneurData({...entrepreneurData, current_employment_status: !entrepreneurData.current_employment_status})}
                defaultValue={entrepreneurData.current_employment_status}
                >
                <option value={true}>Employed</option>
                <option value={false}>Unemployed</option>
                </select>
            </div>
            {
                entrepreneurData.current_employment_status && <div className="mb-4">
                <label className="block mb-2 text-gray-400">Job Title</label>
                <input
                type="text"
                name='job_title'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={(e) => setEntrepreneurData({...entrepreneurData, job_title: e.target.value})}
                defaultValue={entrepreneurData.job_title}
                />
            </div>
            }
            <div className="mb-4"> 
                <label className="block mb-2 text-gray-400">Skills</label>
                <CreatableSelect isMulti options={skillOptions} defaultValue={entrepreneurData.skills.map((val)=> {
                    return {"value": val, "label":val}
                })} onChange={(e) => setEntrepreneurData({...entrepreneurData, skills: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Interested Fields</label>
                <CreatableSelect isMulti options={fieldOptions} defaultValue={entrepreneurData.interested_fields.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setEntrepreneurData({...entrepreneurData, interested_fields: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Experience(Optional)</label>
                <input
                type="text"
                name='experience'
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                defaultValue={entrepreneurData.experience}
                onChange={(e) => setEntrepreneurData({...entrepreneurData, experience: e.target.value})}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Company Names(Optional)</label>
                <CreatableSelect isMulti defaultValue={entrepreneurData.company_names.map((val)=>{
                    return {"value": val, "label":val}
                })} onChange={(e) => setEntrepreneurData({...entrepreneurData, company_names: e.map((item) => item.value)})}/>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-400">Open for Partnership</label>
                <select
                className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
                onChange={() => setEntrepreneurData({...entrepreneurData, open_for_partnership: !entrepreneurData.open_for_partnership})}
                defaultValue={entrepreneurData.open_for_partnership}
                >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
                </select>
            </div>
            </div>
        </div>
    )
}

EntrepreneurForm.propTypes = {
    entrepreneurData: PropTypes.object,
    setEntrepreneurData: PropTypes.func,
  };