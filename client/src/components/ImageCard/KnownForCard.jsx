import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Card({ posterPath, movieName, characterName, rating, movieId }) {
  return (
    <div className="flex flex-col w-[240px] p-[16px] bg-[#fff] rounded-[8px] border border-[#d9d9d9]">
      {/* Image Section */}
      <div
        className="w-full h-[247px] bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url(${posterPath})`,
        }}
      ></div>

      {/* Title Section */}
      <div className="flex flex-col gap-[8px]">
        <Link
          to={`/movies/${movieId}`}
          className="text-[16px]  font-normal leading-[22px] text-[#1e1e1e] hover:underline"
        >
          {movieName}
        </Link>
      </div>

      {/* Subtitle Section */}
      <div className="flex">
        <span className="text-[16px] font-semibold text-[#1e1e1e]">
          {characterName}
        </span>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-[8px] mt-auto mb-[10px]">
        <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-[16px] h-[16px]" />
        <span className="text-[16px] text-[#757575]">{rating}</span>
      </div>
    </div>
  );
}

Card.propTypes = {
  posterPath: PropTypes.string.isRequired, 
  movieName: PropTypes.string.isRequired, 
  characterName: PropTypes.string.isRequired, 
  rating: PropTypes.number.isRequired, 
  movieId: PropTypes.number.isRequired,

};
