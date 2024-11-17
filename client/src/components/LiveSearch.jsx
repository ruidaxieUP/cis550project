import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function LiveSearch({ results = [], value, onChange, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const resultContainer = useRef(null);
  const [defaultValue, setDefaultValue] = useState("");

  const handleSelection = (selectedIndex) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect && onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = () => {
    setFocusedIndex(-1);
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    if (key === "ArrowDown")
      nextIndexCount = (focusedIndex + 1) % results.length;
    if (key === "ArrowUp")
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;
    if (key === "Escape") {
      resetSearchComplete();
    }
    if (key === "Enter") {
      e.preventDefault();
      handleSelection(focusedIndex);
    }
    setFocusedIndex(nextIndexCount);
  };

  const handleChange = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  useEffect(() => {
    if (!resultContainer.current) return;

    resultContainer.current.scrollIntoView({
      block: "center",
    });
  }, [focusedIndex]);

  useEffect(() => {
    setShowResults(results.length > 0);
  }, [results]);

  useEffect(() => {
    if (value) setDefaultValue(value);
  }, [value]);

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Search Bar */}
      <div className="flex w-[600px] pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] items-center flex-nowrap bg-[#fff] rounded-full border-solid border border-[#d9d9d9] relative overflow-hidden shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <div className="w-[16px] h-[16px] z-20">
          <input
            value={defaultValue}
            onChange={handleChange}
            type="text"
            onKeyDown={handleKeyDown}
            className="w-[704px] h-[40px] shrink-0 bg-transparent border-none absolute top-0 left-0 z-[22] pl-[16px]"
            placeholder="Placeholder"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div
          className="absolute w-[600px] bg-white shadow-lg rounded-bl-lg rounded-br-lg max-h-56 overflow-y-auto"
          style={{
            top: "100%", // Position directly below the search box
            zIndex: 50, // Ensure it appears above other content
          }}
        >
          {results.map((item, index) => (
            <div
              key={index}
              onMouseDown={() => handleSelection(index)}
              ref={index === focusedIndex ? resultContainer : null}
              style={{
                backgroundColor:
                  index === focusedIndex ? "rgba(0, 0, 0, 0.1)" : "",
              }}
              className="flex w-full h-[79px] items-center px-[16px] py-[12px] cursor-pointer hover:bg-black hover:bg-opacity-10"
            >
              {/* Left: Image */}
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <img
                  src={item.image || "default-image-path.jpg"} // Default image path
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right: Text */}
              <div className="ml-[16px]">
                <p className="text-[16px] font-normal leading-[22px] text-[#1e1e1e]">
                  {item.name}
                </p>
                <p className="text-[14px] font-normal leading-[19.6px] text-[#757575]">
                  {item.known_for || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

LiveSearch.propTypes = {
  results: PropTypes.array.isRequired,
  renderItem: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default LiveSearch;
