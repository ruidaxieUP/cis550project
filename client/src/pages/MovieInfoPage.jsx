import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import GenresContainer from "../components/GenresContainer";
import CastImageCard from "../components/ImageCard/CastImageCard";
import MovieCard from "../components/ImageCard/MoiveRectImageCard";
import Pagination from "../components/Pagination";

const mockMovieData = {
  movie_id: "12345",
  poster_path: "https://via.placeholder.com/403x604",
  movie_name: "Dancer in the Dark",
  production_year: 2000,
  rating: 7.9,
  votes: 1760,
  status: "Released",
  director: "Lars von Trier",
  cast: "David Morse, Peter Stormare, Catherine Deneuve, Stellan Skarsard, Zeljko Ivanek",
  released_date: "5/30/2000",
  duration: "140 minutes",
  budget: "12.5 million",
  revenue: "40.06 million",
  overview:
    "Selma, a Czech immigrant on the verge of blindness, struggles to make ends meet for herself and her son, who has inherited the same genetic disorder and will suffer the same fate without an expensive operation. When life gets too difficult, Selma learns to cope through her love of musicals, escaping life's troubles - even if just for a moment - by dreaming up little numbers to the rhythmic beats of her surroundings.",
};

const mockGenres = [
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10749, name: "Romance" },
];

const castData = [
  {
    id: 1,
    image: "https://via.placeholder.com/182",
    characterName: "Character A",
    actorName: "Actor A",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/182",
    characterName: "Character B",
    actorName: "Actor B",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/182",
    characterName: "Character C",
    actorName: "Actor C",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/182",
    characterName: "Character D",
    actorName: "Actor D",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/182",
    characterName: "Character E",
    actorName: "Actor E",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/182",
    characterName: "Character E",
    actorName: "Actor E",
  },
  {
    id: 6,
    image: "https://via.placeholder.com/182",
    characterName: "Character F",
    actorName: "Actor F",
  },
  {
    id: 7,
    image: "https://via.placeholder.com/182",
    characterName: "Character G",
    actorName: "Actor G",
  },
  {
    id: 8,
    image: "https://via.placeholder.com/182",
    characterName: "Character H",
    actorName: "Actor H",
  },
  {
    id: 9,
    image: "https://via.placeholder.com/182",
    characterName: "Character I",
    actorName: "Actor I",
  },
];

const mockMoreLikeThis = [
  {
    data: [
      {
        id: 1,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 1",
        rating: 9.3,
        genres: [
          { id: 18, name: "Drama" },
          { id: 80, name: "Crime" },
        ],
      },
      {
        id: 2,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 2",
        rating: 9.2,
        genres: [
          { id: 80, name: "Crime" },
          { id: 18, name: "Drama" },
        ],
      },
      {
        id: 3,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 3",
        rating: 9.0,
        genres: [
          { id: 28, name: "Action" },
          { id: 80, name: "Crime" },
          { id: 18, name: "Drama" },
        ],
      },
      {
        id: 4,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 4",
        rating: 9.0,
        genres: [{ id: 18, name: "Drama" }],
      },
      {
        id: 5,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 5",
        rating: 8.9,
        genres: [
          { id: 18, name: "Drama" },
          { id: 36, name: "History" },
        ],
      },
      {
        id: 6,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 6",
        rating: 8.9,
        genres: [
          { id: 12, name: "Adventure" },
          { id: 14, name: "Fantasy" },
          { id: 28, name: "Action" },
        ],
      },
      {
        id: 7,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 7",
        rating: 8.9,
        genres: [
          { id: 80, name: "Crime" },
          { id: 35, name: "Comedy" },
        ],
      },
      {
        id: 8,
        image: "https://via.placeholder.com/241x247",
        title: "Movie 8",
        rating: 8.8,
        genres: [
          { id: 37, name: "Western" },
          { id: 28, name: "Action" },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 8,
    },
  },
];

export default function MovieInfoPage() {
  const [movieData, setMovieData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [movies, setMovies] = useState([]); 

  useEffect(() => {
    setTimeout(() => {
      setMovieData(mockMovieData);
      const { data, pagination } = mockMoreLikeThis[0];
      setMovies(data); 
      setTotalPages(pagination.totalPages); 
    }, 500);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const { data } = mockMoreLikeThis[0]; 
      setMovies(data);
    }, 500);
  };

  if (!movieData) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  const {
    poster_path,
    movie_name,
    production_year,
    rating,
    votes,
    status,
    director,
    cast,
    released_date,
    duration,
    budget,
    revenue,
    overview,
  } = movieData;

  return (
    <div className="main-container flex flex-col items-center gap-16 py-[64px]">
      {/* Movie Info Section */}
      <div className={`flex gap-[64px] items-start w-[1024px]`}>
        {/* Movie Poster */}
        <div
          className="flex w-[403px] h-[604px] flex-col justify-center items-center shrink-0 flex-nowrap bg-cover bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: `url(${poster_path})`,
          }}
        />

        {/* Movie Info Section */}
        <div className="flex w-[518px] flex-col gap-[25px] items-start shrink-0 flex-nowrap">
          {/* Movie Title */}
          <span className="h-[29px] self-stretch shrink-0 basis-auto font-['Inter'] text-[24px] font-semibold leading-[28.8px] text-[#1e1e1e] tracking-[-0.48px] relative text-left whitespace-nowrap">
            {`${movie_name} (${production_year})`}
          </span>

          {/* Rating Section */}
          <div className="flex w-[146px] gap-[6px] items-start shrink-0 flex-nowrap">
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-500 w-8 h-8"
            />
            <div className="flex w-[100px] flex-col items-start shrink-0 flex-nowrap">
              <span className="h-[21px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-normal leading-[21px] text-[#757575] relative text-left whitespace-nowrap">
                {rating}
              </span>
              <span className="h-[21px] self-stretch shrink-0 basis-auto font-['Inter'] text-[14px] font-normal leading-[19.6px] text-[#757575] relative text-left whitespace-nowrap">
                {`${votes} voted`}
              </span>
            </div>
          </div>

          {/* Genre Section */}
          <GenresContainer genres={mockGenres} />

          {/* Metadata Section */}
          <div className="flex flex-col gap-[12px] self-stretch shrink-0 flex-nowrap">
            {[
              { label: "Status", value: status },
              { label: "Director", value: director },
              { label: "Cast", value: cast },
              { label: "Released Date", value: released_date },
              { label: "Duration", value: duration },
              { label: "Budget", value: budget },
              { label: "Revenue", value: revenue },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full h-[44px]"
              >
                <span className="font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[110px] text-left">
                  {item.label}
                </span>
                <span className="font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[384px] text-left">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Overview Section */}
          <div className="flex flex-col gap-[25px] items-start self-stretch shrink-0 flex-nowrap">
            <span className="flex w-[518px] justify-start items-start self-stretch shrink-0 font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] relative text-left">
              Overview: {overview}
            </span>
          </div>
        </div>
      </div>

      {/* Top Cast Section */}
      <div className={`flex flex-col gap-4 w-[1024px]`}>
        <span className="text-[24px] font-semibold tracking-[-0.48px] text-[#000]">
          Top Cast
        </span>
        <div className="grid grid-cols-5 gap-4">
          {castData.map((item) => (
            <CastImageCard
              key={item.id}
              image={item.image}
              characterName={item.characterName}
              actorName={item.actorName}
            />
          ))}
        </div>
      </div>

      {/* More Like This Section */}
      <div className={`flex flex-col gap-4 w-[1024px]`}>
        <span className="text-[24px] font-semibold tracking-[-0.48px] text-[#000]">
          More Like This
        </span>
        <div className="grid grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              image={movie.image}
              title={movie.title}
              rating={movie.rating}
              genres={movie.genres}
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
    </div>
  );
}
