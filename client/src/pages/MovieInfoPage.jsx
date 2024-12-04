import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GenresContainer from "../components/GenresContainer";
import CastImageCard from "../components/ImageCard/CastImageCard";
import MovieCard from "../components/ImageCard/MoiveRectImageCard";
import Pagination from "../components/Pagination";
import { fetchDataById } from "./utils";

export default function MovieInfoPage() {
  const [movieData, setMovieData] = useState(null);
  const [castData, setCastData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [moreLikeThis, setMoreLikeThis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { movie_id } = useParams();

  useEffect(() => {
    setTimeout(() => {
      fetchDataById("movies", movie_id, setMovieData);
      fetchDataById("movie-casts", movie_id, setCastData);
      fetchDataById("movie-genres", movie_id, setGenreData);
    }, 500);
  }, [movie_id]);

  useEffect(() => {
    fetchSimilarMovieData(movie_id, currentPage);
  }, [movie_id, currentPage]);

  const fetchSimilarMovieData = async (movie_id, page) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/similar-movies/${movie_id}?page=${page}&pageSize=8`
      );
      const data = await response.json();
      setMoreLikeThis(data.results);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching known-for data:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    duration,
    budget,
    revenue,
    overview,
  } = movieData;

  return (
    <div className="main-container flex flex-col items-center gap-16 py-[64px]">
      {/* Movie Info Section */}
      <div className="flex gap-[64px] items-start w-[1024px]">
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
          <span className="h-[29px] self-stretch shrink-0 basis-auto text-[24px] font-semibold leading-[28.8px] text-[#1e1e1e] tracking-[-0.48px] relative text-left whitespace-nowrap">
            {`${movie_name} (${production_year})`}
          </span>

          {/* Rating Section */}
          <div className="flex w-[146px] gap-[6px] items-start shrink-0 flex-nowrap">
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-500 w-8 h-8"
            />
            <div className="flex w-[100px] flex-col items-start shrink-0 flex-nowrap">
              <span className="h-[21px] self-stretch shrink-0 basis-auto  text-[20px] font-normal leading-[21px] text-[#757575] relative text-left whitespace-nowrap">
                {rating}
              </span>
              <span className="h-[21px] self-stretch shrink-0 basis-auto text-[14px] font-normal leading-[19.6px] text-[#757575] relative text-left whitespace-nowrap">
                {`${votes} voted`}
              </span>
            </div>
          </div>

          {/* Genre Section */}
          <GenresContainer genres={genreData} />

          {/* Metadata Section */}
          <div className="flex flex-col gap-[12px] self-stretch shrink-0 flex-nowrap">
            {[
              { label: "Status", value: status },
              { label: "Director", value: director },
              { label: "Cast", value: cast },
              { label: "Duration", value: duration },
              { label: "Budget", value: budget },
              { label: "Revenue", value: revenue },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full h-[44px]"
              >
                <span className=" text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[110px] text-left">
                  {item.label}
                </span>
                <span className="text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] w-[384px] text-left">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Overview Section */}
          <div className="flex flex-col gap-[25px] items-start self-stretch shrink-0 flex-nowrap">
            <span className="flex w-[518px] justify-start items-start self-stretch shrink-0 text-[16px] font-normal leading-[22.4px] text-[#1e1e1e] relative text-left">
              Overview: {overview}
            </span>
          </div>
        </div>
      </div>

      {/* Top Cast Section */}
      <div className="flex flex-col gap-4 w-[1024px]">
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
              actorId={item.id}
            />
          ))}
        </div>
      </div>

      {/* More Like This Section */}
      <div className="flex flex-col gap-4 w-[1024px]">
        <span className="text-[24px] font-semibold tracking-[-0.48px] text-[#000]">
          More Like This
        </span>
        <div className="grid grid-cols-4 gap-4">
          {moreLikeThis.map((movie) => (
            <MovieCard
              key={movie.id}
              image={movie.image}
              title={movie.title}
              rating={parseFloat(movie.rating)}
              genres={movie.genres}
              itemId={movie.id}
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