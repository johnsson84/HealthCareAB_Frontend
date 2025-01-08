import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom"; // För att läsa token från URL

const ResetPasswordContainer = styled.div`
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

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const token = searchParams.get("token"); // Läs token från URL

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          token,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );
      setMessage("Password successfully reset. Redirecting you to login.");
    } catch (err) {
      console.log(err);
      setMessage("Error resetting password. Please try again.");
    }
  };

  useEffect(() => {
    if (message === "Password successfully reset. Redirecting you to login.") {
      const sleeper = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(sleeper);
    }
  }, [message, navigate]);

  return (
    <ResetPasswordContainer>
      <Title>Reset Password</Title>
      <FormWrapper onSubmit={handlePasswordReset}>
        <label>New Password:</label>
        <StyledInput
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength="8"
          maxLength="20"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$"
          title="Password must be 8-20 characters, include uppercase, lowercase, and a number."
          required
        />
        <label>Confirm Password:</label>
        <StyledInput
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength="8"
          maxLength="20"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$"
          title="Password must be 8-20 characters, include uppercase, lowercase, and a number."
          required
        />
        <ResetPasswordButton type="submit">
          Set New Password
        </ResetPasswordButton>
        {message && <p>{message}</p>}
      </FormWrapper>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
