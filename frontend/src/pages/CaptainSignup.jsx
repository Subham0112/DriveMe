import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainSignup = () => {
  const [step, setStep] = useState(1);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState({
    color: '',
    plate: '',
    capacity: '',
    vehicleType: 'car'
  });
const navigate = useNavigate();
  // const {captain, setCaptain} = useContext(CaptainDataContext);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname
      },
      email: email,
      password: password,
      phone: phone,
      vehicle: vehicle
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
      if(response.status === 201){
        console.log('Captain registered successfully:', response.data);
        // setCaptain(response.data.captain);
        navigate('/captainlogin');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
    
    console.log('Signup data:', captainData);
    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
    setPhone('');
    setVehicle({
      color: '',
      plate: '',
      capacity: '',
      vehicleType: 'car'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-3 flex flex-col justify-center sm:py-10">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center text-orange-700 hover:text-orange-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="ml-2">Home</span>
        </Link>
      </div>

      <div className="relative py-3 w-[100%] sm:max-w-xl sm:mx-auto md:w-[500px] lg:w-[550px] mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-5 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-3 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold text-center mb-4">
                  Become a <span className='text-orange-500'>Rider</span>
                </h2>

                {/* Progress Bar */}
                  <div className="mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Personal Info</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  step >= 2 ? 'bg-orange-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="text-xs mt-2 text-gray-600">Vehicle Info</span>
                </div>
              </div>
            </div>

                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <form onSubmit={handleNext} className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-orange-500">Personal Information</h3>
                      
                      <div className="relative">
                        <input
                          type="text"
                          name="firstname"
                          id="firstname"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                          onChange={(e) => setLastname(e.target.value)}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                          onChange={(e) => setEmail(e.target.value)}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                          onChange={(e) => setPassword(e.target.value)}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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
                          onChange={(e) => setPhone(e.target.value)}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
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

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Vehicle Information */}
                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-orange-500">Vehicle Information</h3>
                      
                      <div className="relative">
                        <input
                          type="text"
                          name="vehicle.color"
                          id="vehicle.color"
                          value={vehicle.color}
                          onChange={(e) => setVehicle({...vehicle, color: e.target.value})}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
                          placeholder="Vehicle Color"
                          required
                          minLength={3}
                        />
                        <label
                          htmlFor="vehicle.color"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Vehicle Color
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="vehicle.plate"
                          id="vehicle.plate"
                          value={vehicle.plate}
                          onChange={(e) => setVehicle({...vehicle, plate: e.target.value})}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
                          placeholder="Plate Number"
                          required
                          minLength={4}
                        />
                        <label
                          htmlFor="vehicle.plate"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Plate Number
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          name="vehicle.capacity"
                          id="vehicle.capacity"
                          value={vehicle.capacity}
                          onChange={(e) => setVehicle({...vehicle, capacity: e.target.value})}
                          className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-orange-400"
                          placeholder="Capacity"
                          required
                          min="1"
                        />
                        <label
                          htmlFor="vehicle.capacity"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Capacity (persons)
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="vehicle.vehicleType"
                          id="vehicle.vehicleType"
                          value={vehicle.vehicleType}
                          onChange={(e) => setVehicle({...vehicle, vehicleType: e.target.value})}
                          className="w-full h-10 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-orange-400 bg-white"
                          required
                        >
                          <option value="car">Car</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="scooter">Scooter</option>
                          <option value="auto-rickshaw">Auto Rickshaw</option>
                        </select>
                        <label
                          htmlFor="vehicle.vehicleType"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm"
                        >
                          Vehicle Type
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 flex justify-center py-3 px-4 border border-orange-400 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-colors"
                      >
                        Sign up as Rider
                      </button>
                    </div>
                  </form>
                )}

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