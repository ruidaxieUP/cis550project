import { useState } from "react";
import LiveSearch from "../components/LiveSearch";

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

  const handleChange = (e) => {
    const query = e.target.value.toLowerCase();
    if (!query.trim()) return setResults([]);

    const filteredResults = profiles.filter((profile) =>
      profile.name.toLowerCase().startsWith(query)
    );
    setResults(filteredResults);
  };

  return (
    <div className="main-container w-full h-[3165px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Header Section: Title and Subtitle */}
      {/* Title and Subtitle */}
      <div className="flex flex-col gap-[8px] items-center justify-center text-center relative z-[15] mt-[162px] mx-auto">
        <span className="font-['Inter'] text-[72px] font-bold leading-[86px] text-[#0c0c0d] tracking-[-2.16px] whitespace-nowrap z-[16]">
          Movie People DB
        </span>
        <span className="font-['Inter'] text-[32px] font-normal leading-[38px] text-[#0c0c0d] z-[17]">
          Exploring the individuals who bring stories to life.
        </span>
      </div>

      {/* Search Section */}
      <div className="flex w-[704px] h-[40px] justify-between items-center relative z-[23] mt-[32px] mr-0 mb-0 ml-[427px]">
        <LiveSearch
          results={results}
          value={selectedProfile?.name}
          renderItem={(item) => <p>{item.name}</p>}
          onChange={handleChange}
          onSelect={(item) => setSelectedProfile(item)}
        />
      </div>
    </div>
  );
}
