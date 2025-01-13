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
          picture="/src/assets/Message Chat 01.svg"
          linkName="Appointment"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Calendar 02.svg"
          linkName="Schedule"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/User Profile Add 01.svg"
          linkName="register Admin"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/User Profile Add 01.svg"
          linkName="register Doctor"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Annotation Information.svg"
          linkName="Your Feedback"
          link="/underconstruction"
        ></ButtonLink>
      </div>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
