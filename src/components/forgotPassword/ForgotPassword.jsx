import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

const ForgotPasswordContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const ResetPasswordButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 20px;
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

const Title = styled.h2`
  font-size: 22px;
`;

const FormWrapper = styled.form`
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  gap: 10px;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 0px;

  &:focus {
    outline: none;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const errorHandler = (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 403:
          return "Not Allowed: You are not gruanted access.";
        case 404:
            return "Email not found. Check email and try again";      
        default:
          return "Error sending the reset link. Please try again later.";
      }
    } else {
      return "An unexpected error occurred. Please try again later."
    }
  };


  const handlePasswordForgotten = async (e) => {
    e.preventDefault();
    setMessage(""); // tömmer föregående meddelande
    setError(false); // resättar error statet

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Enter a valid email address.");
      setError(true);
      return;
    }

    try {
      setLoading(true); 
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email: email.trim(), // tar bort mellanslag
      });
      setMessage("The reset link was sent! Please check your email.");

    } catch (err) {
      console.error(err);
      setMessage(errorHandler(err));
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <Title>Forgot Password</Title>
      <FormWrapper onSubmit={handlePasswordForgotten}>
        <lable>E-mail:</lable>
        <StyledInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ResetPasswordButton type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</ResetPasswordButton>
        {message && (
          <p style={{ color: error ? "red" : "green", marginTop: "10px" }}>
            {message}
          </p>
        )}
      </FormWrapper>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
