import PropTypes from "prop-types";

const genreColors = {
  28: "#FF5733", // Action
  12: "#FFC300", // Adventure
  16: "#DAF7A6", // Animation
  35: "#C70039", // Comedy
  80: "#900C3F", // Crime
  99: "#581845", // Documentary
  18: "#2ECC71", // Drama
  10751: "#3498DB", // Family
  14: "#9B59B6", // Fantasy
  36: "#F39C12", // History
  27: "#E74C3C", // Horror
  10402: "#1ABC9C", // Music
  9648: "#34495E", // Mystery
  10749: "#E91E63", // Romance
  878: "#8E44AD", // Science Fiction
  10770: "#2980B9", // TV Movie
  53: "#D35400", // Thriller
  10752: "#7F8C8D", // War
  37: "#16A085", // Western
};

function GenreButton({ genreId, genre }) {
  const bgColor = genreColors[genreId] || "#424242"; // Default to dark gray if ID is missing

  return (
    <button
      className="flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[8px] border-none relative pointer"
      style={{ backgroundColor: bgColor }}
    >
      <span className="h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#f5f5f5] relative text-left whitespace-nowrap">
        {genre}
      </span>
    </button>
  );
}

GenreButton.propTypes = {
  genreId: PropTypes.number.isRequired,
  genre: PropTypes.string.isRequired,
};

export default GenreButton;
