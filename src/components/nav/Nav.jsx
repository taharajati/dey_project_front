import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";


const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when mouse leaves the dropdown area
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col items-center pb-9 text-center text-[color:var(--color-light)] bg-white ">
      
      <div className="flex gap-5 justify-between items-start self-stretch px-6 py-3 w-full whitespace-nowrap bg-[color:var(--color-primary)] max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
       <div className=' flex gap-5 justify-between'>
      
        <Link to="/login">خروج</Link> 
        <FaUserCircle className=' mt-1' />
        <h3>  </h3>
       
       </div>
       

      
        <div className="flex gap-5 justify-between">
          <Link to="/users">کارکنان</Link>
          <Link to="/branches">شعب</Link>
          
          <div className="relative" onMouseLeave={closeDropdown} >
            <span className="cursor-pointer" onMouseEnter={toggleDropdown}>پرونده</span>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full  w-48 bg-[color:var(--color-bg-variant)] border border-solid border-[color:var(--color-bg-variant)] rounded shadow-md">
                <Link to="/newfile" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">ایجاد پرونده جدید</Link>
                <Link to="/ongoingfiles" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">پرونده های در جریان</Link>
                <Link to="/completedfiles" className="block px-4 py-2 hover:bg-[color:var(--color-primary)]">پرونده های خاتمه یافته</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
