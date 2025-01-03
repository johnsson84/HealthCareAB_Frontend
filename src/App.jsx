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
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import GlobalStyle from "./styles/GlobalStyle";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import CaregiverProfile from "./components/Profile/Caregiver_profile";
import CalendarPage from "./components/Calendar/Calendar";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ResetPassword from "./components/resetPassword/ResetPassword";
import CalendarPage from "./components/Calendar/Calendar";
import Header from "./components/Header";
import UnderConstruction from "./components/UnderConstructionPage";

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
              path="/profile"
              element={
                <RequireAuth allowedRoles={["USER"]}>
                  <Profile></Profile>
                </RequireAuth>
              }
            />
            <Route
              path="/caregiverprofile"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <CaregiverProfile></CaregiverProfile>
                </RequireAuth>
              }
            />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
