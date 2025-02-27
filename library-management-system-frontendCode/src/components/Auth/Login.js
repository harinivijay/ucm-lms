import React, { useState } from "react";
import { login } from '../../services/Authservice';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(formData); 
      const { username, role } = response.data; 
      // Store username in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      setLoading(false);
      console.log(`Logged in as: ${username}, Role: ${role}`);
  
      // Redirect based on role
      if (role.toLowerCase() === "admin") navigate("/admin/adminInsights");
      else if (role.toLowerCase() === "librarian") navigate("/librarian/loan-requests");
      else if (role.toLowerCase() === "user") navigate("/user/userBookList");
      else setErrorMessage("Unexpected role. Please contact support.");
    } catch (err) {
      setErrorMessage("Invalid username or password."); // Display error if login fails
      setLoading(false);
      setFormData({username:"", password: ""})
    }
  };

  return (
  <div className="auth-container">
              <div className="auth-header">
                  Book<span>Nest</span>
              </div>
              <div className="auth-form">
                  <form onSubmit={handleSubmit}>
                      <div className="form-group">
                          <h2 className="form-title">Sign Up</h2>
                      </div>
                      <div className="form-group">
                          <label>Username:</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                    </div>
                    <div className="form-group">
                      <label>Password:</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                  </form>
                    {/* Add Sign Up link */}
                    <p class="text-center text-gray-600">
                      Don't have an account? 
                      <Link to="/signup" class="text-blue-500 hover:text-blue-700 font-semibold">
                        Sign up here
                      </Link>
                    </p>
                  {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
                </div>
  </div>
  );
};

export default Login;
