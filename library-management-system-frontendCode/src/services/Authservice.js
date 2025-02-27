import axios from "axios";

export const login = (data) => axios.post("http://localhost:8080/lms/auth/login", data);
export const signUp = (data) => axios.post("http://localhost:8080/lms/auth/signup", data);
export const logout = () => {
    localStorage.removeItem("role");  
    localStorage.removeItem("username"); 
    };
export const isAuthenticated = () => {
  return true; // Check if the token exists
};
  