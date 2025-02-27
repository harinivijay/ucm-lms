import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminDashboard';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("MIC Campus");
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchvalue, setSearchValue] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);


  const [formData, setFormData] = useState({
    bookId: "",
    bookName: "",
    authorName: "",
    edition: 1,
    category: "",
    isAvailable: true,
    location: "",
    count: 1,
  });
  const [isAddingExistingBook, setIsAddingExistingBook] = useState(false);

  useEffect(() => {
    fetchLocations();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks(selectedLocation, currentPage, searchTerm, category == 'All' ? null : category);
  }, [selectedLocation, currentPage, searchTerm, category]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lms/books/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const generateBookId = () => {
    // Example: generating a random ID. You can replace this with your logic.
    return `BOOK-${Math.floor(Math.random() * 1000000)}`;
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lms/books/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBooks = async (location, page, searchQuery, category) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/lms/books/grouped`,
        {
          params: {
            pageNumber: page,
            size: 10,
            locationFilter: location,
            categoryFilter: category,
            search: searchQuery,
          },
        }
      );
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
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
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddBook = async (e) => {
    e.preventDefault(); // Prevent form submission if necessary

    try {
      // Fetch the book details using ISBN
      const response = await axios.get(`http://localhost:8080/lms/books/details/id/${formData.bookId}`);

      if (formData.category === "E-Book" && response.data) {
        toast.info(`E-Book already exists!, Cannot add more copies`);
        console.error("E-Book already exists!, Cannot add more copies");
      } else {
        await axios.post("http://localhost:8080/lms/books/addBooks", formData);
        fetchBooks(selectedLocation, currentPage, searchTerm, category === "All" ? null : category); // Refresh books
        toast.success("Book added successfully!");

        // Reset the form data after successful book addition
        setFormData({
          bookName: "",
          description: "",
          authorName: "",
          edition: 1,
          category: "",
          bookId: "",
          location: "",
          count: 1,
        });
        setShowForm(false);
      }
    } catch (error) {
      // Handle errors during the request
      toast.error("Error adding book!");
      console.error("Error adding book:", error.response ? error.response.data : error.message);
    }
  };


  const handleEdit = (book) => {
    setFormData(book);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/lms/books/details/bookId/${formData.bookId}`, formData);
      toast.success("Book updated successfully!");
      setShowForm(false);
      setIsEditMode(false);
      fetchBooks(selectedLocation, currentPage, "", category === "All" ? null : category);
    } catch (error) {
      toast.error("Error updating book.");
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  // Show the modal for adding a new book or adding count to an existing book
  const showAddBookForm = () => {
    setFormData({
      bookId: generateBookId(), // Auto-generate book ID for new book
      bookName: "",
      description: "",
      authorName: "",
      edition: 1,
      category: "",
      isAvailable: true,
      location: "",
      count: 1,
    });
    setIsAddingExistingBook(false);
    setShowForm(true);
  };


  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
        </div>
      ) : (
        <>
          <ToastContainer position="top-center" />

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
            <div className="flex-grow"></div>   {/* Add Book Button */}
            <button onClick={showAddBookForm} className="bg-blue-500 text-white py-2 px-4 rounded "
            >Add New Book</button>
          </div>

          {/* Book Table */}
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden table-auto">
            <thead >
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="px-6 py-3 text-left text-sm font-semibold">Book Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Available </th>
                {/* <th className="px-6 py-3 text-left text-sm font-semibold">Loaned Count</th>
      <th className="px-6 py-3 text-left text-sm font-semibold">Total Count</th> */}
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {books.map((book, index) => (
                <tr
                  key={book.bookId}
                  className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-200`}
                >
                  <td className="px-6 py-3">
                    <a
                      href="#"
                      onClick={() => handleBookClick(book)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {book.bookName}
                    </a>
                  </td>
                  <td className="px-6 py-3">{book.authorName}</td>
                  <td className="px-6 py-3">{book.category}</td>
                  <td className="px-6 py-3">{book.available ? 'Yes' : 'No'}</td>
                  {/* <td className="px-6 py-3">{book.loanedCount}</td>
        <td className="px-6 py-3">{book.totalCount}</td> */}
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`py-2 px-6 rounded-md transition-colors duration-300 ${currentPage === 0
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
              className={`py-2 px-6 rounded-md transition-colors duration-300 ${currentPage === totalPages - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>

          {/* Modal to display complete book details */}
          {selectedBook && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">{selectedBook.bookName}</h2>
                <p><strong>BookId:</strong> {selectedBook.bookId}</p>
                <p><strong>Author:</strong> {selectedBook.authorName}</p>
                <p><strong>Category:</strong> {selectedBook.category}</p>
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

          {/* Modal for adding  or editing book */}
          {showForm && (
            <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="modal-window bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="text-2xl font-semibold mb-4">
                  {isEditMode ? "Edit Book" : "Add New Book"}
                </h3>
                <form onSubmit={isEditMode ? handleSaveEdit : handleAddBook} className="space-y-6">

                  {/* Book Id */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="bookId" className="text-sm font-medium text-gray-700 w-1/4">
                      Book Id
                    </label>
                    <input
                      id="bookId"
                      type="text"
                      name="bookId"
                      value={formData.bookId}
                      onChange={handleFormChange}
                      placeholder="Enter Book Id"
                      required
                      disabled
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Book Name */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="bookName" className="text-sm font-medium text-gray-700 w-1/4">
                      Book Name
                    </label>
                    <input
                      id="bookName"
                      type="text"
                      name="bookName"
                      value={formData.bookName}
                      onChange={handleFormChange}
                      placeholder="Enter Book Name"
                      required
                      disabled={isAddingExistingBook}
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700 w-1/4">
                      Description
                    </label>
                    <input
                      id="description"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter Description"
                      required
                      disabled={isAddingExistingBook}
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Author Name */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="authorName" className="text-sm font-medium text-gray-700 w-1/4">
                      Author Name
                    </label>
                    <input
                      id="authorName"
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleFormChange}
                      placeholder="Enter Author Name"
                      required
                      disabled={isAddingExistingBook}
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Edition */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="edition" className="text-sm font-medium text-gray-700 w-1/4">
                      Edition
                    </label>
                    <input
                      id="edition"
                      type="number"
                      name="edition"
                      value={formData.edition}
                      onChange={handleFormChange}
                      placeholder="Enter Edition"
                      required
                      disabled={isAddingExistingBook}
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700 w-1/4">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                      disabled={isAddingExistingBook}
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.categoryName}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="form-group flex items-center gap-4">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 w-1/4">
                      Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Select Location
                      </option>
                      {locations.map((location, index) => (
                        <option key={index} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>



                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn btn-cancel bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                      {isEditMode ? "Save Changes" : "Add Book"}

                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default BookList;
