import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Handle registration logic here (e.g., send request to backend)
    console.log("User registered:", { username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-2xl font-bold text-green-800">
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
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 p-2 border border-gray-300 rounded-lg"
      />
      <button
        className="mt-4 p-2 bg-green-600 text-white rounded-lg"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
