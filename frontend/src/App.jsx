import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLogin from './pages/UserLogin.jsx';
import Home from './pages/home.jsx';
import InfoPage from './pages/infoPage.jsx';
import CaptainLogin from './pages/CaptainLogin.jsx';
import CaptainSignup from './pages/CaptainSignup.jsx';
import UserSignup from './pages/UserSignup.jsx';
import './App.css';


const App = () => {
  return (
<div>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<InfoPage />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/captainlogin" element={<CaptainLogin />} />
    <Route path="/captainsignup" element={<CaptainSignup />} />
    <Route path="/usersignup" element={<UserSignup />} />
  </Routes>

</div>
  )
}

export default App
