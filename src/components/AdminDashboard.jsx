import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Footer from "./footer/Footer";
import Logout from "./Logout";
import ButtonLink from "./dashboard/ButtonLink";
import "./Dashboard.css";
// admin page, can only visit if you have role ADMIN
const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <div className="dbButtonContainer">
        <ButtonLink
          picture="/vite.svg"
          linkName="Appointment"
          link="/signup"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Calendar"
          link=""
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Notifications"
          link=""
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Your Feedback"
          link=""
        ></ButtonLink>
      </div>
      <Logout />
      <Footer userType="doctor" />
    </AdminContainer>
  );
}

export default AdminDashboard;
