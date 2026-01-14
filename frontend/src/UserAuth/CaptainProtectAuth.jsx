import React from 'react'
import { useNavigate } from 'react-router-dom';
import {useState, useEffect } from 'react';
import axios from 'axios';

const CaptainProtectAuth = ({children}) => {
  const navigate = useNavigate();
 const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      withCredentials: true
    })
    .then(() => {
      setLoading(false);
    })
    .catch(() => {
      navigate('/captainlogin');
    })
  }, []);

  if (loading) 
    return null;

  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectAuth