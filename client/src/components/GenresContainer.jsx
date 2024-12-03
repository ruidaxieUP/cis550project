import PropTypes from "prop-types";
import GenreButton from "./GenreButton";

function GenresContainer({ genres }) {
  return (
    <div className="flex flex-wrap gap-[8px] mt-2">
      {genres.map(({ id, name }) => (
        <GenreButton key={id} genreId={id} genre={name} />
      ))}
    </div>
  );
}


GenresContainer.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default GenresContainer;
