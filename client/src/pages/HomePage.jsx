import { useEffect, useState } from "react";
import LiveSearch from "../components/LiveSearch";

import ImageSlider from "../components/ImageSlider";
import { PairImageSlider } from "../components/ImageSlider";

const fetchData = async (endpoint, setData) => {
  try {
    const response = await fetch(`http://localhost:8080/api/${endpoint}`);
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  }
};

{
  /*Temporary search profiles*/
}
const profiles = [
  { id: "1", name: "Allie Grater" },
  { id: "2", name: "Aida Bugg" },
  { id: "3", name: "Gabrielle" },
  { id: "4", name: "Grace" },
  { id: "5", name: "Hannah" },
  { id: "6", name: "Heather" },
  { id: "7", name: "John Doe" },
  { id: "8", name: "Anne Teak" },
  { id: "9", name: "Audie Yose" },
  { id: "10", name: "Addie Minstra" },
  { id: "11", name: "Anne Ortha" },
];

export default function HomePage() {
  {
    /*Temporary search result*/
  }
  const [results, setResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [directors, setDirectors] = useState([]);
  const [maleActors, setMaleActors] = useState([]);
  const [femaleActors, setFemaleActors] = useState([]);
  const [pairingsData, setPairingsData] = useState([]);

  useEffect(() => {
    fetchData("top-directors", setDirectors);
    fetchData("top-actors", setMaleActors);
    fetchData("top-actresses", setFemaleActors);
    fetchData("top-combos", setPairingsData);
  }, []);

  const handleChange = (e) => {
    const query = e.target.value.toLowerCase();
    if (!query.trim()) return setResults([]);

    const filteredResults = profiles.filter((profile) =>
      profile.name.toLowerCase().startsWith(query)
    );
    setResults(filteredResults);
  };

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Header Section: Title and Subtitle */}
      <div
        className="flex flex-col items-center justify-center w-full h-[570px] bg-cover bg-no-repeat relative"
        style={{
          position: "relative",
        }}
      >
        {/* Background Image Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url('https://image.tmdb.org/t/p/w500/hQ4pYsIbP22TMXOUdSfC2mjWrO0.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4, // Adjust opacity here
            zIndex: 1,
          }}
        ></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center mb-8 text-center relative z-[2]">
          <span className="font-['Inter'] text-[72px] font-bold leading-[86px] text-[#0c0c0d] tracking-[-2.16px] whitespace-nowrap">
            Movie People DB
          </span>
          <span className="font-['Inter'] text-[32px] font-normal leading-[38px] text-[#0c0c0d]">
            Exploring the individuals who bring stories to life.
          </span>
        </div>

        {/* Search Section */}
        <div className="flex w-[704px] h-[40px] justify-between items-center relative z-[2] mt-8">
          <LiveSearch
            results={results}
            value={selectedProfile?.name}
            renderItem={(item) => <p>{item.name}</p>}
            onChange={handleChange}
            onSelect={(item) => setSelectedProfile(item)}
          />
          {/* Button */}
          <button className="flex h-[40px] w-[77px] ml-[12px] items-center justify-center bg-[#2c2c2c] rounded-[8px] border border-[#2c2c2c] shadow-md hover:bg-[#444] transition-all">
            <span className="font-['Inter'] text-[16px] font-normal leading-[16px] text-[#f5f5f5]">
              Search
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}

      {/* Image Slider Section */}
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
