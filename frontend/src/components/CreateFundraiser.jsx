import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFundraiser = () => {
    const navigate = useNavigate();
    // State variables to hold form input values and messages
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // POST request to create a new fundraiser
        try {
            const response = await axios.post("http://localhost:5001/api/fundraisers", {
              title,
              description,
              goalAmount,
            });
            setSuccess(response.data.message);
            // Navigate back to the dashboard.
            navigate("/dashboard");
          } catch (err) {
            setError("Failed to create fundraiser. Please check your input.");
          }
        };

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-3xl font-semibold text-green-600 mb-4">Create A New Fundraiser</h1>
        
              {/* Form for creating a fundraiser */}
              <form onSubmit={handleSubmit} className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Goal Amount</label>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                {/* Error and success messages */}
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Create Fundraiser
                </button>
              </form>
            </div>
          );
        };
        
        export default CreateFundraiser;