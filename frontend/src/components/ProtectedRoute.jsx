import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

function ProtectedRoute({ children }) {
  // If not logged in, redirect to login page
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return children;
}

export default ProtectedRoute;