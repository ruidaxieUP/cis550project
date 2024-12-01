import PropTypes from "prop-types";
import GenresContainer from "../GenresContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function RectangleImageCard({ image, title, rating, genres }) {
  const cardWidth = 240; 
  const genrePadding = 16; 
  const fontSize = 16; 

  const calculateTextWidth = (text) => {
    const charWidth = fontSize * 0.6;
    return text.length * charWidth + genrePadding;
  };

  let totalWidth = 0;
  const visibleGenres = [];

  for (const genre of genres) {
    const genreWidth = calculateTextWidth(genre.name);
    if (totalWidth + genreWidth > cardWidth) {
      break; 
    }
    totalWidth += genreWidth;
    visibleGenres.push(genre);
  }

  return (
    <div className="flex flex-col w-[240px] p-[16px] bg-[#fff] rounded-[8px] border border-[#d9d9d9]">
      {/* Image */}
      <div
        className="w-full h-[247px] bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-[#1e1e1e]">{title}</h3>

      {/* Rating with Heart Icon */}
      <div className="flex gap-[8px] items-center mt-2">
        <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-[16px] h-[16px]" />
        <span className="font-['Inter'] text-[16px] text-[#757575]">{rating}</span>
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-[8px] mt-4">
        <GenresContainer genres={visibleGenres} />
      </div>
    </div>
  );
}

RectangleImageCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
