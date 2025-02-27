import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageBooksLoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentTab, setCurrentTab] = useState('loanRequests'); 

  const tabs = [
    { key: 'loanRequests', label: 'Loan Requests' },
    { key: 'pickupBooks', label: 'Pickup Books' },
    { key: 'loanedBooks', label: 'Loaned Books' },
    { key: 'reservationRequests', label: 'Reservation Requests' },
    { key: 'renewalRequests', label: 'Renewal Requests' },
    { key: 'cancelRequests', label: 'Cancelled Orders' },
    { key: 'returnBooks', label: 'Returned Books' },


];
  // Fetch loan requests based on the status
  const fetchLoanRequestsByStatus = async (status) => {
    try {
      const response = await axios.get(`http://localhost:8080/lms/loan-reservation/loan-requests/status/${status}`);
      setLoanRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch loan requests. Please try again later.');
      setLoading(false);
    }
  };

    // Fetch loan requests based on the status
    const fetchLoanRequestsByStatuses = async (statuses) => {
      try {
        const response = await axios.get('http://localhost:8080/lms/loan-reservation/loan-requests/statuses', {
          params: {
              statuses: statuses.join(','), // Axios handles array-to-URL conversion
          },
      });
        setLoanRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loan requests. Please try again later.');
        setLoading(false);
      }
    };

  // Fetch reservation requests based on the status
  const fetchReservationRequests = async (status) => {
    try {
      const response = await axios.get(`http://localhost:8080/lms/loan-reservation/reservations/status/${status}`);
      setLoanRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch loan requests. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch userId from localStorage or API
  const fetchUserId = async () => {
    const username = localStorage.getItem('username');
    const type = localStorage.getItem('role');

    try {
      const response = await fetch(`http://localhost:8080/lms/auth/getUserId?username=${username}&type=${type}`);
      const data = await response.json();
      if (data.userId) {
        setUserId(data.userId);
      } else {
        alert('User ID not found');
      }
    } catch (err) {
      alert('Error fetching userId');
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (currentTab === 'loanRequests') {
      fetchLoanRequestsByStatus('Preparing for Pickup');
    } else if (currentTab === 'pickupBooks') {
      fetchLoanRequestsByStatus('Ready for Pickup');
    } else if (currentTab === 'loanedBooks') {
      fetchLoanRequestsByStatuses(['Loaned','Renewed', 'Renewal Denied']);
    } else if (currentTab === 'reservationRequests') {
      fetchReservationRequests('Pending Reservation');
    } else if (currentTab === 'renewalRequests') {
      fetchLoanRequestsByStatus('Pending Renewal');
    } else if (currentTab === 'cancelRequests') {
      fetchLoanRequestsByStatus('Cancelled');
    } else if (currentTab === 'returnBooks') {
      fetchLoanRequestsByStatus('Returned');
    }
  }, [currentTab]);

  const handleStatusChange = async (loanId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/lms/loan-reservation/updateCheckout/${loanId}`,
        null,
        {
          params: {
            status: status,
            librarianId: userId,
          },
        }
      );
      if (response.status === 200) {
        alert('Loan request status updated!');
        setLoanRequests((prev) =>
          prev.map((request) =>
            request.loanId === loanId ? { ...request, status: status } : request
          )
        );
      } else {
        alert('Failed to update the loan request status.');
      }
    } catch (error) {
      console.error('Error updating loan request status:', error);
      alert('Error updating loan request status. Please try again later.');
    }
  };

  const handleReservationStatusChange = async (reservationId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/lms/loan-reservation/updateReservation/${reservationId}/status/${status}`);
      if (response.status === 200) {
        alert('Reservation request status updated!');
        setLoanRequests((prev) =>
          prev.map((request) =>
            request.reservationId === reservationId ? { ...request, status: status } : request
          )
        );
      } else {
        alert('Failed to update the Reservation request status.');
      }
    } catch (error) {
      console.error('Error updating Reservation request status:', error);
      alert('Error updating Reservation request status. Please try again later.');
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleTabChange = (tabKey) => setCurrentTab(tabKey);

  if (loading) {
    return  <div className="flex justify-center items-center min-h-screen">
    <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
  </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Bar */}
      <div className="manage-loans">
            <div className="tabs bg-gray-800 text-white  fixed top-0 flex z-50 ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-8 py-3 text-sm font-medium border-b-3 ${
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

    {/* Loan Requests Table */}
<table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden table-auto">
  <thead>
    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
      <th className="px-6 py-4 text-left font-semibold">Book Name</th>
      {/* <th className="px-6 py-4 text-left font-semibold">Author</th> */}
      <th className="px-6 py-4 text-left font-semibold">User Name</th>
      <th className="px-6 py-4 text-left font-semibold">Requested Date</th>
      <th className="px-6 py-4 text-left font-semibold">Status</th>
      {currentTab === 'renewalRequests' && (
        <th className="px-6 py-4 text-left font-semibold">Reserved</th>
      )}
      {currentTab === 'reservationRequests' && (
        <>
          <th className="px-6 py-4 text-left font-semibold">Reserve By Date</th>
          <th className="px-6 py-4 text-left font-semibold">Availability Date</th>
        </>
      )}
      <th className="px-6 py-4 text-left font-semibold">Actions</th>
    </tr>
  </thead>
  <tbody className="text-sm text-gray-700">
    {loanRequests.map((request) => (
      <tr key={request.loanId} className="border-t hover:bg-gray-50 transition duration-200">
        <td className="px-6 py-4">
          <a
            href="#"
            onClick={() => handleBookClick(request)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {request.bookName}
          </a>
        </td>
        {/* <td className="px-6 py-4">{request.authorName}</td> */}
        <td className="px-6 py-4">{request.userName}</td>
        <td className="px-6 py-4">{new Date(request.requestedDate).toLocaleString()}</td>
        <td className="px-6 py-4">{request.status}</td>
        {currentTab === 'renewalRequests' && (
          <td className="px-6 py-4">{request.reserved ? 'Yes' : 'No'}</td>
        )}
        {currentTab === 'reservationRequests' && (
          <>
            <td className="px-6 py-4">{new Date(request.reserveByDate).toLocaleString()}</td>
            <td className="px-6 py-4">{new Date(request.expectedAvailabilityDate).toLocaleString()}</td>
          </>
        )}
        <td className="px-6 py-4">
          {currentTab === 'loanRequests' && request.status === 'Preparing for Pickup' && (
            <button
              onClick={() => handleStatusChange(request.loanId, 'Ready for Pickup')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Ready for Pickup
            </button>
          )}
          {currentTab === 'pickupBooks' && request.status === 'Ready for Pickup' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange(request.loanId, 'Loaned')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Loan
              </button>
              <button
                onClick={() => handleStatusChange(request.loanId, 'Cancelled')}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
          {currentTab === 'loanedBooks' && ['Loaned', 'Renewed', 'Renewal Denied'].includes(request.status) && (
            <button
              onClick={() => handleStatusChange(request.loanId, 'Returned')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Return
            </button>
          )}
          {currentTab === 'reservationRequests' && request.status === 'Pending Reservation' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleReservationStatusChange(request.reservationId, 'Reserved')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleReservationStatusChange(request.reservationId, 'Reservation Denied')}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Deny
              </button>
            </div>
          )}
          {currentTab === 'renewalRequests' && request.status === 'Pending Renewal' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange(request.loanId, 'Renewed')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(request.loanId, 'Renewal Denied')}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Deny
              </button>
            </div>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* Modal to display complete book details */}
      {selectedBook && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedBook.bookName}</h2>
            <p><strong>Author:</strong> {selectedBook.authorName}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            <p><strong>ISBN:</strong> {selectedBook.isbnNumber}</p>
            <p><strong>Edition:</strong> {selectedBook.edition}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Location:</strong> {selectedBook.location || 'Not specified'}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};


export default ManageBooksLoanRequests;
