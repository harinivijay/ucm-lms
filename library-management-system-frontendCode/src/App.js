import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/Signup";
import Logout from "./components/Auth/Logout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminInsights from "./pages/Admin/AdminInsights.js";
import BooksList from "./pages/Admin/BookList";
import EditBook from "./pages/Admin/EditBook";
import DeleteBook from "./pages/Admin/DeleteBook";
import Members from "./pages/Admin/Members.js";
import LibrarianDashboard from "./pages/Librarian/LibrarianDashboard";
import LibBooksList from "./pages/Librarian/BookList";
import LibEditBook from "./pages/Librarian/EditBook";
import LibDeleteBook from "./pages/Librarian/DeleteBook";
import LoanRequests from "./pages/Librarian/LoanRequests.js";
import LoanedBooks from "./pages/Librarian/LoanedBooks.js";
import ReservationRequests from "./pages/Librarian/ReservationRequests.js";
import RenewalRequests from "./pages/Librarian/RenewalRequests.js";
import CancelledOrders from "./pages/Librarian/CancelledOrders.js";
import UserDashboard from "./pages/User/UserDashboard";
import UserBooksList from "./pages/User/UserBookList";
import BookingList from "./pages/User/BookingList.js";
import ReservationList from "./pages/User/ReservationList.js";




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login and SignUp */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="/admin/adminInsights" />} />
          <Route path="adminInsights" element={<AdminInsights />} />
          <Route path="booklist" element={<BooksList />} />
          <Route path="editBook/:isbn/:location" element={<EditBook />} />
          <Route path="deleteBook/:isbn/:location" element={<DeleteBook />} />
          <Route path="members" element={<Members />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />}>
          <Route index element={<Navigate to="/user/userBookList" />} />
          <Route path="userBookList" element={<UserBooksList />} />
          <Route path="bookingList" element={<BookingList />} />
          <Route path="reservationList" element={<ReservationList />} />
        </Route>

        {/* Librarian Dashboard */}
        <Route path="/librarian" element={<LibrarianDashboard />}>
          <Route index element={<Navigate to="/librarian/loan-requests" />} />
          <Route path="loan-requests" element={<LoanRequests />} />
          <Route path="loaned-books" element={<LoanedBooks />} />
          <Route path="reservation-requests" element={<ReservationRequests />} />
          <Route path="renewal-requests" element={<RenewalRequests />} />
          <Route path="cancelled-orders" element={<CancelledOrders />} />
          <Route path="books" element={<LibBooksList />} />
          <Route path="libeditBook/:isbn/:location" element={<LibEditBook />} />
          <Route path="libdeleteBook/:isbn/:location" element={<LibDeleteBook />} />
        </Route>

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>

    </Router>
  );
};

export default App;
