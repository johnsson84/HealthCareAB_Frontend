import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import CalendarPage from "./components/Calendar/Calendar";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import GlobalStyle from "./styles/GlobalStyle";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ResetPassword from "./components/resetPassword/ResetPassword";
import Header from "./components/Header";
import UnderConstruction from "./components/UnderConstructionPage";
import AppointmentIncomingList from "./components/appointments/UserAppointment";
import AppointmentIncomingListDoctor from "./components/appointments/DoctorAppointent";
import Footer from "./components/footer/Footer";
import Feedback from "./components/feedback/Feedback";
import Appointment_info from "./components/Appointment-info/A_info";
import Schedule from "./components/Schedule/Schedule";
import ChangePfp from "./components/AWS/ChangePfp";
import MeetingHistory from "./pages/appointmentHistory/AppointmentHistory";
import AppointmentHistory from "./pages/appointmentHistory/AppointmentHistory";
import Facility from "./components/facility/Facility";

function App() {

  

  return (
    <AuthProvider>
      <GlobalStyle />
      <div className="content">
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/user/dashboard"
              element={
                <RequireAuth allowedRoles={["USER"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/appointment/info/:appointmentId"
              element={
                <RequireAuth allowedRoles={["USER", "DOCTOR"]}>
                  <Appointment_info />
                </RequireAuth>
              }
            />
            <Route path="/change-profile-picture" element={
              <RequireAuth allowedRoles={["USER", "ADMIN"]}>
              <ChangePfp />
              </RequireAuth>} />
            <Route
              path="/appointment/history"
              element={
                <RequireAuth allowedRoles={["USER", "DOCTOR"]}>
                  <AppointmentHistory />
                </RequireAuth>
              }
            />

            <Route path="/underconstruction" element={<UnderConstruction />} />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <RequireAuth allowedRoles={["DOCTOR"]}>
                  <DoctorDashboard />
                </RequireAuth>
              }
            />
            <Route path="/profile" element={<Profile></Profile>} />

             <Route path="/appointment" element={
                <RequireAuth allowedRoles={["USER"]}>
                  <AppointmentIncomingList />
                </RequireAuth>
              } />
             

             <Route path="/Dappointment" element={
                <RequireAuth allowedRoles={["DOCTOR"]}>
                  <AppointmentIncomingListDoctor />
                </RequireAuth>
              }/>
             
            <Route
              path="/schedule"
              element={
                <RequireAuth allowedRoles={["DOCTOR"]}>
                  <Schedule></Schedule>
                </RequireAuth>
              }
            />
            
            <Route path="/contact" element={<Facility/>} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
