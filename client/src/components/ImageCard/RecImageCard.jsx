import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLazyLoad } from "../useLazyLoad"; 

export default function Card({ image, title, rating, itemId, type }) {
  const { imgRef, isVisible } = useLazyLoad();
  const linkTo = type === "person" ? `/persons/${itemId}` : `/movies/${itemId}`;

  return (
    <div className="flex flex-col w-[241px] h-[346px] p-[16px] bg-[#fff] rounded-[8px] border border-[#d9d9d9]">
      {/* Image Section */}
      <div
        ref={imgRef}
        className="w-full h-[247px] bg-gray-300 rounded-md mb-4"
        style={{
          backgroundImage: isVisible ? `url(${image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!isVisible && <div className="w-full h-full bg-gray-300" />} {/* Placeholder */}
      </div>

      {/* Title as Link */}
      <Link
        to={linkTo}
        className="text-[16px] font-semibold text-[#1e1e1e] hover:underline"
      >
        {title}
      </Link>

      {/* Rating with Heart Icon */}
      <div className="flex gap-[8px] items-center mt-2">
        {/* Heart Icon */}
        <FontAwesomeIcon
          icon={faHeart}
          className="text-red-500 w-[16px] h-[16px]"
        />

        {/* Rating */}
        <span className="text-[16px] text-[#1e1e1e]">
          {rating}
        </span>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  itemId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["movie", "person"]).isRequired,
};
