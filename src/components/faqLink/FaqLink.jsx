import "../faqLink/FaqLink.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const IconLink = ({ iconPicture, link, linkName }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className="FaqLinkContainer">
    <button className="FaqIconLink" onClick={handleClick}>
      <div className="IconLinkPicture">
        <img className="FaqIconImg" src={iconPicture}></img>
      </div>
    </button>
    <span className="FaqIconText">{linkName}</span>
    </div>
  );
};
export default IconLink;
