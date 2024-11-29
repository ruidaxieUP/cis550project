import PropTypes from "prop-types";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Case 1: Show all pages if totalPages <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Case 2: Show 1, 2, 3, ..., last two pages
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex gap-[8px] items-center">
      {/* Previous Button */}
      <button
        className="p-[8px] rounded-[8px] text-[#757575] disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <div
            key={index}
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "flex w-[32px] pt-[8px] pr-[12px] pb-[8px] pl-[12px] flex-col justify-center items-center shrink-0 flex-nowrap bg-[#2c2c2c] rounded-[8px] relative cursor-pointer"
                : "flex w-[34px] pt-[8px] pr-[12px] pb-[8px] pl-[12px] flex-col justify-center items-center shrink-0 flex-nowrap rounded-[8px] relative z-[2] cursor-pointer"
            }
          >
            <span
              className={
                page === currentPage
                  ? "h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#f5f5f5] relative text-left whitespace-nowrap z-[1]"
                  : "h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#1e1e1e] relative text-left whitespace-nowrap z-[3]"
              }
            >
              {page}
            </span>
          </div>
        ) : (
          <span
            key={index}
            className="h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#757575] relative text-left whitespace-nowrap z-[3] pointer-events-none"
          >
            {page}
          </span>
        )
      )}

      {/* Next Button */}
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
