import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import ButtonLink from "./dashboard/ButtonLink";
import "./Dashboard.css";

// div with styles
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
// img with styles
const LogoContainer = styled.img`
  height: 20rem;
`;
// h2 with styles
const Title = styled.h2`
  font-size: 22px;
`;
// p with styles
const Text = styled.p`
  font-size: 18px;
`;

function UserDashboard() {
  // using custom hook to check if the user is authenticated and has the correct role
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <UserContainer>
      <LogoContainer src={Logo} />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <div className="dbButtonContainer">
       
        <ButtonLink
          picture="/src/assets/User Profile Check.svg"
          linkName="Book Doctor"
          link="/calendar"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Calendar 02.svg"
          linkName="Upcoming Appointments"
          link="/appointment"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Inbox 02.svg"
          linkName="Appointment History"
          link="/appointment/history"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Annotation Information.svg"
          linkName="Give Feedback"
          link="/feedback"
        ></ButtonLink>
      </div>
      <Logout />
    </UserContainer>

    /*  
   Så här hade det sett ut utan styled components
   då hade vi kanske lagt homeContainer som en css klass med samma styles 
   som ovan osv.
   <div>
     <img src={Logo} />
     <h2>User Dashboard</h2>    
     <p>Welcome, {user}</p>
     <button>Logout</button>
   </div> */
  );
}

export default UserDashboard;
