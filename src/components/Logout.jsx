import axios from "axios";
import "./Logout.css";
// button to handle logout, you can change this as you want
// does not have to look or be like this but you can see how to use the logout call
const Logout = () => {
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8080/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <button className="bLogout" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
