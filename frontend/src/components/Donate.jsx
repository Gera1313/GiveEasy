import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Donate = () => {
  const { fundraiserId } = useParams();
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
    <div>
      <h2>Donate to Fundraiser</h2>
      <form onSubmit={handleDonate}>
        <div>
          <label htmlFor="donorName">Donor Name:</label>
          <input
            type="text"
            id="donorName"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Donation Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Donate</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Donate;
