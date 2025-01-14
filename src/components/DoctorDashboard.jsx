import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
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

function DoctorDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Doctor Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <div className="dbButtonContainer">
        <ButtonLink
          picture="/vite.svg"
          linkName="Appointment"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Schedule"
          link="/schedule"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Appointment History"
          link="/appointment/history"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Your Feedback"
          link="/underconstruction"
        ></ButtonLink>
      </div>
      <Logout />
    </AdminContainer>
  );
}

export default DoctorDashboard;
