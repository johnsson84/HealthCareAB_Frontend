import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import IconLink from "./iconLink/IconLink";

const Header = () => {
  const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 1px solid black;
    height: 3rem;
    width: 100%;
  `;
  const UsernameContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    flex-direction: row;
    border-bottom: 1px solid black;
    height: 3rem;
    width: 100%;
    font-size: small;
  `;
  const ReturnButton = styled.button`
    color: black;
    background-color: white;
    border-style: none;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 2px 10px 2px 10px;
    font-size: medium;

    &:hover {
      background-color: #057d7a;
      cursor: pointer;
      color: white;
    }
  `;



  const navigate = useNavigate();
  const location = useLocation();
  const hiddenPaths = ["/login", "/signup", "/"];
  const username = localStorage.getItem("loggedInUsername");
  const [role, setRole] = useState(null);

  // Load initial history stack from localStorage
  const [historyStack, setHistoryStack] = useState(() => {
    const storedHistory = localStorage.getItem("historyStack");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  useEffect(() => {
    const currentPath = location.pathname;

    setHistoryStack((prevStack) => {
      const updatedStack = [...prevStack];
      if (updatedStack[updatedStack.length - 1] !== currentPath) {
        updatedStack.push(currentPath);
      }
      localStorage.setItem("historyStack", JSON.stringify(updatedStack));
      return updatedStack;
    });
  }, [location.pathname]);

  const handleReturn = () => {
    setHistoryStack((prevStack) => {
      const updatedStack = [...prevStack];
      updatedStack.pop();
      const previousPath = updatedStack[updatedStack.length - 1];
      navigate(previousPath || role + "/dashboard");
      localStorage.setItem("historyStack", JSON.stringify(updatedStack));
      return updatedStack;
    });
  };

  const canGoBack =
    historyStack.length > 1 &&
    !hiddenPaths.includes(historyStack[historyStack.length - 2]) &&
    historyStack[historyStack.length - 2] !== location.pathname;

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/check", {
        withCredentials: true,
      });
      setRole(response.data.roles[0]);
    } catch (error) {
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <HeaderContainer>
      {canGoBack && <ReturnButton onClick={handleReturn}>return</ReturnButton>}
      <UsernameContainer>
        <IconLink
          iconPicture="/src/assets/Hospital-locations.png"
          link="/contact"
          linkName="show hospitals"
        ></IconLink>
        <p className="loggedInP">
          {role === "USER" ? "Patient" : ""}
          {role === "ADMIN" ? "Admin" : ""}
          {role === "DOCTOR" ? "Doctor" : ""}: {username}
        </p>
      </UsernameContainer>
    </HeaderContainer>
  );
};

export default Header;
