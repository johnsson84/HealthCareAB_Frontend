import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordForgotten = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      setMessage("The reset link sent! Please check your email.");
    } catch (error) {
      setMessage("Error sending the reset link. Please try again.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handlePasswordForgotten}>Send Reset Link</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;