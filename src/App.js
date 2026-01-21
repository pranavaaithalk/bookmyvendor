import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventCreation from './pages/EventCreation';
import UserDashboard from './pages/UserDashboard';
import VendorDashboard from './pages/VendorDashboard';
import VendorOnboarding from './pages/VendorOnboarding';
import Auth from './pages/Auth';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import EventDetailsPage from './components/EventDetailsPage';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: "80px" }}>
        {/* offset for fixed navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/event-details*" element={<ProtectedRoute userType="client"><EventDetailsPage /></ProtectedRoute>} />
          <Route
            path="/vendor-onboarding"
            element={
              <ProtectedRoute userType="client">
                <VendorOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-create"
            element={
              <ProtectedRoute userType="client">
                <EventCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute userType="client">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute userType="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          {/** Events route removed per request */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
