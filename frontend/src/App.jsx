import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserMainPage from './pages/UserMainPage.jsx';
import CaptainMainPage from './pages/CaptainMainPage.jsx';
import UserLogin from './pages/UserLogin.jsx';
import Home from './pages/home.jsx';
import InfoPage from './pages/infoPage.jsx';
import CaptainLogin from './pages/CaptainLogin.jsx';
import CaptainSignup from './pages/CaptainSignup.jsx';
import UserSignup from './pages/UserSignup.jsx';
import LogoutPage from './pages/UserLogout.jsx';
import './App.css';
import UserProtectAuth from './UserAuth/UserProtectAuth.jsx';
import CaptainProtectAuth from './UserAuth/CaptainProtectAuth.jsx';
import CaptainLogout from './pages/CaptainLogout.jsx';
import UserRideHistory from './UserPages/UserRideHistory.jsx';
import UserProfile from './UserPages/UserProfile.jsx';
import CaptainRideHistory from './CaptainPages/CaptainRideHistory.jsx';
import CaptainProfile from './CaptainPages/CaptainProfile.jsx';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<InfoPage />} />
        
        {/* User Routes */}
        <Route path="/main" element={
          <UserProtectAuth>
            <UserMainPage/>
          </UserProtectAuth>
        } />
        <Route path="/user/ride-history" element={
          <UserProtectAuth>
            <UserRideHistory />
          </UserProtectAuth>
        } />
        <Route path="/user/profile" element={
          <UserProtectAuth>
            <UserProfile />
          </UserProtectAuth>
        } />
        <Route path="/user/logout" element={
          <UserProtectAuth>
            <LogoutPage />
          </UserProtectAuth>
        } />
        
        {/* Captain Routes */}
        <Route path="/captainmain" element={
          <CaptainProtectAuth>
            <CaptainMainPage />
          </CaptainProtectAuth>
        } />
        <Route path="/captain/ride-history" element={
          <CaptainProtectAuth>
            <CaptainRideHistory />
          </CaptainProtectAuth>
        } />
        <Route path="/captain/profile" element={
          <CaptainProtectAuth>
            <CaptainProfile />
          </CaptainProtectAuth>
        } />
        <Route path="/captain/logout" element={
          <CaptainProtectAuth>
            <CaptainLogout />
          </CaptainProtectAuth>
        } />
        
        {/* Auth Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/captainlogin" element={<CaptainLogin />} />
        <Route path="/captainsignup" element={<CaptainSignup />} />
        <Route path="/usersignup" element={<UserSignup />} />
      </Routes>
    </div>
  )
}

export default App