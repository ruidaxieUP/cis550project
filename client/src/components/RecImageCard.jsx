import PropTypes from "prop-types";

export default function Card({ image, title, rating }) {
    return (
      <div className="flex flex-col w-[241px] h-[346px] p-[16px] bg-[#fff] rounded-[8px] border border-[#d9d9d9]">
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
          {/* Heart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[16px] h-[16px] text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C14.46 4.99 15.96 4 17.5 4 20.01 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
  
          {/* Rating */}
          <span className="font-['Inter'] text-[16px] text-[#1e1e1e]">{rating}</span>
        </div>
      </div>
    );
  }
  

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};
