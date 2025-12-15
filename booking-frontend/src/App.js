// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import komponen
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminBookings from "./pages/AdminBookings";
import AdminChat from "./pages/AdminChat";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          {/* Landing Page sebagai halaman utama */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </main>
    </Router>
  );
}

export default App;