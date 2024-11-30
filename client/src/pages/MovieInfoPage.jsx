import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import GenresContainer from "../components/GenresContainer";


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

export default function MovieInfoPage() {
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setMovieData(mockMovieData);
    }, 500);
  }, []);

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
    <div className="main-container flex w-[1436px] pt-[64px] pr-[184px] pb-[64px] pl-[184px] gap-[131px] items-start flex-nowrap relative mx-auto my-0">
      {/* Movie Poster */}
      <div
        className="flex w-[403px] h-[604px] flex-col justify-center items-center shrink-0 flex-nowrap bg-cover bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage: `url(${poster_path})`,
        }}
      />

      {/* Movie Info Section */}
      <div className="flex w-[518px] flex-col gap-[25px] items-start shrink-0 flex-nowrap relative z-[1]">
        {/* Movie Title */}
        <span className="h-[29px] self-stretch shrink-0 basis-auto font-['Inter'] text-[24px] font-semibold leading-[28.8px] text-[#1e1e1e] tracking-[-0.48px] relative text-left whitespace-nowrap z-[2]">
          {`${movie_name} (${production_year})`}
        </span>

        {/* Rating Section */}
        <div className="flex w-[146px] gap-[6px] items-start shrink-0 flex-nowrap relative z-[3]">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-8 h-8" />
          <div className="flex w-[100px] flex-col items-start shrink-0 flex-nowrap relative z-[5]">
            <span className="h-[21px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-normal leading-[21px] text-[#757575] relative text-left whitespace-nowrap z-[6]">
              {rating}
            </span>
            <span className="h-[21px] self-stretch shrink-0 basis-auto font-['Inter'] text-[14px] font-normal leading-[19.6px] text-[#757575] relative text-left whitespace-nowrap z-[7]">
              {`${votes} voted`}
            </span>
          </div>
        </div>

        {/* Genre Section */}
        <GenresContainer genres={mockGenres} />

        {/* Metadata Section */}
        <div className="flex flex-col gap-[12px] self-stretch shrink-0 flex-nowrap relative z-[13]">
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
              {/* Label */}
              <span className="font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[110px] text-left">
                {item.label}
              </span>
              {/* Value */}
              <span className="font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[384px] text-left">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Overview Section */}
        <div className="flex flex-col gap-[25px] items-start self-stretch shrink-0 flex-nowrap relative z-[31]">
          <span className="flex w-[518px] justify-start items-start self-stretch shrink-0 font-['Inter'] text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] relative text-left">
            Overview: {overview}
          </span>
        </div>
      </div>

      {/* Top Cast Section */}
      <div className="mt-16" />

      {/* More Like This Section */}
      <div className="mt-16" />
    </div>
  );
}
