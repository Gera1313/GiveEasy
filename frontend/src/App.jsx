import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Home from './components/Home';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateFundraiser from './components/CreateFundraiser';
import Donate from './components/Donate';

// Initialize Stripe with publishable key
const stripePromise = loadStripe('pk_test_51Q8huvRqsL96moUE5s74nxZqK4oXdlIZrUv85w9H1WeC0FPqkdEQVFQTYEdslUlV60I42BqamrD6tVFNhnO6JDfy00xlI2niqc');

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-fundraiser" element={<CreateFundraiser />} />
        <Route path="/fundraisers/:fundraiserId/donate" element={<Donate />} />
      </Routes>
      </Elements>
    </Router>
  );
};

export default App;