import styled from "styled-components";
import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";
import DoctorShowOff from "./doctorShowOff/DoctorShowOff";
// start page
const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 28px;
`;

const LoginButton = styled.div`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  width: 14%;
  min-width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-top: 3rem;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;
const SignupButton = styled.div`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  width: 14%;
  min-width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-top: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;
// -
const LogoContainer = styled.img`
  height: 20rem;
`;

const Home = () => (
  <>
    <HomeContainer>
      <LogoContainer src={Logo} />
      <Title>Health Care Appointment App</Title>
      <DoctorShowOff />
      <LoginButton>
        <Link className="link" to="/login">
          Login
        </Link>
      </LoginButton>
      <SignupButton>
        <Link className="link" to="/signup">
          Sign Up
        </Link>
      </SignupButton>
    </HomeContainer>
  </>
);

export default Home;
