import PropTypes from "prop-types";

export default function Footer({onBackToTop}) {
  return (
    <div className="relative w-[1065px] h-[173px] bg-white rounded-[8px] mx-auto my-0">
      <div className="mt-16" />

      {/* Divider Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gray-300" />

      {/* Button */}
      <button 
        onClick={onBackToTop}
        className="absolute bottom-[16px] left-1/2 transform -translate-x-1/2 bg-[#2c2c2c] text-[#f5f5f5] text-[16px] font-normal px-[12px] py-[12px] rounded-[8px] shadow-md hover:bg-[#444] transition-all">
        Back To Top
      </button>
    </div>
  );
}

Footer.propTypes = {
  onBackToTop: PropTypes.func,
};

Footer.defaultProps = {
  onBackToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
};
