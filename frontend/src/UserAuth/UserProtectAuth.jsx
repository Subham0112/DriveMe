import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserDataContext } from '../context/UserContext.jsx';

const UserProtectAuth = ({children}) => {
  const token = localStorage.getItem('userToken');
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('/login');
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

export default UserProtectAuth