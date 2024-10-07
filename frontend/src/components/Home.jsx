import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // State for holding fundraisers, Effect to fetch them.
import axios from 'axios';

// Initialize nagivation and state variables.
const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fundraisers, setFundraisers] = useState([]);

  // Function to handle the login process. 
  const handleLogin = async () => {
    try {
      // POST request to the login API with username/password.
      const response = await axios.post('http://localhost:5001/api/login', { username, password });
      navigate('/dashboard');
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  // Main return statement of the Home component, rendering the login/register interface. 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to GiveEasy!</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-4 p-2 border border-gray-300 rounded-lg"/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 p-2 bg-blue-600 text-white rounded-lg"/>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-4 mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleLogin}>Login</button>
        <Link to="/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;