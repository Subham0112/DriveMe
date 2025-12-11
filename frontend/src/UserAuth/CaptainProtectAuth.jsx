import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserDataContext } from '../context/UserContext.jsx';

const CaptainProtectAuth = ({children}) => {
  const token = localStorage.getItem('captainToken');
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('/captainlogin');
    }
  }, [token, navigate]);

  // Don't render children if there's no token
  if(!token) {
    return null;
  }

  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectAuth