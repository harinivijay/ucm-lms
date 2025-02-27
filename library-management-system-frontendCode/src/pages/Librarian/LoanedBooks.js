import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoanedBooks = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoanId, setModalLoanId] = useState(null);
  const username = localStorage.getItem('username');


  // Fetch loan requests based on the status
  const fetchLoanRequestsByStatuses = async (statuses) => {
    try {
      const response = await axios.get('http://localhost:8080/lms/loan-reservation/loan-requests/statuses', {
        params: {
          statuses: statuses.join(','),
        },
      });

      const loanRequests = response.data;

      const librariansResponse = await axios.get(`http://localhost:8080/lms/members/details/librarian/${username}`);
      const librarianLocation = librariansResponse.data.workLocation;

      const filteredBooks = loanRequests.filter(loan => loan.location === librarianLocation);

      setLoanRequests(filteredBooks);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch loan requests. Please try again later.');
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lms/books/locations');
      setLocations(response.data);
    } catch (error) {
      toast.error('Failed to fetch locations.');
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
        toast.error('User ID not found');
      }
    } catch (err) {
      toast.error('Error fetching userId');
    }
  };

  useEffect(() => {
    fetchUserId();
    fetchLoanRequestsByStatuses(['Loaned', 'Renewed', 'Renewal Denied', 'Returned', 'Delivered Online']);
  }, []);


  const handleStatusChangeWithLocation = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/lms/loan-reservation/updateCheckoutWithLocation/${modalLoanId}`,
        null,
        {
          params: {
            status: 'Returned',
            librarianId: userId,
            location: selectedLocation,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Loan request status updated!');
        fetchLoanRequestsByStatuses(['Loaned', 'Renewed', 'Renewal Denied', 'Returned', 'Delivered Online']);

      } else {
        toast.error('Failed to update the loan request status.');
      }
    } catch (error) {
      console.error('Error updating loan request status:', error);
      toast.error('Error updating loan request status. Please try again later.');
    } finally {
      setModalOpen(false);
    }
  };

  const openModal = (loanId) => {
    setModalLoanId(loanId);
    fetchLocations(); // Load locations when opening the modal
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalLoanId(null);
    setSelectedLocation('');
  };
  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-w-full ">
      <ToastContainer position="top-center" />

      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden table-auto ">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="px-6 py-4 text-left font-semibold">Book Name</th>
            <th className="px-6 py-4 text-left font-semibold">Author</th>
            <th className="px-6 py-4 text-left font-semibold">User Name</th>
            <th className="px-6 py-4 text-left font-semibold">Loaned Date</th>
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
                {['Loaned', 'Renewed', 'Renewal Denied'].includes(request.status) && (
                  <button
                    onClick={() => openModal(request.loanId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Return
                  </button>
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

      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Select Location</h2>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.locationId} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>

            <div className="mt-4 flex justify-between">
              <button
                onClick={handleStatusChangeWithLocation}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Submit
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
    
export default LoanedBooks;
