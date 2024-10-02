// src/components/Login.jsx
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-2xl font-bold text-blue-800">Login to GiveEasy!</h1>
      {/* <input type="text" placeholder="Username" className="mt-4 p-2 border border-gray-300 rounded-lg"/>
      <input type="text" placeholder="Password" className="mt-2 p-2 bg-blue-600 text-white rounded-lg"/> */}
      <button className="mt-4 p-2 bg-blue-600 text-white rounded-lg">
        Login
      </button>
    </div>
  );
};

export default Login;
  