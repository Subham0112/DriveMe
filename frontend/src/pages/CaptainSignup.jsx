import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CaptainSignup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const captainData={
      fullname: {
        firstname: firstname,
        lastname:lastname
      },
      email:email,
      password:password,
      phone:phone
    }
    // Handle signup logic here
    console.log('Signup data:', captainData);
    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold text-center mb-8 ">Become a <span className='text-orange-500'>Captain</span></h2> 
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
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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

                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e)=>{  
                          setPhone(e.target.value);
                        }}
                        className="peer h-8 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
                        placeholder="Phone Number"
                        required
                        minLength={10}
                      />
                      <label
                        htmlFor="phone"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Phone Number
                      </label>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                 

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                    >
                      Sign up as Captain
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <span className="text-sm text-gray-600">Already have an account? </span>
                  <Link to="/captainlogin" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
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

export default CaptainSignup;