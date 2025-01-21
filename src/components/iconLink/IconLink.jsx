import "../iconLink/IconLink.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const IconLink = ({ iconPicture, link }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };

  return (
    <button className="IconLink" onClick={handleClick}>
      <div className="IconLinkPicture">
        <img className="IconImg" src={iconPicture}></img>
      </div>
    </button>
  );
};
export default IconLink;


