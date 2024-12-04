import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../index.css';

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Person", path: "/persons" },
  { name: "Movie", path: "/movies" },
];

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function NavItem({ name, path, isActive }) {
  const baseLinkStyle = 'flex pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[8px] justify-center items-center flex-nowrap rounded-[8px] relative pointer';
  const activeStyle = `${baseLinkStyle} bg-[#f5f5f5] border-none`;
  const inactiveStyle = `${baseLinkStyle} bg-transparent`;

  return (
    <NavLink
      to={path}
      className={isActive ? activeStyle : inactiveStyle}
    >
      <span className="h-[16px] shrink-0 basis-auto text-[16px] font-normal leading-[16px] text-[#1e1e1e] relative text-left whitespace-nowrap">
        {name}
      </span>
    </NavLink>
  );
}

export default function NavBar() {
  const location = useLocation();

  return (
    <div className='flex w-[1436px] pt-[16px] pr-[32px] pb-[16px] pl-[32px] gap-[24px] items-center flex-wrap bg-[#fff] border-solid border-t border-b border-[#d9d9d9] relative overflow-hidden mx-auto my-0' style={{ height: '108px' }}>

      {/* Navigation Links */}
      <div className='flex gap-[8px] justify-end items-start grow basis-0 flex-wrap relative'>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.name}
            name={item.name}
            path={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>
    </div>
  );
}
