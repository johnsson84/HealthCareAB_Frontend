import "./ButtonLink.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ButtonLink = ({ picture, linkName, link }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };

  return (
    <button className="ButtonLinkContainer" onClick={handleClick}>
      <div className="ButtonLinkPicture">
        <img src={picture}></img>
      </div>
      <p>{linkName}</p>
    </button>
  );
};


export default ButtonLink;


const ImageHolder = styled.img`
  max-width: 24px;
  max-height: 24px;
  border-radius: 50%;
  margin: 20px 0;
`;