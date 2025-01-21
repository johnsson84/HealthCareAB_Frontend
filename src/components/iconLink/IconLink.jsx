import "../iconLink/IconLink.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const IconLink = ({ iconPicture, link, linkName }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className="LinkContainer">
    <button className="IconLink" onClick={handleClick}>
      <div className="IconLinkPicture">
        <img className="IconImg" src={iconPicture}></img>
      </div>
    </button>
    <p className="IconText">{linkName}</p>
    </div>
  );
};
export default IconLink;


