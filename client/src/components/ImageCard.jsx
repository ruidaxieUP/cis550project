import PropTypes from "prop-types";

const ImageCard = ({ imageSrc, title }) => {
  return (
    <div className="w-[182px] h-[235.401px] shrink-0 relative z-[56]">
      {/* Image */}
      <div
        className="w-[182px] h-[178.731px] bg-no-repeat bg-[length:100%_100%] relative z-[57] mt-0 mr-0 mb-0 ml-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      />
      {/* Title */}
      <span className="flex w-[176.551px] h-[23.976px] justify-center items-center font-['Inter'] text-[16px] font-semibold leading-[22.4px] text-[#000] relative text-center whitespace-nowrap z-[58] mt-[32.695px] mr-0 mb-0 ml-[2.18px]">
        {title}
      </span>
    </div>
  );
};

ImageCard.propTypes = {
  imageSrc: PropTypes.string.isRequired, // URL for the image
  title: PropTypes.string.isRequired, // Title for the card
};

export default ImageCard;
