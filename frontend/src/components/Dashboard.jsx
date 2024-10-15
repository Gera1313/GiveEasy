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
        const response = await axios.get(
          "http://localhost:5001/api/fundraisers"
        );
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-semibold text-green-600 text-center">Dashboard</h1>

      {/* Link to create a new fundraiser */}
      <Link to="/create-fundraiser">
        <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
          Create New Fundraiser
        </button>
      </Link>

      {/* Active Fundraisers section */}
      <h2 className="mt-6 text-2xl font-bold text-center">Active Fundraisers</h2>

      {/* Display error message if fetching fundraisers failed */}
      {fetchError && <p className="text-red-500 text-center">{fetchError}</p>}

      <div className="mt-4 w-full">
        {!fetchError && fundraisers.length > 0 ? (
          fundraisers.map((fundraiser) => (
            <div key={fundraiser._id} className="p-4 bg-white border rounded-lg shadow mb-4">
              <h3 className="text-xl font-bold">{fundraiser.title}</h3>
              <p className="mb-2">{fundraiser.description}</p>
              <p>Current Total: ${fundraiser.currentAmount}</p>
              <p>Goal: ${fundraiser.goalAmount}</p>
              <Link to={`/fundraisers/${fundraiser._id}/donate`}>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                  Donate
                </button>
              </Link>
            </div>
          ))
        ) : (
          !fetchError && <p className="text-center">No active fundraisers at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;