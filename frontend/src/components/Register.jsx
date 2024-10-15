import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// State variables for username, email, password, and errors. 
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to handle user registration. 
  const handleRegister = async () => {
    try {
      // POST request to register the user. 
      const response = await axios.post("http://localhost:5001/api/register", { username, email, password });
      console.log("Server response:", response.data);
      setError(null);
      console.log("User registered:", { username, email, password });
      // Redirect to login or dashboard after successful registration
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  // Main return statement of the Register component, rendering the registration form. 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Register for GiveEasy!
      </h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 p-2 border border-gray-300 rounded-lg"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="mt-4 p-2 bg-green-600 text-white rounded-lg"
        onClick={handleRegister}
      >
        Register
      </button>
      </div>
    </div>
  );
};

export default Register;
