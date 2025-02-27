import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReturnedBooks = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userId, setUserId] = useState(null);

  
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
    fetchLoanRequestsByStatus('Ready for Pickup');
  }, []);


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
        fetchLoanRequestsByStatus('Pending Renewal');

      } else {
        alert('Failed to update the loan request status.');
      }
    } catch (error) {
      console.error('Error updating loan request status:', error);
      alert('Error updating loan request status. Please try again later.');
    }
  };


  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return  <div className="flex justify-center items-center min-h-screen">
    <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
  </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-w-full ">
     
  <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden table-auto ">
  <thead>
    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
      <th className="px-6 py-4 text-left font-semibold">Book Name</th>
      <th className="px-6 py-4 text-left font-semibold">Author</th>
      <th className="px-6 py-4 text-left font-semibold">User Name</th>
      <th className="px-6 py-4 text-left font-semibold">Requested Date</th>
      <th className="px-6 py-4 text-left font-semibold">Status</th>
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
        <td className="px-6 py-4">{request.authorName}</td>
        <td className="px-6 py-4">{request.userName}</td>
        <td className="px-6 py-4">{new Date(request.requestedDate).toLocaleString()}</td>
        <td className="px-6 py-4">{request.status}</td>
        <td className="px-6 py-4">
            <button
              onClick={() => handleStatusChange(request.loanId, 'Ready for Pickup')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Ready for Pickup
            </button>
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
  );
};


export default ReturnedBooks;
