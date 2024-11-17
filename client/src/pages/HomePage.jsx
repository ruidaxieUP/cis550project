import { useState } from "react";
import LiveSearch from "../components/LiveSearch";

import ImageSlider from "../components/ImageSlider";

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

const data = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png",
    title: "FirstName LastName",
  },
  // Add more image objects here...
];

export default function HomePage() {
  {
    /*Temporary search result*/
  }
  const [results, setResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
      <div className="flex flex-col items-center justify-center w-full h-[570px] bg-[rgba(255,255,255,0.16)] bg-[url(../assets/images/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png)] bg-cover bg-no-repeat relative">
        {/* Title and Subtitle */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <span className="font-['Inter'] text-[72px] font-bold leading-[86px] text-[#0c0c0d] tracking-[-2.16px] whitespace-nowrap z-[16]">
            Movie People DB
          </span>
          <span className="font-['Inter'] text-[32px] font-normal leading-[38px] text-[#0c0c0d] z-[17]">
            Exploring the individuals who bring stories to life.
          </span>
        </div>

        {/* Search Section */}
        <div className="flex w-[704px] h-[40px] justify-between items-center relative z-[23] mt-8">
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

      <div className="mt-16" />

      {/* Image Slider Section */}
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider title="Top 10 Most Popular Directors" data={data} />
      </div>

      <div className="mt-16" />

      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider title="Top 10 Most Popular Actors" data={data} />
      </div>

      <div className="mt-16" />

      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider title="Top 10 Most Popular Actresses" data={data} />
      </div>

      
    </div>
  );
}
