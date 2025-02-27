import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signUp } from '../../services/Authservice';
import './Auth.css';
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        type: 'user',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        dob: '',
        phoneNumber: '',
        ssn: '', // For librarians only
        workLocation: '', // For librarians only
    });

    const [locations, setLocations] = useState([]); // For work locations
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch locations when the component loads
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:8080/lms/books/locations");
                setLocations(response.data); // Populate locations state
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await signUp(formData);
            setLoading(false);
            setSuccessMessage('Sign-up successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
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

                    {/* Personal Information */}
                    <div className="form-group name-row">
                        <div className="input-group">
                            <label>First Name:</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Last Name:</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Address Information */}
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="form-group name-row">
                        <div className="input-group">
                            <label>City:</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>State:</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Postal Code:</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input type="text" name="dob" value={formData.dob} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    </div>

                    {/* User Type */}
                    <div className="form-group">
                        <label>User Type:</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="librarian">Librarian</option>
                            {/* <option value="admin">Admin</option> */}

                        </select>
                    </div>

                    {/* Additional Fields for Librarians */}
                    {formData.type === 'librarian' && (
                        <>
                            <div className="form-group">
                                <label>SSN:</label>
                                <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Work Location:</label>
                                <select name="workLocation" value={formData.workLocation} onChange={handleChange} required>
                                    <option value="">Select Work Location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.name}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default SignUpForm;
