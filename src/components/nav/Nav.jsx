import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { PermissionsContext, LogoutContext } from '../../App'; // Import the contexts

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const permissions = useContext(PermissionsContext); // Use the context
  const navigate = useNavigate();
  const { setIsAuthenticated, setPermissions } = useContext(LogoutContext); // Use the logout context


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPermissions(null);
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center pb-9 text-center text-[color:var(--color-light)] bg-white">
      <div className="flex gap-5 justify-between items-start self-stretch px-6 py-3 w-full whitespace-nowrap bg-[color:var(--color-primary)] max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        <div className='flex gap-5 justify-between'>
          <Link to="/login" onClick={logout}>خروج</Link>
          <FaUserCircle className='mt-1' />
        </div>
        <div className="flex gap-5 justify-between">
          {permissions?.users && <Link to="/users">کارکنان</Link>}
          {permissions?.branch && <Link to="/branches">شعب</Link>}
          {permissions && (
            <div className="relative" onMouseLeave={closeDropdown}>
              <span className="cursor-pointer" onMouseEnter={toggleDropdown}>پرونده</span>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-48 bg-[color:var(--color-bg-variant)] border border-solid border-[color:var(--color-bg-variant)] rounded shadow-md">
                  {permissions?.report_detail.add && <Link to="/newfile" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">ایجاد پرونده جدید</Link>}
                  {permissions?.report && <Link to="/ongoingfiles" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">پرونده های در جریان</Link>}
                  {permissions?.report && <Link to="/completedfiles" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">پرونده های خاتمه یافته</Link>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
