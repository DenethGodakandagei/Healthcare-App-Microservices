import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';
import ConfirmBookingPage from './pages/ConfirmBookingPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import Overview from './components/doctor/Overview';
import Appointments from './components/doctor/Appointments';
import Availability from './components/doctor/Availability';
import Credentials from './components/doctor/Credentials';
import Notifications from './components/doctor/Notifications';
import VideoCallPage from './pages/VideoCallPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/booking/:doctorId" element={<BookingPage />} />
          <Route path="/confirm-booking/:doctorId/:sessionId" element={<ConfirmBookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient protected route */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor protected route with nested sub-routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="physical" element={<Appointments />} />
            <Route path="availability" element={<Availability />} />
            <Route path="credentials" element={<Credentials />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Video Call (protected - both doctor and patient) */}
          <Route
            path="/video-call/:sessionId"
            element={
              <ProtectedRoute>
                <VideoCallPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
