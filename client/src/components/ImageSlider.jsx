import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageCard from "./ImageCard"; // Ensure the path matches your folder structure

function ImageSlider({ title, data, sliderSettings }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Title Section */}
      <div className="w-full mb-6">
        <span className="w-full font-['Inter'] text-[24px] font-semibold leading-[29px] text-[#000] tracking-[-0.48px] text-left">
          {title}
        </span>
      </div>

      {/* Slider Section */}
      <div className="w-full">
        <Slider {...sliderSettings}>
          {data.map((item, index) => (
            <ImageCard key={index} image={item.src} name={item.title} />
          ))}
        </Slider>
      </div>
    </div>
  );
}

ImageSlider.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  sliderSettings: PropTypes.object,
};

ImageSlider.defaultProps = {
  sliderSettings: {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  },
};

export default ImageSlider;
