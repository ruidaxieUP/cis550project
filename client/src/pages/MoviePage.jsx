export default function MoviePage() {
  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Header Section */}
      <div
        className="flex flex-col items-center justify-center w-full h-[570px] bg-[rgba(255,255,255,0.16)] bg-cover bg-no-repeat relative"
        style={{
          backgroundImage: `url('https://image.tmdb.org/t/p/w500/hQ4pYsIbP22TMXOUdSfC2mjWrO0.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8, // Change this value to adjust the opacity
        }}
      >
        {/* Add your content here */}
      </div>
    </div>
  );
}
