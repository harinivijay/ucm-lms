import React, { useEffect, useState } from "react";
import axios from "axios";
import './UserDashboard.css'; // Assuming you have the required CSS for modal and table
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookModal = ({ isOpen, onClose, book, onSubmit, formType, formData, setFormData }) => {
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lms/books/locations");
      setLocations(response.data);
      setFormData((prev) => ({
        ...prev,
        location: "MIC Campus"
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submitting the formData to parent
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      reservationDate: "",
      location:"",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="modal-overlay">
  <div className="modal-window">
    <h2 className="text-2xl font-semibold mb-4">{formType} Book</h2>
    <p><strong>Book Name:</strong> {book.bookName}</p>
    <p><strong>Description:</strong> {book.description}</p>
    <p><strong>Author:</strong> {book.authorName}</p>
    <p><strong>Edition:</strong> {book.edition}</p>
    <p><strong>Category:</strong> {book.category}</p>
    <div className="flex items-center space-x-2">
    <label htmlFor="location" className="font-medium">
      Location:
    </label>
    <select
      id="location"
      name="location"
      value={formData.location}
      onChange={handleChange}
      className="px-4 py-2 border"
    >
      {locations.map((location) => (
        <option key={location.locationId} value={location.name}>
          {location.name}
        </option>
      ))}
    </select>
  </div>
    <form onSubmit={handleSubmit} className="modal-form">
     
          {/* {formType === "Reserve" && (
        <div className="flex items-center gap-4 mb-4">
          <label className="flex-shrink-0 font-semibold">
            <strong>Reserve By Date:</strong>
          </label>
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split("T")[0]}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )} */}

      <div className="flex justify-between gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full sm:w-auto"
        >
          {formType}
        </button>
        <button
          onClick={handleClose}
          className="bg-gray-200 text-black py-2 px-4 rounded w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

const UserBookList = () => {
  const [books, setBooks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("MIC Campus");
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchvalue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookForModal, setBookForModal] = useState(null);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const booksPerPage = 8;

  useEffect(() => {
    fetchLocations();
    fetchCategories();
    fetchUserId();
  }, []);

  useEffect(() => {
    if(userId !== null) {
      fetchBooks(selectedLocation, currentPage, searchTerm, category == 'All' ? null : category, userId);
    }
  }, [selectedLocation, currentPage, searchTerm, category, userId]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lms/books/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lms/books/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const fetchBooks = async (location, page, searchQuery, category, userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/lms/books/grouped`,
        {
          params: {
            pageNumber: page,
            size: booksPerPage,
            locationFilter: location,
            categoryFilter: category,
            search: searchQuery,
          },
        }
      );
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages); // Update total pages for pagination
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    const username = localStorage.getItem('username');
    const type = localStorage.getItem('role');
    try {
        const response = await fetch(`http://localhost:8080/lms/auth/getUserId?username=${username}&type=${type}`);
        const data = await response.json();
        if (data.userId) {
            setUserId(data.userId);
            fetchBooks(selectedLocation, currentPage, searchTerm, category == 'All' ? null : category, data.userId);
        } else {
          toast.error('User ID not found');
        }
    } catch (err) {
      toast.error('Error fetching userId');
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setSelectedLocation(selectedLocation);
    setCurrentPage(0); // Reset to first page when location changes
  };

  const handleSearch = (e) => {
    setSearchTerm(searchvalue);
    setCurrentPage(0); // Reset to the first page when a search is performed
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(0); // Reset to the first page when a search is performed
  };
  
  const openModal = (book, type) => {
    setBookForModal(book);
    setFormType(type);
    setIsModalOpen(true);
    setFormData({
      reservationDate: "",
      location:"MIC Campus",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookForModal(null);
    setFormData({
      reservationDate: "",
      location:"",
    });
  };

  const handleCheckout = async (formData) => {
    try {
        const response = await axios.post('http://localhost:8080/lms/loan-reservation/requestCheckout', null,{
          params: {
            bookId: bookForModal.bookId,
            userId: userId, 
            location: formData.location,
          },}
        );
      
      if (response.status === 200) {
        toast.success('Checkout Successful');
        fetchBooks(selectedLocation, currentPage, searchTerm, category == 'All' ? null : category, userId);
        setCurrentPage(currentPage);
      } else {
        toast.error('Something went wrong during checkout');
      } 
    }
     catch (error) {
      console.error("Checkout API error:", error);
      toast.error('Error during checkout. Please try again later.');
    } finally {
      closeModal();
    }
  };

  const handleReservation = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8080/lms/loan-reservation/requestReservation', {
        bookId: bookForModal.bookId,
        userId: userId,
        location: formData.location,
      });
      if (response.status === 200) {
        toast.info(response.data);
        fetchBooks(selectedLocation, currentPage, searchTerm, category == 'All' ? null : category, userId);
        setCurrentPage(currentPage);

      } else {
        toast.error('Something went wrong during reservation');
      }
    } catch (error) {
      console.error("Reservation API error:", error);
      toast.error('Error during reservation. Please try again later.');
    } finally {
      closeModal();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Book List</h2>
      <ToastContainer position="top-center" />

      {loading ? (
            <div className="flex justify-center items-center min-h-screen">
        <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
      </div> 
        ) : (
        <> 
       <div className="flex items-center space-x-4 mb-4">
  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search for a book..."
    value={searchvalue}
    onChange={(e) => setSearchValue(e.target.value)} 
    className="px-4 py-2 border w-64"
  />
  <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded"
  >Search</button>

  {/* Location Filter */}
  <div className="flex items-center space-x-2">
    <label htmlFor="location" className="font-medium">
      Location:
    </label>
    <select
      id="location"
      value={selectedLocation}
      onChange={handleLocationChange}
      className="px-4 py-2 border"
    >
      {locations.map((location) => (
        <option key={location.locationId} value={location.name}>
          {location.name}
        </option>
      ))}
    </select>
  </div>

  {/* Category Filter */}
  <div className="flex items-center space-x-2">
    <label htmlFor="category" className="font-medium">
      Category:
    </label>
    <select
      id="category"
      value={category}
      onChange={handleCategoryChange}
      className="px-4 py-2 border"
    >
      <option value="All">All</option>
      {categories.map((category) => (
        <option key={category.categoryId} value={category.categoryName}>
          {category.categoryName}
        </option>
      ))}
    </select>
  </div>
</div>



          {/* Book Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {books.map((book) => (
    <div key={book.isbnNumber} className="border bg-gray-70 rounded-lg p-4 flex flex-col h-full">
      <h3 className="font-semibold text-lg mb-2">{book.bookName}</h3>
      <p className="text-sm mb-2">Author Name: {book.authorName}</p>
      <p className="text-sm mb-2">Category: {book.category}</p>
      <p className="text-sm mb-4">Description: {book.description}</p>
      
      {/* Content above the button */}
      <p className={`text-sm mb-4 ${book.available ? "text-green-600" : book.reserved ? "text-red-600" : "text-blue-600"}`}>
  {book.available
    ? "Book available for checkout"
    : book.reserved
    ? "Book already reserved!"
    : "Currently unavailable! Reserve?"}
</p>
<div className="flex-grow"></div> {/* This pushes the button to the bottom */}

{book.available ? (
  <button
    onClick={() => openModal(book, "Checkout")}
    className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
  >
    Checkout {/* Change label if not available */}
  </button>
) : (
  <button
    onClick={() => openModal(book, "Reserve")}
    className={`${
      book.reserved
        ? 'bg-gray-300 text-gray-500 py-2 px-4 rounded w-full cursor-not-allowed'
        : 'bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600'
    }`}
    disabled={(book.reserved)}
  >
    Reserve
  </button>
)}

    </div>
  ))}
</div>


          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`py-2 px-6 rounded-md transition-colors duration-300 ${
              currentPage === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <span className="text-lg text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`py-2 px-6 rounded-md transition-colors duration-300 ${
              currentPage === totalPages - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>

        </>
      )}

      <BookModal
        isOpen={isModalOpen}
        onClose={closeModal}
        book={bookForModal}
        onSubmit={formType === "Reserve" ? handleReservation : handleCheckout}
        formType={formType}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default UserBookList;
