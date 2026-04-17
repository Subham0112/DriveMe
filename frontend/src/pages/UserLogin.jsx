import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import driveMeLogo from '../assets/img/DriveMe-Logo.png'
import { UserDataContext } from '../context/UserContext.jsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

function UserLogin({handleAlert}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const {user, setUser}=useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,
       userData, { withCredentials: true });
      if (response.status === 200) {
        setUser(response.data.user);
        navigate('/main');
        conosle.log("Login Successful");
      }
    } catch (error) {
      handleAlert({
        type: 'danger',
        title: 'Error',
        description: error.response?.data?.message || 'Login failed!'
      });
      console.log("Login Failed");
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-150 flex flex-col justify-center items-center overflow-hidden">
  <div className="absolute top-4 left-4">
    <Link
      to="/"
      className="flex items-center text-cyan-700 hover:text-cyan-900"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span className="ml-2">Home</span>
    </Link>
  </div>

  

  <div className="relative w-[100%] sm:max-w-xl sm:mx-auto md:w-[500px] lg:w-[550px] mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
    <div className="relative px-6 py-10 bg-white shadow-lg rounded-3xl sm:p-14">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          Welcome Back <span className='text-cyan-700'>User</span>
        </h2>
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400"
              placeholder="Email address"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Email address
            </label>
          </div>
          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400 pr-10"
    placeholder="Password"
  />

  <label
    htmlFor="password"
    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
    peer-placeholder-shown:top-2 peer-focus:-top-3.5
    peer-focus:text-gray-600 peer-focus:text-sm"
  >
    Password
  </label>

  {/* Eye Icon */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-0 top-2.5 text-gray-500 hover:text-cyan-600"
  >
    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  </button>
</div>


          <div className="flex items-center justify-end">
            <Link className="text-sm text-cyan-500 hover:text-cyan-400">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Link
            to="/captainlogin"
            className="w-full flex justify-center py-3 px-4 border border-cyan-900 rounded-md shadow-sm text-sm font-medium text-cyan-900 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300"
          >
            Login as Rider
          </Link>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/usersignup" className="text-sm text-cyan-700 hover:text-cyan-400 font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default UserLogin;
