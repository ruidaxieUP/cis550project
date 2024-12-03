import { useState, useEffect } from "react";
import Card from "../components//ImageCard/RecImageCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { fetchData } from "./utils";

export default function PersonPage() {
  const [filter, setFilter] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); 
  const [totalPages, setTotalPages] = useState(1); 
  const [backgroundImage, setBackgroundImage] = useState("");

  const pageSize = 16; 

  // // TODO Mock server-side data, will let the server handle this in the future
  // const fullData = Array.from({ length: 114 }, (_, index) => ({
  //   id: index,
  //   image: "https://via.placeholder.com/150",
  //   title: `Person ${index + 1}`,
  //   rating: (Math.random() * 10).toFixed(1),
  // }));

  // // Fetch data
  // useEffect(() => {
  //   const fetchPaginatedData = () => {
  //     const startIndex = (currentPage - 1) * pageSize;
  //     const paginatedData = fullData.slice(startIndex, startIndex + pageSize);
  
  //     setTotalPages(Math.ceil(fullData.length / pageSize));
  //     setData(paginatedData);
  //   };
  
  //   fetchPaginatedData();
  // }, [currentPage, filter]); //TODO - Add filter to dependency array
  
  // Fetch data
  useEffect(() => {
    fetchData(
      `persons?page=${currentPage}&pageSize=${pageSize}&filter=${filter}`,
      (result) => {
        setData(result.results);
        setTotalPages(result.totalPages);
      }
    );
  }, [currentPage, filter]);

  // Fetch random background image
  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates on unmounted components
    const fetchBackgroundImage = async () => {
      try {
        fetchData("random", (data) => {
          if (isMounted && data?.src) {
            setBackgroundImage(data.src);
          }
        });
      } catch (error) {
        console.error("Failed to fetch background image:", error);
      }
    };

    fetchBackgroundImage();

    return () => {
      isMounted = false; // Cleanup to prevent state updates
    };
  }, []);

   // Reset to first page on filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Header Section */}
      <div
        className="flex flex-col items-center justify-center w-full h-[570px] bg-[rgba(255,255,255,0.16)] bg-cover bg-no-repeat relative"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8, 
        }}
      >
      </div>

      {/* Content Section */}
      <div className="container mx-auto mt-[70px] px-4 flex flex-col items-center">
        <div className="w-[80%]">
          {/* Filter Bar */}
          <div className="flex justify-end mb-4">
            <FilterBar currentFilter={filter} onChange={handleFilterChange} />
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-4 gap-4">
            {data.map((item) => (
              <Card key={item.id} image={item.image} title={item.name} rating={parseFloat(item.popularity)} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
