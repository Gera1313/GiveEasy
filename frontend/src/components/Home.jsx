import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
}

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to GiveEasy!</h1>
      <input type="text" placeholder="Username" className="mt-4 p-2 border border-gray-300 rounded-lg"/>
      <input type="text" placeholder="Password" className="mt-2 p-2 bg-blue-600 text-white rounded-lg"/>

      <div className="flex space-x-4 mt-4">
        <Link to="/dashboard">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Login</button>
        </Link>
        <Link to="/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;