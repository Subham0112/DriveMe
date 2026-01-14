import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectAuth = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      withCredentials: true
    })
    .then(() => {
      setLoading(false); // authenticated
    })
    .catch(() => {
      navigate("/login"); // not authenticated
    });
  }, []);

  if (loading) return null;

  return children;
};

export default UserProtectAuth;