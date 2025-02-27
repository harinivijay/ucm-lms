import React, { useState } from 'react';
import { FaUser, FaBook, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate, Outlet } from 'react-router-dom';

const LibrarianDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Librarian';
  const [currentTab, setCurrentTab] = useState('loanRequests');
  const [showBreadCrumb, setShowBreadCrumb] = useState(true);

  const tabs = [
    { key: 'loanRequests', label: 'Loan Requests' , path: '/librarian/loan-requests'},
    { key: 'loanedBooks', label: 'Loaned Books', path: '/librarian/loaned-books' },
    // { key: 'reservationRequests', label: 'Reservation Requests', path: '/librarian/reservation-requests' },
    // { key: 'renewalRequests', label: 'Renewal Requests', path: '/librarian/renewal-requests' },
    { key: 'cancelRequests', label: 'Cancelled Orders', path: '/librarian/cancelled-orders' },
];
const handleTabChange = (tabKey) => {
    const selectedTab = tabs.find((tab) => tab.key === tabKey);
    if (selectedTab) {
      setCurrentTab(tabKey); // Update the current tab state
      navigate(selectedTab.path); // Navigate to the corresponding page
    }
  };
  const handleLogout = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen">
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

          {/* Loan Requests */}
          <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              navigate('/librarian/loan-requests');
              setShowBreadCrumb(true);
            }}
          >
            <FaBook size={20} /> 
            {!isCollapsed && <span className="ml-4">Manage Requests</span>}
          </div>

          {/* Manage Resources */}
          <div
            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              navigate('/librarian/books');
              setShowBreadCrumb(false);
            }}
          >
            <FaClipboardList size={20} />
            {!isCollapsed && <span className="ml-4">Manage Resources</span>}
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
      <div className="flex-grow " >
            <div className={`tabs bg-gray-800 text-white flex-grow z-50 ${showBreadCrumb ? '' : 'hidden'}`}>
                {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`px-16 py-3 text-sm font-medium border-b-3 ${
                    currentTab === tab.key
                        ? 'border-blue-500 text-blue-300 bg-gray-900'
                        : 'border-transparent hover:border-gray-700 hover:bg-gray-700'
                    }`}
                    onClick={() => handleTabChange(tab.key)}
                >
                    {tab.label}
                </button>
                ))}
           </div>
           <div>
               <Outlet />
           </div>
      
        </div>
      </main>
    </div>
  );
};

export default LibrarianDashboard;
