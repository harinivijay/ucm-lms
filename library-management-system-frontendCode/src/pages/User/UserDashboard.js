import React,{ useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css"; // Your combined CSS file
import { FaUser, FaBook, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';

const UserDashboard = () => {
  const username = localStorage.getItem("username"); // Get username from storage
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear username
    window.location.href = "/login"; // Redirect to login
  };

  return (
        <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white border border-gray-600 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <FaBars
            className="cursor-pointer text-xl"
            onClick={toggleSidebar}
          />
        </div>

        {/* Menu Items */}
        <div className="mt-10">
          {/* Welcome */}
          <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
            <FaUser size={20} />
            {!isCollapsed && <span className="ml-4">Hello, {username}</span>}
          </div>

          <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/user/userBookList')}
          >
            <FaBook size={20} />
            {!isCollapsed && <span className="ml-4">Home</span>}
          </div>

          <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/user/bookingList')}
          >
            <FaClipboardList size={20} />
            {!isCollapsed && <span className="ml-4">My Bookings</span>}
          </div>

            <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/user/reservationList')}
          >
            <FaClipboardList size={20} />
            {!isCollapsed && <span className="ml-4">My Reservations</span>}
          </div>


          {/* Logout */}
          <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            {!isCollapsed && <span className="ml-4">Logout</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow ">

               <Outlet />
         
      </main>
    </div>
  );
     
};

export default UserDashboard;
