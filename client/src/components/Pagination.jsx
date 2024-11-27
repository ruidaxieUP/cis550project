import PropTypes from "prop-types";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex gap-[8px]">
      <button
        className="p-[8px] rounded-[8px] text-[#757575] disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-[#1e1e1e]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="p-[8px] rounded-[8px] text-[#757575] disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
