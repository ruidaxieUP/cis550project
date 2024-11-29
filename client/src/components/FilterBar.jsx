import PropTypes from "prop-types";

function FilterBar({ currentFilter, onChange }) {
  const filters = [
    { label: "Name Ascending", value: "name_asc" },
    { label: "Name Descending", value: "name_desc" },
    { label: "Popularity Ascending", value: "popularity_asc" },
    { label: "Popularity Descending", value: "popularity_desc" },
  ];

  return (
    <div className="flex gap-[8px]">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`flex p-[8px] justify-center items-center rounded-[8px] ${
            currentFilter === filter.value ? "bg-[#2c2c2c] text-[#f5f5f5]" : "bg-[#f5f5f5] text-[#757575]"
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterBar;
