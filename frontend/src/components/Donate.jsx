import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const Donate = () => {
  const { fundraiserId } = useParams();
  const stripe = useStripe();
  const elements = useElements();


  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/donations",
        {
          amount: parseFloat(amount),
          donorName,
          fundraiserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      // Clear input fields after successful donation
      setAmount("");
      setDonorName("");
    } catch (error) {
      setError(error.response?.data?.message || "Error donating");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-3xl font-semibold text-green-600 mb-4">
        Donate to Fundraiser
      </h2>
      <form
        onSubmit={handleDonate}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="donorName" className="block text-gray-700 mb-2">
            Donor Name:
          </label>
          <input
            type="text"
            id="donorName"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 mb-2">
            Donation Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Donate
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-4">{successMessage}</p>
      )}
    </div>
  );
};

export default Donate;
