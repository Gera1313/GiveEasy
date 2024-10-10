import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateFundraiser from './components/CreateFundraiser';
import Donate from './Donate';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-fundraiser" element={<CreateFundraiser />} />
        <Route path="/fundraisers/:fundraiserId/donate" component={Donate} />
      </Routes>
    </Router>
  );
};

export default App;