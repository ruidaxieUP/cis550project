import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useLazyLoad } from "../useLazyLoad"; 

const CastImageCard = ({ image, characterName, actorName, actorId }) => {
  const { imgRef, isVisible } = useLazyLoad();

  return (
    <div className="main-container w-[182px] h-[235.401px] text-[0px] relative mx-auto my-0">
      {/* Character Name */}
      <span className="flex w-[176.551px] h-[23.976px] justify-center items-center text-[16px] font-semibold leading-[22.4px] text-[#000] relative text-center whitespace-nowrap mt-[193px] mr-0 mb-0 ml-0 z-[2]">
        {characterName}
      </span>

      {/* Actor Name as Link */}
      <Link
        to={`/persons/${actorId}`}
        className="flex w-[176.551px] h-[23.976px] justify-center items-center text-[16px] font-normal leading-[22.4px] text-[#000] relative text-center whitespace-nowrap z-[2] mt-[-5.551px] mr-0 mb-0 ml-0 hover:underline"
      >
        {actorName}
      </Link>

      {/* Circular Image with Lazy Loading */}
      <div
        ref={imgRef}
        className="w-full h-[75.93%] rounded-full bg-cover bg-center bg-no-repeat absolute top-0 left-0 z-[1]"
        style={{
          backgroundImage: isVisible ? `url(${image})` : "none",
        }}
      >
        {!isVisible && (
          <div className="w-full h-full bg-gray-300 rounded-full" />
        )}
      </div>
    </div>
  );
};

CastImageCard.propTypes = {
  image: PropTypes.string.isRequired,
  characterName: PropTypes.string.isRequired,
  actorName: PropTypes.string.isRequired,
  actorId: PropTypes.number.isRequired, // Actor ID for the link
};

export default CastImageCard;
