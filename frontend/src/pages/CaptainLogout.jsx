import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
      withCredentials: true, 
    })
    .then((res) => {
      console.log("Logout Successful:", res.data);
      localStorage.removeItem("captainToken"); 
      navigate("/captainlogin");
    })
    .catch((error) => {
      console.error("Logout Error:", error.response?.data || error.message);
    });
  }, []);

  return null;
};

export default CaptainLogout;
