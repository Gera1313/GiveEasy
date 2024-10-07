import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [fundraisers, setFundraisers] = useState([]); // State for holding fundraisers
  const [fetchError, setFetchError] = useState(""); // State for error handling

  // Fetch fundraisers when component mounts
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/fundraisers");
        setFundraisers(response.data);
        setFetchError("");
      } catch (error) {
        console.error("Error fetching fundraisers:", error);
        setFetchError("Failed to load fundraisers. Please try again later.");
      }
    };

    fetchFundraisers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-semibold text-green-600">Dashboard</h1>
    </div>
  );
};

export default Dashboard;
  