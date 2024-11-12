export default function HomePage() {

  return (
    <div className='main-container w-[1440px] h-[3165px] bg-[#fff] relative overflow-hidden mx-auto my-0'>
      {/* Header Section: Title and Subtitle */}
      <div className='flex w-[151px] flex-col gap-[8px] items-center flex-nowrap relative z-[15] mt-[162px] mr-0 mb-0 ml-[644.5px]'>
        <span className="h-[86px] self-stretch shrink-0 basis-auto font-['Inter'] text-[72px] font-bold leading-[86px] text-[#0c0c0d] tracking-[-2.16px] relative text-center whitespace-nowrap z-[16]">
          Title
        </span>
        <span className="h-[38px] self-stretch shrink-0 basis-auto font-['Inter'] text-[32px] font-normal leading-[38px] text-[#0c0c0d] relative text-center whitespace-nowrap z-[17]">
          Subtitle
        </span>
      </div>


      {/* Background Overlay */}
      <div className='w-[1440px] h-[536px] bg-[rgba(255,255,255,0.16)] bg-cover bg-no-repeat absolute top-[110px] left-0 z-[14]' />
    </div>
  );
}
