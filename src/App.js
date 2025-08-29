import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventCreation from './pages/EventCreation';
import UserDashboard from './pages/UserDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Header from './components/Header';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '80px' }}>{/* offset for fixed navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/event-create" element={<EventCreation />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
