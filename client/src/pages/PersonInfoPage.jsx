import { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import GenresContainer from "../components/GenresContainer";
import { useParams } from "react-router-dom";
import Card from "../components/ImageCard/KnownForCard";
import Pagination from "../components/Pagination";
import { fetchDataById } from "./utils";

export default function PeopleInfoPage() {
  const [personData, setPersonData] = useState(null);
  const [personGenres, setPersonGenres] = useState([]);
  const [knownForData, setKnownForData] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { person_id } = useParams();

  useEffect(() => {
    setTimeout(() => {
      fetchDataById("persons", person_id, setPersonData);
      fetchDataById("person-genres", person_id, setPersonGenres);
      fetchDataById("person-collaborators", person_id, setCollaborators);
    }, 500);
  });

  useEffect(() => {
    fetchKnownForData(person_id, currentPage);
  }, [person_id, currentPage]);

  const fetchKnownForData = async (personId, page) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/person-known-for/${personId}?page=${page}&pageSize=8`
      );
      const data = await response.json();
      setKnownForData(data.results);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching known-for data:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!personData) {
    return <div className="text-center text-xl">Loading...</div>;
  }


  return (
    <div className="main-container flex flex-col items-center gap-16 py-[64px]">
      {/* Profile Section */}
      <div className="flex w-full pr-[186px] pb-[64px] pl-[191px] gap-[48px] flex-wrap bg-[#fff] opacity-80 relative z-10">
        <div
          className="flex w-[403px] h-[604px] flex-col justify-center items-center shrink-0 flex-nowrap bg-cover bg-no-repeat relative overflow-hidden"
          style={{ backgroundImage: `url(${personData.imagePath})` }}
        />
        <div className="flex flex-col flex-1 gap-[24px] items-start">
          <div className="flex flex-col gap-[8px] items-start w-full">
            <span className="font-['Inter'] text-[24px] font-semibold text-[#1e1e1e]">
              {personData.name}
            </span>
            <span className="font-['Inter'] text-[20px] text-[#757575]">
              Known For {personData.knownForDepartment}
            </span>
          </div>

          {/* Genre Section */}
          <GenresContainer genres={personGenres} />

          {/* Bio Section */}
          <div className="flex flex-col w-full">
            <span className="text-[16px] text-[#1e1e1e] leading-[1.5]">
              {personData.bio}
            </span>
          </div>
        </div>
      </div>

      {/* Known For Section */}
      <div className="flex flex-col gap-4 w-[1071px]">
        <span className="text-[24px] font-semibold tracking-[-0.48px] text-[#000]">
          Known For
        </span>
        <div className="grid grid-cols-4 gap-4">
          {knownForData.map((item, index) => (
            <Card
              key={index}
              posterPath={item.posterPath}
              movieName={item.movieName}
              characterName={item.characterName}
              rating={parseFloat(item.rating)}
              movieId={item.movieId} 
            />
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

      {/* Top Collaborators Section */}
      <div className="main-container flex w-[1071px] flex-col items-center mx-auto my-0">
        <ImageSlider
          title="Top 10 Frequent Collaborators"
          data={collaborators}
        />
      </div>
    </div>
  );
}
