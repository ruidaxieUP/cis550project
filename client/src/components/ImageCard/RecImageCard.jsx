import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


export default function Card({ image, title, rating, movieId }) {
  return (
    <div className="flex flex-col w-[241px] h-[346px] p-[16px] bg-[#fff] rounded-[8px] border border-[#d9d9d9]">
      {/* Image */}
      <div
        className="w-full h-[247px] bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>

      {/* Title as Link */}
      <Link
        to={`/movies/${movieId}`}
        className="text-[16px] font-semibold text-[#1e1e1e] hover:underline"
      >
        {title}
      </Link>

      {/* Title
      <h3 className="text-[16px] font-semibold text-[#1e1e1e]">{title}</h3> */}

      {/* Rating with Heart Icon */}
      <div className="flex gap-[8px] items-center mt-2">
        {/* Heart Icon */}
        <FontAwesomeIcon
          icon={faHeart}
          className="text-red-500 w-[16px] h-[16px]"
        />

        {/* Rating */}
        <span className="font-['Inter'] text-[16px] text-[#1e1e1e]">
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
  movieId: PropTypes.number.isRequired,
};
