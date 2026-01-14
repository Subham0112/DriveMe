import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      withCredentials: true, 
    })
    .then((res) => {
      console.log("Logout Successful:", res.data);
      localStorage.removeItem("userToken");
      navigate("/login");
    })
    .catch((error) => {
      console.error("Logout Error:", error.response?.data || error.message);
    });
  }, []);

  return null;
};

export default UserLogout;
