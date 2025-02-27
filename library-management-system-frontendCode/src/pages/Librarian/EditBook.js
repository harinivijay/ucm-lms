import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBook = () => {
  const { isbn, location } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [books, setBooks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [commonFields, setCommonFields] = useState({
    bookName: "",
    description: "",
    authorName: "",
    category: "",
    edition: "",
  });

  const [error, setError] = useState(""); // Error state for displaying error messages
  const [individualErrors, setIndividualErrors] = useState({}); // Store errors for individual books

  // Fetch books and locations
  useEffect(() => {
    const fetchBooksAndLocations = async () => {
      try {
        const booksResponse = await axios.get(
          `http://localhost:8080/lms/books/list?isbn=${isbn}&location=${location}`
        );
        const booksData = Array.isArray(booksResponse.data) ? booksResponse.data : [];
        setBooks(booksData);

        if (booksData.length > 0) {
          const firstBook = booksData[0];
          setCommonFields({
            bookName: firstBook.bookName || "",
            description: firstBook.description || "",
            authorName: firstBook.authorName || "",
            category: firstBook.category || "",
            edition: "",
          });
        }

        const locationsResponse = await axios.get("http://localhost:8080/lms/books/locations");
        setLocations(locationsResponse.data);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
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
    fetchBooksAndLocations();
    fetchCategories();
  }, [isbn, location]);

  // Handle common field changes
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonFields((prev) => ({ ...prev, [name]: value }));
  };

  // Handle individual field changes in the table
  const handleBookChange = async (index, field, value) => {
    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks]; // Create a copy of the books array
      updatedBooks[index][field] = value;  // Update the field value for the specific book
      return updatedBooks;  // Return the updated array
    });
  };

  // Submit common changes
  const handleCommonSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/lms/books/details/isbn/${isbn}`,
        commonFields
      );
      toast.success("Common changes applied successfully!");
    } catch (error) {
      console.error("Error updating common fields:", error);
      setError("Failed to update common fields. Please try again.");
    }
  };

  // Submit individual changes for a specific copy
  const handleIndividualSubmit = async (bookId, updatedBook, index) => {
    try {
      await axios.put(
        `http://localhost:8080/lms/books/details/bookId/${bookId}`,
        updatedBook
      );
      toast.success("Book updated successfully!");

      // Reset books after success
      const refreshedBooksResponse = await axios.get(
        `http://localhost:8080/lms/books/list?isbn=${isbn}&location=${location}`
      );
      setBooks(refreshedBooksResponse.data);
    } catch (error) {
      console.error("Error updating book:", error);
      setIndividualErrors((prev) => ({
        ...prev,
        [bookId]: "Failed to update this book. Please try again."
      }));
    }
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
        <h2 className="text-3xl font-semibold text-gray-800">Edit Books</h2>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ToastContainer position="top-center" />

      {/* Common Edit Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Edit Common Fields</h3>
        <form onSubmit={handleCommonSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600">Book Name</label>
              <input
                type="text"
                name="bookName"
                value={commonFields.bookName}
                onChange={handleCommonChange}
                className="input input-bordered w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-gray-600">Description</label>
              <input
                type="text"
                name="description"
                value={commonFields.description}
                onChange={handleCommonChange}
                className="input input-bordered w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-gray-600">Author Name</label>
              <input
                type="text"
                name="authorName"
                value={commonFields.authorName}
                onChange={handleCommonChange}
                className="input input-bordered w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            {/* <div>
              <label className="block text-gray-600">Category</label>
              <input
                type="text"
                name="category"
                value={commonFields.category}
                onChange={handleCommonChange}
                className="input input-bordered w-full border-gray-300 rounded-md shadow-sm"
              />
            </div> */}
          {/* <div>
            <label htmlFor="category" className="block text-gray-600">Category</label>
            <select
              name="category"
              id="category"
              value={commonFields.category}
              onChange={handleCommonChange}
              className="input input-bordered w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div> */}

          </div>
          <button
            type="submit"
            className="btn btn-success px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
          >
            Apply Changes to All Copies
          </button>
        </form>
      </div>

      {/* Individual Edit Table */}
      <table className="table-auto w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left text-gray-600">Book Id</th>
            <th className="px-4 py-2 text-left text-gray-600">Location</th>
            <th className="px-4 py-2 text-left text-gray-600">Available</th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.bookId} className="border-b">
              <td className="px-4 py-2 text-gray-800">{book.bookId}</td>
              <td className="px-4 py-2">
                <select
                  value={book.location}
                  onChange={(e) => handleBookChange(index, "location", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  {locations.map((loc) => (
                    <option key={loc.locationId} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={book.available}
                  onChange={(e) => handleBookChange(index, "available", e.target.checked)}
                />
              </td>
              <td className="px-4 py-2">
                <button
                  className={`btn px-4 py-2 rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 text-white`}
                  onClick={() => handleIndividualSubmit(book.bookId, book, index)}
                >
                  Save
                </button>
                {individualErrors[book.bookId] && (
                  <p className="text-red-500 text-xs">{individualErrors[book.bookId]}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditBook;
