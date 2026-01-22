import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GivePraise from './pages/GivePraise';
import MyProfile from './pages/MyProfile';
import Rewards from './pages/Rewards';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { authService } from './services/auth';

function AppContent() {
  const location = useLocation();  // This causes re-render on navigation
  const isAuthenticated = authService.isAuthenticated();

  return (
    <>
      {isAuthenticated && <Navbar />}
      
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/give-praise"
          element={
            <ProtectedRoute>
              <GivePraise />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;