import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // State for holding fundraisers, Effect to fetch them.
import axios from "axios";

// Initialize nagivation and state variables.
const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fundraisers, setFundraisers] = useState([]);

  // Fetch fundraisers when component mounts
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/fundraisers"
        );
        setFundraisers(response.data);
      } catch (error) {
        console.error("Error fetching fundraisers:", error);
      }
    };

    fetchFundraisers();
  }, []);

  // Function to handle the login process.
  const handleLogin = async () => {
    try {
      // POST request to the login API with username/password.
      const response = await axios.post("http://localhost:5001/api/login", {
        username,
        password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  // Main return statement of the Home component, rendering the login/register & Active Fundraisers interface.
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome to GiveEasy!
      </h1>

      {/* Username input field */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded-lg"
      />
      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 p-2 bg-blue-600 text-white rounded-lg"
      />

{/* Displays error message if login fails */}
      {error && <p className="text-red-500">{error}</p>}

{/* Login and Register buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={handleLogin}
        >
          Login
        </button>
        <Link to="/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Register
          </button>
        </Link>
      </div>

    {/* Active Fundraisers section */}
    <h2 className="mt-6 text-2xl font-bold">Active Fundraisers</h2>
    <div className="mt-4">
      {fundraisers.length > 0 ? (
        fundraisers.map((fundraiser) => (
          <div key={fundraiser._id} className="p-4 border-b">
            <h3 className="text-xl">{fundraiser.title}</h3>
            <p>{fundraiser.description}</p>
            <p>Current Total: ${fundraiser.currentAmount}</p>
            <p>Goal: ${fundraiser.goalAmount}</p>
          </div>
        ))
      ) : (
        // Message when no fundraisers are available
        <p>No active fundraisers at this time.</p>
      )}
    </div>
  </div>
);
};

export default Home;
