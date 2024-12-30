import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// unauthorized page that shows if a user tries to access a page and does
// not have the correct role for it
const UnauthorizedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 30px;
  color: #eb4d1b;
`;

const Text = styled.p`
  font-size: 18px;
`;

const Button = styled.div`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
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

function Unauthorized() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // navigate back to the previous page
  };

  return (
    <UnauthorizedContainer>
      <Title>Unauthorized</Title>
      <Text>You do not have permission to view this page.</Text>
      <Button onClick={goBack}>Go Back</Button>
    </UnauthorizedContainer>
  );
}

export default Unauthorized;
