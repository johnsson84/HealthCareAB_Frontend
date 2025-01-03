import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: row;
    border-bottom: 1px solid black;
    height: 3rem;
    width: 100%;
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
  const [historyStack, setHistoryStack] = useState([]);
  const hiddenPaths = ["/login", "/signup"];

  useEffect(() => {
    const currentPath = location.pathname;

    setHistoryStack((prevStack) => {
      if (prevStack[prevStack.length - 1] === currentPath) {
        return prevStack;
      }
      return [...prevStack, currentPath];
    });
  }, [location.pathname]);

  const handleReturn = () => {
    setHistoryStack((prevStack) => {
      const updatedStack = [...prevStack];
      updatedStack.pop();
      const previousPath = updatedStack[updatedStack.length - 1];
      navigate(previousPath);
      return updatedStack;
    });
  };

  const canGoBack =
    historyStack.length > 1 && // Ensure there is a previous page in the stack
    !hiddenPaths.includes(historyStack[historyStack.length - 2]) &&
    historyStack[historyStack.length - 2] !== location.pathname;

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <HeaderContainer>
      {canGoBack && <ReturnButton onClick={handleReturn}>return</ReturnButton>}
    </HeaderContainer>
  );
};

export default Header;
