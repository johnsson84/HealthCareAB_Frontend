import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Footer from "./footer/Footer";
import Logout from "./Logout";
import Calendar from "react-calendar";

function UserDashboard() {
  // using custom hook to check if the user i authenticated and has the correct role
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  const onChange = (date) => {
    console.log(date);
  }

  return (
    <UserContainer>
      <LogoContainer src={Logo} />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <AvailableTimes>
        <StyledCalendar></StyledCalendar>
      </AvailableTimes>
      <BookAppointmentButton onClick={() => console.log("clicked")}>Book Appointment</BookAppointmentButton>
      <Logout />
      <Footer userType="patient" />
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
const AvailableTimes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 400;
  font-family: "Roboto", sans-serif;
  border: 2px solid #057d7a;
  padding: 20px;
  background-color: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .react-calendar__navigation {
    margin-bottom: 10px;
  }
  `;
const BookAppointmentButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

export default UserDashboard;
