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

    if (!stripe || !elements) {
        return; // stripe hasn't yet loaded
    }

    setIsProcessing(true); // Disables button to prevent multiple submissions

    try {
      const token = localStorage.getItem("token");
      // Step 1: Creates a payment intent on the server
      const { data: clientSecret } = await axios.post(
        "http://localhost:5001/api/payments", // Adjust this URL maybe. 
        {
          amount: parseFloat(amount) * 100, 
          donorName,
          fundraiserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Client Secret:', clientSecret);

  // Step 2: Confirm the card payment
  const cardElement = elements.getElement(CardElement);
  const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: donorName, // Optional: Include donor name in billing details
      },
    },
  });

  if (stripeError) {
    console.error('Stripe Error:', stripeError);
    // Handle any errors that occur during confirmation
    setError(stripeError.message);
    setIsProcessing(false);
  } else if (paymentIntent.status === "succeeded") {
    // Payment was successful
    setSuccessMessage("Payment successful! Thank you for your contribution.");
    // Clear input fields after successful donation
    setAmount("");
    setDonorName("");
    setIsProcessing(false);
  } else {
    // Handle other potential statuses (optional)
    setError("Payment not successful, please try again.");
    setIsProcessing(false);
  }
} catch (error) {
  // Handle errors that may occur during API request
  setError(error.response?.data?.message || "Error donating");
  setIsProcessing(false);
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Card Details:
          </label>
          <CardElement className="border border-gray-300 rounded-lg p-2 w-full" />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {isProcessing ? "Processing..." : "Donate"}
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
