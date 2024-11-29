
import PropTypes from 'prop-types';

function PairImageCard({ directorImage, actorImage, directorName, actorName }) {
  return (
    <div className="main-container flex w-[240px] pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[16px] items-start flex-nowrap bg-[#fff] rounded-[8px] border-solid border border-[#d9d9d9] relative mx-auto my-0">
      {/* Director Image */}
      <div
        className="flex h-[247px] flex-col justify-center items-center self-stretch shrink-0 flex-nowrap bg-[rgba(227,227,227,0.2)] bg-cover bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage: `url(${directorImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />

      {/* Actor Image */}
      <div
        className="flex h-[247px] flex-col justify-center items-center self-stretch shrink-0 flex-nowrap bg-[rgba(227,227,227,0.2)] bg-cover bg-no-repeat relative overflow-hidden z-[1]"
        style={{
          backgroundImage: `url(${actorImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />

      {/* Names */}
      <div className="flex w-[162px] flex-col gap-[8px] items-start shrink-0 flex-nowrap relative z-[2]">
        <div className="flex w-[162px] items-start shrink-0 flex-nowrap relative z-[3]">
          <span className="h-[22px] shrink-0 basis-auto font-['Inter'] text-[16px] font-semibold leading-[22px] text-[#1e1e1e] relative text-left whitespace-nowrap z-[4]">
            {directorName}
          </span>
        </div>
        <span className="h-[22px] shrink-0 basis-auto font-['Inter'] text-[16px] font-semibold leading-[22px] text-[#1e1e1e] relative text-left whitespace-nowrap z-[5]">
          {actorName}
        </span>
      </div>
    </div>
  );
}

PairImageCard.propTypes = {
  directorImage: PropTypes.string.isRequired,
  actorImage: PropTypes.string.isRequired,
  directorName: PropTypes.string.isRequired,
  actorName: PropTypes.string.isRequired,
};

export default PairImageCard;