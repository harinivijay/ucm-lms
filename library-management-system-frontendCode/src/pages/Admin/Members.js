import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [librarians, setLibrarians] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users and librarians data
  useEffect(() => {
    fetchUsersAndLibrarians();
  }, []);

  const fetchUsersAndLibrarians = async () => {
    try {
      const usersResponse = await axios.get(`http://localhost:8080/lms/members/users`); // API to fetch users
      const librariansResponse = await axios.get(`http://localhost:8080/lms/members/librarians`); // API to fetch librarians
      setUsers(usersResponse.data);
      setLibrarians(librariansResponse.data);
    } catch (error) {
      console.error('Error fetching members data:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/lms/members/${userId}`);
      fetchUsersAndLibrarians();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle delete librarian
  const handleDeleteLibrarian = async (librarianId) => {
    try {
      await axios.delete(`http://localhost:8080/lms/members/librarian/${librarianId}`);
      fetchUsersAndLibrarians();
    } catch (error) {
      console.error('Error deleting librarian:', error);
    }
  };

  // Show user details in modal
  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/lms/members/details/user/${userId}`);
      setSelectedUser(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

    // Show user details in modal
    const handleLibrarianClick = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8080/lms/members/details/librarian/${userId}`);
        setSelectedUser(response.data);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Username</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleUserClick(user.username)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {user.username}
                    </button>
                  </td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Librarians</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Username</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {librarians.map(librarian => (
                <tr key={librarian._id} className="border-b">
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleLibrarianClick(librarian.username)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {librarian.username}
                    </button>
                  </td>
                  <td className="py-2 px-4">{librarian.email}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteLibrarian(librarian.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for user details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Details</h2>
            <div className="space-y-4">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>First Name:</strong> {selectedUser.firstName}</p>
              <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>City:</strong> {selectedUser.city}</p>
              <p><strong>State:</strong> {selectedUser.state}</p>
              <p><strong>Postal Code:</strong> {selectedUser.postalCode}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
