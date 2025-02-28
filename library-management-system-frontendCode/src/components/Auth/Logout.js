import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/Authservice"; 

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
