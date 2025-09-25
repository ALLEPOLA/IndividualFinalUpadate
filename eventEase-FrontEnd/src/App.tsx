import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WebSocketProvider } from './contexts/WebSocketContext'
import Header from './components/Header'
import Homepage from './pages/homepage/homepage'
import About from './pages/about/about'
import Contact from './pages/contact/contact'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import EmailVerification from './pages/auth/EmailVerification'
import { UserDashboard } from './pages/dashboards/userDashboard/UserDashboard'
import { VendorDashboard } from './pages/dashboards/vendorDashboard/VendorDashboard'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import PaymentCancelled from './pages/payment/PaymentCancelled'

// Component to conditionally show navigation
const AppContent = () => {
  const location = useLocation();
  
  // Hide navigation on dashboard pages
  const hideNavigation = location.pathname.startsWith('/dashboard');
  
  return (
    <div className="App">
      {!hideNavigation && <Header />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <AppContent />
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
