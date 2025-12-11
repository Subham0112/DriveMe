import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
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


const App = () => {
  return (
<div>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<InfoPage />} />
    <Route path="/main" element={
    
      <UserProtectAuth>
        <MainPage />
      </UserProtectAuth>
   
      } />
    <Route path="/captainmain" element={
      <CaptainProtectAuth>
        <CaptainMainPage />
      </CaptainProtectAuth>
    } />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/captainlogin" element={<CaptainLogin />} />
    <Route path="/captainsignup" element={<CaptainSignup />} />
    <Route path="/usersignup" element={<UserSignup />} />
    <Route path="/user/logout" element={
      <UserProtectAuth>
      <LogoutPage />
      </UserProtectAuth>} />
  </Routes>

</div>
  )
}

export default App
