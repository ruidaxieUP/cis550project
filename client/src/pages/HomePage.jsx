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
      {/* Main Content Section */}
      <div className="flex w-[1071px] flex-col gap-[98px] items-end flex-nowrap relative z-[53] mt-[173px] mr-0 mb-0 ml-[183px]">
        {/* Section: Top 10 Most Popular Directors */}
        <div className="h-[310.401px] self-stretch shrink-0 relative z-[54]">
          {/* Section Title */}
          <div className="flex w-[260px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] flex-col gap-[10px] items-start flex-nowrap relative z-[73] mt-[-10px] mr-0 mb-0 ml-[-3px]">
            <div className="flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-[74]">
              <div className="w-[7px] h-[33px] shrink-0 bg-[url(../assets/images/2a75a28f-57c0-45c4-b55f-86e00a0636e4.png)] bg-cover bg-no-repeat relative z-[75]" />
              <span className="flex w-[337px] h-[29px] justify-center items-center shrink-0 basis-auto font-['Inter'] text-[24px] font-semibold leading-[29px] text-[#000] tracking-[-0.48px] relative text-center whitespace-nowrap z-[76]">
                Top 10 Most Popular Directors
              </span>
              <div className="w-[34px] h-[34px] shrink-0 relative overflow-hidden z-[77]">
                <div className="w-[12.5px] h-[21px] bg-[url(../assets/images/ab4c0d43-d5a5-4384-a345-424c2a230cff.png)] bg-[length:100%_100%] bg-no-repeat relative z-[78] mt-[6.5px] mr-0 mb-0 ml-[10.75px]" />
              </div>
            </div>
          </div>
          {/* Directors List */}
          <div className="flex w-[1071px] justify-between items-center flex-nowrap relative z-[55] mt-[31px] mr-0 mb-0 ml-0">
            {/* Director 1 */}
            <div className="w-[182px] h-[235.401px] shrink-0 relative z-[56]">
              <div className="w-[182px] h-[178.731px] bg-[url(../assets/images/5d1bb49d-d674-4074-adec-23a2ee395890.png)] bg-[length:100%_100%] bg-no-repeat relative z-[57] mt-0 mr-0 mb-0 ml-0" />
              <span className="flex w-[176.551px] h-[23.976px] justify-center items-center font-['Inter'] text-[16px] font-semibold leading-[22.4px] text-[#000] relative text-center whitespace-nowrap z-[58] mt-[32.695px] mr-0 mb-0 ml-[2.18px]">
                FirstName LastName
              </span>
            </div>
            {/* Director 2 */}
            {/* Repeat similar blocks for other directors */}
            {/* ... */}
            {/* Navigation Arrow */}
            <div className="w-[48px] h-[48px] shrink-0 relative overflow-hidden z-[71]">
              <div className="w-[16px] h-[28px] bg-[url(../assets/images/ce2dbf38-a87c-4c95-9e6d-81f456e90edc.png)] bg-[length:100%_100%] bg-no-repeat relative z-[72] mt-[10px] mr-0 mb-0 ml-[16px]" />
            </div>
          </div>
        </div>

        {/* Section: Top 10 Most Popular Actors */}
        <div className="w-[1063px] h-[309.401px] shrink-0 relative z-[79]">
          {/* Section Title */}
          <div className="flex w-[373px] gap-[12px] items-center flex-nowrap relative z-[98] mt-0 mr-0 mb-0 ml-[3px]">
            <div className="w-[7px] h-[33px] shrink-0 bg-[url(../assets/images/bcc910c8-77ea-44bf-9de1-3a8c7249f173.png)] bg-cover bg-no-repeat relative z-[99]" />
            <span className="flex w-[308px] h-[29px] justify-center items-center shrink-0 basis-auto font-['Inter'] text-[24px] font-semibold leading-[29px] text-[#000] tracking-[-0.48px] relative text-center whitespace-nowrap z-[100]">
              Top 10 Most Popular Actors
            </span>
            <div className="w-[34px] h-[34px] shrink-0 relative overflow-hidden z-[101]">
              <div className="w-[12.5px] h-[21px] bg-[url(../assets/images/1c0f35e2-2364-466d-b1c7-2a8908056dcf.png)] bg-[length:100%_100%] bg-no-repeat relative z-[102] mt-[6.5px] mr-0 mb-0 ml-[10.75px]" />
            </div>
          </div>
          {/* Actors List */}
          <div className="flex w-[1063px] justify-between items-center flex-nowrap relative z-[80] mt-[40px] mr-0 mb-0 ml-0">
            {/* Actor 1 */}
            {/* Repeat similar blocks for actors */}
            {/* ... */}
            {/* Navigation Arrow */}
            <div className="w-[48px] h-[48px] shrink-0 relative overflow-hidden z-[96]">
              <div className="w-[16px] h-[28px] bg-[url(../assets/images/b2eabfbe-0dec-432b-b78d-3ac4496982b7.png)] bg-[length:100%_100%] bg-no-repeat relative z-[97] mt-[10px] mr-0 mb-0 ml-[16px]" />
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        {/* Repeat similar blocks for other sections like "Top 10 Most Popular Actresses", "Top 10 Director-Actor Pairings with Highest Ratings", etc. */}
        {/* ... */}
      </div>

      {/* Genre Popularity Trends Section */}
      <div className="flex w-[1064.654px] flex-col gap-[35px] items-start flex-nowrap relative z-[32] mt-[94.395px] mr-0 mb-0 ml-[194px]">
        {/* Section Title */}
        <div className="flex w-[438px] flex-col gap-[10px] items-start shrink-0 flex-nowrap relative z-[33]">
          <div className="flex w-[438px] gap-[12px] items-center shrink-0 flex-nowrap relative z-[34]">
            <span className="flex w-[392px] h-[29px] justify-center items-center shrink-0 basis-auto font-['Inter'] text-[24px] font-semibold leading-[29px] text-[#000] tracking-[-0.48px] relative text-center whitespace-nowrap z-[35]">
              Genre Popularity Trends Over Time
            </span>
            <div className="w-[34px] h-[34px] shrink-0 relative overflow-hidden z-[36]">
              <div className="w-[12.5px] h-[21px] bg-[url(../assets/images/52afd69f-2233-4fac-954a-fb0513a4f3dc.png)] bg-[length:100%_100%] bg-no-repeat relative z-[37] mt-[6.5px] mr-0 mb-0 ml-[10.75px]" />
            </div>
          </div>
        </div>
        {/* Trend Selector */}
        <div className="flex w-[521px] h-[64px] flex-col gap-[12px] items-start shrink-0 flex-nowrap relative z-[38]">
          {/* Decades Selector */}
          <div className="flex justify-between items-start self-stretch shrink-0 flex-nowrap relative z-[39]">
            <span className="h-[22px] grow shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[22px] text-[#1e1e1e] relative text-left whitespace-nowrap z-40">
              Decades
            </span>
            <div className="flex w-[74px] items-center shrink-0 flex-nowrap relative z-[41]">
              <span className="flex w-[74px] h-[20px] justify-end items-start shrink-0 basis-auto font-['Inter'] text-[14px] font-normal leading-[19.6px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[43]">
                1960-2020
              </span>
            </div>
          </div>
          {/* Slider */}
          <div className="flex items-center self-stretch shrink-0 flex-nowrap relative z-[44]">
            <div className="flex h-[8px] items-center grow shrink-0 basis-0 flex-nowrap bg-[#e6e6e6] rounded-full relative z-[45]">
              <div className="w-[16px] h-[16px] shrink-0 bg-[#2c2c2c] rounded-full relative overflow-hidden z-[46]" />
              {/* Slider Track */}
              <div className="flex w-[208px] h-[6px] items-start shrink-0 flex-nowrap relative overflow-hidden z-[47]" />
              <div className="w-[16px] h-[16px] shrink-0 bg-[#2c2c2c] rounded-full relative overflow-hidden z-[48]" />
            </div>
          </div>
          <span className="h-[22px] self-stretch shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[22px] text-[#757575] relative text-left whitespace-nowrap z-[49]">
            Select a decade to explore trends:
          </span>
        </div>
        {/* Trend Graphs */}
        <div className="flex gap-[102px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-50">
          <div className="w-[474px] h-[231px] shrink-0 bg-[url(../assets/images/f355d02f02d9d44519e8b09302c11613e6f95656.png)] bg-cover bg-no-repeat relative z-[51]" />
          <div className="w-[488.654px] h-[231px] shrink-0 bg-[url(../assets/images/2b72859dd5d9f27cf516f1e860f2660a70f06bee.png)] bg-contain bg-no-repeat relative z-[52]" />
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-[1065px] h-px bg-[url(../assets/images/2a5a130d-a5c5-423f-8786-ad361e1e6d79.png)] bg-cover bg-no-repeat relative z-[29] mt-[186px] mr-0 mb-0 ml-[194px]" />

      {/* Back To Top Button */}
      <button className="flex w-[159px] pt-[12px] pr-[12px] pb-[12px] pl-[12px] gap-[8px] justify-center items-center flex-nowrap bg-[#2c2c2c] rounded-[8px] border-solid border border-[#2c2c2c] relative overflow-hidden z-30 pointer mt-[133px] mr-0 mb-0 ml-[647px]">
        <span className="h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#f5f5f5] relative text-left whitespace-nowrap z-[31]">
          Back To Top
        </span>
      </button>

      {/* Background Overlay */}
      <div className="w-[1440px] h-[536px] bg-[rgba(255,255,255,0.16)] bg-[url(../assets/images/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png)] bg-cover bg-no-repeat absolute top-[110px] left-0 z-[14]" />
    </div>
  );
}
