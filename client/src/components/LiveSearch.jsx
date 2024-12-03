import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function LiveSearch({ apiEndpoint, value, onChange, onSelect }) {
  const [results, setResults] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const resultContainer = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  const fetchResults = async (query, page) => {
    if (!query.trim() || !hasMore || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${apiEndpoint}?query=${query}&page=${page}&pageSize=10`
      );
      const data = await response.json();
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setDefaultValue(query);
    setResults([]);
    setCurrentPage(1);
    setHasMore(true);
    onChange && onChange(query);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);


    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query, 1);
      }
    }, 300); // Adjust debounce delay (in milliseconds) as needed
  };

  const handleScroll = () => {
    if (!dropdownRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      fetchResults(defaultValue, currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSelection = (selectedIndex) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return;
    onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = () => {
    setFocusedIndex(-1);
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    let nextIndexCount = focusedIndex;

    if (key === "ArrowDown")
      nextIndexCount = (focusedIndex + 1) % results.length;
    if (key === "ArrowUp")
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;
    if (key === "Escape") resetSearchComplete();
    if (key === "Enter") {
      e.preventDefault();
      handleSelection(focusedIndex);
    }
    setFocusedIndex(nextIndexCount);
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

  useEffect(() => {
    // Clear debounce timer on component unmount
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="relative w-[600px]">
      {/* Search Bar */}
      <div className="flex w-full pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] items-center flex-nowrap bg-[#fff] rounded-full border-solid border border-[#d9d9d9] relative overflow-hidden shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
        <input
          value={defaultValue}
          onChange={handleChange}
          type="text"
          onKeyDown={handleKeyDown}
          className="w-full h-[40px] bg-transparent border-none"
          placeholder="Search..."
        />
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute w-full bg-white shadow-lg rounded-bl-lg rounded-br-lg max-h-56 overflow-y-auto"
          onScroll={handleScroll}
        >
          {results.map((item, index) => (
            <div
              key={item.id}
              onMouseDown={() => handleSelection(index)}
              ref={index === focusedIndex ? resultContainer : null}
              style={{
                backgroundColor:
                  index === focusedIndex ? "rgba(0, 0, 0, 0.1)" : "",
              }}
              className="flex w-full h-[79px] items-center px-[16px] py-[12px] cursor-pointer hover:bg-black hover:bg-opacity-10"
            >
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <img
                  src={item.profile_path || "default-image-path.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-[16px]">
                <p className="text-[16px] font-normal leading-[22px] text-[#1e1e1e]">
                  {item.name}
                </p>
                <p className="text-[14px] font-normal leading-[19.6px] text-[#757575]">
                  {item.known_for_department || "Unknown"}
                </p>
              </div>
            </div>
          ))}
          {loading && <p className="p-2 text-center">Loading...</p>}
          {!hasMore && <p className="p-2 text-center text-gray-500">No more results</p>}
        </div>
      )}
    </div>
  );
}

LiveSearch.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default LiveSearch;
