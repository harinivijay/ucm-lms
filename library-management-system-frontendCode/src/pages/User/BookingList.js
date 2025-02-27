import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingList = () => {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State for userId
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const username = localStorage.getItem('username');
      const type = localStorage.getItem('role');
        
      // API call to fetch userId based on username
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

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookingList();
    }
  }, [userId]);

  const fetchBookingList = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/lms/loan-reservation/loan-requests/user/${userId}`);
      setBookingList(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch booking list. Please try again later.');
      setLoading(false);
    }
  };

  const handleRenew = async (loanId) => {
    try {
        const response = await axios.post('http://localhost:8080/lms/loan-reservation/requestRenewal', null,{
            params: {
              loanId: loanId,

            },}
          );      
    if (response.status === 200) {
        toast.success('Renewal requested. Await for  approval!');
        fetchBookingList();
      } else {
        toast.e('Failed to renew the book.');
      }
    } catch (error) {
      console.error('Error renewing book:', error);
      toast.error('Error renewing the book. Please try again later.');
    }
  };


  const handleCancelRenewal = async (loanId) => {
    try {
        const response = await axios.put(
            `http://localhost:8080/lms/loan-reservation/updateCheckout/${loanId}`,
            null,
            {
              params: {
                status: "Renewal Cancelled",
                librarianId: userId,
              },
            }
          );      if (response.status === 200) {
        toast.success('Renewal request canceled successfully!');
        fetchBookingList();
      } else {
        toast.error('Failed to cancel renewal.');
      }
    } catch (error) {
      console.error('Error canceling renewal request:', error);
      toast.error('Error canceling renewal request. Please try again later.');
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
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Your Booking List</h1> */}
      <ToastContainer position="top-center" />

      {bookingList.length === 0 ? (
        <div className="text-center">No bookings found.</div>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Book Name</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Pickup Location</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.map((booking) => (
              <tr key={booking.loanId}>
                <td className="border px-4 py-2">
                <a
                  href="#"
                  onClick={() => handleBookClick(booking)}
                  className="text-blue-500 hover:underline"
                >
                  {booking.bookName}
                </a>
                </td>
                <td className="border px-4 py-2">{booking.authorName}</td>
                <td className="border px-4 py-2">
                  {booking.status}
                </td>
                <td className="border px-4 py-2">
                  {booking.category === 'E-Book'? 'Online' : booking.location} 
                  
                </td>
                <td className="border px-4 py-2">
                  {booking.status !== 'Returned' && booking.dueDate ? new Date(booking.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className="border px-4 py-2 text-center">
                  {(booking.status === 'Loaned' || booking.status === 'Renewal Cancelled' || booking.status === 'Renewed') && booking.renewalCount < 3 && (
                    <button
                      onClick={() => handleRenew(booking.loanId, booking.bookId)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Renew
                    </button>
                  )}
                    {booking.status === 'Pending Renewal' && (
                    <button
                      onClick={() => handleCancelRenewal(booking.loanId)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Cancel Renewal
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal to display complete book details */}
      {selectedBook && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedBook.bookName}</h2>
            <p><strong>Author:</strong> {selectedBook.authorName}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            <p><strong>Edition:</strong> {selectedBook.edition}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            {/* <p><strong>Location:</strong> {selectedBook.location || 'Not specified'}</p> */}
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
