import { useEffect, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import GenresContainer from "../components/GenresContainer";
import Card from "../components/ImageCard/KnownForCard";
import Pagination from "../components/Pagination";

// mock data
const mockPersonData = {
  id: 976,
  name: "Jason Statham",
  imagePath: "https://via.placeholder.com/403x604",
  bio: `Jason Statham (born July 26, 1967) is an English actor. He is known for portraying characters in various action-thriller films who are typically tough, hardboiled, gritty, or violent.

Statham began practicing Chinese martial arts, kickboxing, and karate recreationally in his youth while working at local market stalls. An avid footballer and diver, he was a member of Britain's national diving team and competed for England in the 1990 Commonwealth Games. Shortly after, he was asked to model for French Connection, Tommy Hilfiger, and Levi's in various advertising campaigns. His past history working at market stalls inspired his casting in the Guy Ritchie crime films Lock, Stock and Two Smoking Barrels (1998) and Snatch (2000).

The commercial success of these films led Statham to star as Frank Martin in the Transporter trilogy (2002–2008). After starring in a variety of heist and action-thriller films such as The Italian Job (2003), Crank (2006), War (2007), The Bank Job (2008), The Mechanic (2011), Spy (2015), and Mechanic: Resurrection (2016), he established himself as a Hollywood leading man. However, he has also starred in commercially and critically unsuccessful films such as Revolver (2005), Chaos (2005), In the Name of the King (2007), 13 (2010), Blitz (2011), Killer Elite (2011), Hummingbird (2013), and Wild Card (2015). He regained commercial success as a part of the ensemble action series The Expendables (2010–2014) and the Fast & Furious franchise. In the latter, he has played Deckard Shaw in Fast & Furious 6 (2013), Furious 7 (2015), The Fate of the Furious (2017), F9 (2021) and the spin-off Fast & Furious Presents: Hobbs & Shaw (2019). He was credited as a co-producer on Hobbs & Shaw, receiving his first production credit.

His acting has been criticized for lacking depth and variety, but he has also been praised for leading the resurgence of action films during the 2000s and 2010s. According to a BBC News report, his film career from 2002 to 2017 generated an estimated $1.5 billion (£1.1 billion) in ticket sales, making him one of the film industry's most bankable stars.`,
  knownForDepartment: "Acting",
};

const mockTopCollaborators = [
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/300",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
  {
    title: "Dwayne Johnson",
    src: "https://via.placeholder/180",
  },
];

const mockGenres = [
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10749, name: "Romance" },
];



// Temporary Mock API, backend will be implemented later
const mockKnownForData = Array.from({ length: 180 }, (_, index) => ({
  posterPath: "https://via.placeholder.com/241x247",
  movieName: `Movie Name ${index + 1}`,
  characterName: `Character Name ${index + 1}`,
  rating: (Math.random() * 4 + 6).toFixed(1), // Random rating between 6.0 and 10.0
}));

//Temporary Mock API, backend will be implemented later
function fetchMockKnownForData(page = 1, pageSize = 8) {
  const totalItems = mockKnownForData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const result = mockKnownForData.slice(startIndex, endIndex);

  return {
    result,
    currentPage: page,
    totalPages,
    totalItems,
  };
}

export default function PeopleInfoPage() {
  const [personData, setPersonData] = useState(null);
  const [knownForData, setKnownForData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setPersonData(mockPersonData);
      loadPageData(currentPage);
    }, 500);
  }, []);

  const loadPageData = (page) => {
    const { result, currentPage, totalPages } = fetchMockKnownForData(page);
    setKnownForData(result);
    setCurrentPage(currentPage);
    setTotalPages(totalPages);
  };

  const handlePageChange = (page) => {
    loadPageData(page);
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
          <GenresContainer genres={mockGenres} />

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
              rating={item.rating}
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
          data={mockTopCollaborators}
        />
      </div>
    </div>
  );
}