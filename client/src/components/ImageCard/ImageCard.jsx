import PropTypes from "prop-types";
import { useLazyLoad } from "../useLazyLoad"; 
import { Link } from "react-router-dom";


const ImageCard = ({ image, name, personId }) => {
  const { imgRef, isVisible } = useLazyLoad();

  return (
    <div className="main-container w-[182px] h-[235.401px] text-[0px] relative mx-auto my-0">
      {/* Name */}
      <Link
        to={`/persons/${personId}`}
        className="flex w-[176.551px] h-[23.976px] justify-center items-center text-[16px] font-semibold leading-[22.4px] text-[#000] relative text-center whitespace-nowrap z-[1] mt-[211.425px] mr-0 mb-0 ml-[2.18px]"
      >
        {name}
      </Link>

      {/* Circular Image with Lazy Loading */}
      <div
        ref={imgRef}
        className="w-full h-[75.93%] rounded-full bg-cover bg-center bg-no-repeat absolute top-0 left-0"
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

ImageCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  personId: PropTypes.number.isRequired,
};

export default ImageCard;
