import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminLogin from './pages/auth/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

// Component to handle admin routing
const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </Router>
  )
}

export default App
