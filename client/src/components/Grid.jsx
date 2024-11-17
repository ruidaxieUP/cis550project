import ImageCard from "./ImageCard";
import PropTypes from "prop-types";

const Grid = ({ images }) => {
  return (
    <div className="grid grid-cols-5 gap-[24px] mt-[31px]">
      {images.map((image, index) => (
        <ImageCard key={index} imageSrc={image.src} title={image.title} />
      ))}
    </div>
  );
};

Grid.propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

export default Grid;
