import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { UserDataContext } from '../context/UserContext.jsx';


const UserSignup = ({handleAlert}) => {
const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const navigate=useNavigate();

// const {user, setUser}=useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
     const newUser={
       fullname: {
         firstname: firstname,
         lastname:lastname
       },
      email:email,
      password:password
     } 
try{

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if(response.status===201){
        // setUser(response.data.user);
        // console.log(response.data.token)
        // localStorage.setItem('userToken', response.data.token);
        handleAlert({
          type: 'success',
          title: 'Success',
          description: 'User registered successfully!'
        });
        navigate('/login');
        console.log('User registered successfully:', response.data);
      }}catch(error){

        handleAlert({
          type: 'danger',
          title: 'Error',
          description: error.response?.data?.message || 'User registration failed!'
        });
      }
     console.log('Signup data:', newUser);
      setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
     
    };

  return (
<div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 py-3 flex flex-col justify-center sm:py-10">

      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center text-cyan-700 hover:text-orange-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="ml-2">Home</span>
        </Link>
      </div>



      <div className="relative py-3 w-[100%] sm:max-w-xl sm:mx-auto md:w-[500px] lg:w-[550px] mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-7 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-3 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold text-center mb-8 ">Become a <span className='text-cyan-500'>User</span></h2> 
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={firstname}
                        onChange={(e)=>{
                          setFirstname(e.target.value);
                        }}
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400"
                        placeholder="First Name"
                        required
                        minLength={3}
                      />
                      <label
                        htmlFor="firstname"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        First Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={lastname}
                        onChange={(e)=>{
                          setLastname(e.target.value);
                        }}
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400"
                        placeholder="Last Name"
                        required
                      />
                      <label
                        htmlFor="lastname"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Last Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e)=>{
                          setEmail(e.target.value);
                        }}
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400"
                        placeholder="Email address"
                        required
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
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e)=>{
                          setPassword(e.target.value);
                        }}
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-cyan-400"
                        placeholder="Password"
                        required
                        minLength={6}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                    </div>

                  
                  </div>

            
                 

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300"
                    >
                      Sign up as User
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <span className="text-sm text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
