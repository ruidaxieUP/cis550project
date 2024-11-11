import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../index.css';

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Person", path: "/person" },
  { name: "Movie", path: "/movie" },
  { name: "Contact", path: "/contact" },
];

// Helper component for a navigation item
function NavItem({ name, path, selectedPage, onClick }) {
  const baseLinkStyle = 'flex pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[8px] justify-center items-center flex-nowrap rounded-[8px] relative pointer';
  const activeStyle = `${baseLinkStyle} bg-[#f5f5f5] border-none`;
  const inactiveStyle = `${baseLinkStyle} bg-transparent`;

  return (
    <NavLink
      to={path}
      onClick={() => onClick(name)}
      className={selectedPage === name ? activeStyle : inactiveStyle}
    >
      <span className="h-[16px] shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[16px] text-[#1e1e1e] relative text-left whitespace-nowrap">
        {name}
      </span>
    </NavLink>
  );
}

// Define prop types for NavItem
NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  selectedPage: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function NavBar() {
  const [selectedPage, setSelectedPage] = useState("Home");

  const handlePageClick = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className='flex w-[1436px] pt-[16px] pr-[32px] pb-[16px] pl-[32px] gap-[24px] items-center flex-wrap bg-[#fff] border-solid border-t border-b border-[#d9d9d9] relative overflow-hidden mx-auto my-0' style={{ height: '108px' }}>
      
      {/* Logo/Icon */}
      <div className='flex w-[44px] gap-[24px] items-center flex-nowrap relative z-[1]'>
        <div className='flex w-[44px] pt-[12px] pr-[12px] pb-[12px] pl-[12px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#f5f5f5] rounded-[32px] border-solid border border-[#d9d9d9] relative overflow-hidden'>
          <div className='w-[20px] h-[20px] shrink-0 relative overflow-hidden'>
            {/* Icon placeholder */}
            <div className='w-[16.875px] h-[11.875px] bg-[length:100%_100%] bg-no-repeat relative mt-[4.063px] ml-[1.563px]' />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className='flex gap-[8px] justify-end items-start grow basis-0 flex-wrap relative'>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.name}
            name={item.name}
            path={item.path}
            selectedPage={selectedPage}
            onClick={handlePageClick}
          />
        ))}
      </div>
    </div>
  );
}
