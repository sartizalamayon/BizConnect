import { useContext, useState } from 'react';
import logo from '../../public/logo/BizConnect.png'; 
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {

  const{createUser,loading, setLoading} = useContext(AuthContext);
  const [error, setError] = useState(null);
  const axiosPublic = useAxiosPublic(); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const postSignup = (name, email, phone, username, role, date) => {
    axiosPublic.post('/users', {
      name, email, phone, username, role, date
    })
    .then(() => {
      setLoading(false);
      setError(null);
      
      navigate(`/info/${role}`, )
      
    })
    .catch((err) => {
      setError(err.message);
    })
  }

  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.fullName.value;
    const email = e.target.email.value;
    const phone = e.target.phoneNumber.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const role = e.target.role.value;
    const date = new Date().toISOString();

    if(password.length < 6){
      setError('Password should be at least 6 characters long');
      return;
    }


    createUser(email, password)
    .then(()=>{
      setError(null);
      console.log('User created successfully');
      postSignup(name, email, phone, username, role, date);
    })
    .catch((err) => {
      setError(err.message);
    })
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-gray-900 p-8 my-7 rounded-lg shadow-md w-full max-w-xl">
        <Link to='/'><img src={logo} alt="Website Logo" className="h-16 mb-4 mx-auto" /></Link> {/* Logo */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Full Name</label>
            <input
              type="text"
              name='fullName'
              className="w-full bg-gray-800 p-2  border rounded focus:outline-none focus:border-purple-500 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Email</label>
            <input
              type="email"
              name='email'
              className="w-full p-2 bg-gray-800 border rounded focus:outline-none focus:border-purple-500 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Phone Number</label>
            <input
              type="number"
              name='phoneNumber'
              className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Username</label>
            <input
              type="text"
              name='username'
              className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block mb-2 text-gray-400">Password</label>
            <input
              type={showPassword? "text":"password"}
              name='password'
              className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
              required
            />
            <span
                  className="absolute right-3 top-11 cursor-pointer text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
          </div>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Role</label>
            <select
              name='role'
              className="w-full bg-gray-800 p-2 border rounded focus:outline-none focus:border-purple-500 text-white"
            >
              {/* <option value={roles.ENTREPRENEUR}>Entrepreneur</option>
              <option value={roles.INVESTOR}>Investor</option>
              <option value={roles.STUDENT}>Student</option> */}
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
              <option value="student">Student</option>
            </select>
          </div>
          {/* Submit Button */}
          <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            {loading? 'Loading':'Signup'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
        <div className='w-full text-center mt-6 text-sm font-mono text-gray-500'>Alreday have an account?  
          <Link to={'/login'} className='text-gray-300 underline cursor-pointer ml-2 hover:text-purple-500'>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
