import { useEffect, useState } from "react";
import LiveSearch from "../components/LiveSearch";
import ImageSlider from "../components/ImageSlider";
import { PairImageSlider } from "../components/ImageSlider";
import { fetchData } from "./utils";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [maleActors, setMaleActors] = useState([]);
  const [femaleActors, setFemaleActors] = useState([]);
  const [pairingsData, setPairingsData] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch top data
    const fetchTopData = async () => {
      try {
        await Promise.all([
          fetchData("top-directors", setDirectors),
          fetchData("top-actors", setMaleActors),
          fetchData("top-actresses", setFemaleActors),
          fetchData("top-combos", setPairingsData),
        ]);
      } catch (error) {
        console.error("Error fetching top data:", error);
      }
    };
    fetchTopData();
  }, []);

  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates on unmounted components
    const fetchBackgroundImage = async () => {
      try {
        fetchData("random?screen=homepage", (data) => {
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
      isMounted = false; // Cleanup guard
    };
  }, []);

  const handleSearch = () => {
    if (selectedProfile && selectedProfile.id) {
      navigate(`/persons/${selectedProfile.id}`);
    } else {
      alert("Please select a profile first.");
    }
  };

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Header Section */}
      <div
        className="flex flex-col items-center justify-center w-full h-[570px] bg-cover bg-no-repeat relative"
        style={{ position: "relative" }}
      >
        {/* Background Image Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            zIndex: 1,
          }}
        ></div>

        {/* Title and Subtitle */}
        <div className="flex flex-col items-center justify-center mb-8 text-center relative z-[2]">
          <span className="text-[72px] font-bold leading-[86px] text-[#0c0c0d] tracking-[-2.16px] whitespace-nowrap">
            Movie People DB
          </span>
          <span className="text-[32px] font-normal leading-[38px] text-[#0c0c0d]">
            Exploring the individuals who bring stories to life.
          </span>
        </div>

        {/* Search Section */}
        <div className="flex w-[704px] h-[40px] justify-between items-center relative z-[2] mt-8">
          <LiveSearch
            apiEndpoint="http://localhost:8080/api/search-persons"
            value={selectedProfile?.name}
            onChange={() => setSelectedProfile(null)}
            onSelect={(item) => setSelectedProfile(item)}
          />
          <button
            onClick={handleSearch}
            className="flex h-[40px] w-[77px] ml-[12px] items-center justify-center bg-[#2c2c2c] rounded-[8px] border border-[#2c2c2c] shadow-md hover:bg-[#444] transition-all"
          >
            <span className="text-[16px] font-normal leading-[16px] text-[#f5f5f5]">
              Search
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mt-16" />

      {/* Top Directors */}
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider title="Top 10 Most Popular Directors" data={directors} />
      </div>

      {/* Top Actors */}
      <div className="mt-16" />
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider title="Top 10 Most Popular Actors" data={maleActors} />
      </div>

      {/* Top Actresses */}
      <div className="mt-16" />
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider
          title="Top 10 Most Popular Actresses"
          data={femaleActors}
        />
      </div>

      {/* Top Director-Actor Pairings */}
      <div className="mt-16" />
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <PairImageSlider
          title="Top 10 Director-Actor Pairings with Highest Ratings"
          data={pairingsData}
        />
      </div>
    </div>
  );
}
