import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/24/solid'; // Import the back icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteBooksPage = () => {
  const { isbn, location } = useParams();
  const [books, setBooks] = useState([]); // All book copies
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [bookToDelete, setBookToDelete] = useState(null); // Store the bookId of the book to be deleted
  const navigate = useNavigate();

  // Fetch the books on page load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/lms/books/list?isbn=${isbn}&location=${location}`);
        const booksData = Array.isArray(response.data) ? response.data : [];
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [isbn, location]);

  // Handle book delete action
  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8080/lms/books/bookId/${bookId}`);
      alert("Book deleted successfully!");
      // Refresh the book list after deletion
      setBooks(books.filter(book => book.bookId !== bookId));
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting book:", error);
      setShowModal(false); // Close the modal in case of an error
    }
  };

  // Open the confirmation modal
  const openModal = (bookId) => {
    setBookToDelete(bookId);
    setShowModal(true);
  };

  // Close the confirmation modal
  const closeModal = () => {
    setShowModal(false);
    setBookToDelete(null);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Back Button with Icon */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)} // Navigate back using useNavigate
          className="text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-full transition-all"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-800">Delete Books</h2>
      </div>
      <ToastContainer position="top-center" />

      {/* Delete Book Table */}
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Book Id</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Location</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Available</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-800">{book.bookId}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{book.location}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{book.available ? "Yes" : "No"}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-300"
                  onClick={() => openModal(book.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this book?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(bookToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteBooksPage;
