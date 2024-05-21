import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavList = ({ activeReportId }) => {
    const navigate = useNavigate(); // Use useNavigate hook

    const handleGoBack = () => {
        navigate('/ongoingfiles'); // Navigate back to the OngoingFiles component
    };

    return (
        <div>
        <nav className=" text-black p-4 mx-[75px]">
        <button
                            onClick={handleGoBack}
                            className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"
                        >
                            بازگشت
                        </button>
            <ul className="flex justify-end space-x-4 rtl:space-x-reverse  float-right " dir='rtl'>
           
                {/* Active styling with NavLink */}
                <li>
                    <NavLink 
                        to={`/report/${activeReportId}`} 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4  rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                    >
                        مدارک و فایل ها
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to={`/word`} 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4  rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                    >
word                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/takhsis" 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)]  py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3  rounded-lg"}
                    >
                        تخصیص
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/checklist" 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)]  py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3  rounded-lg"}
                    >
                        چک لیست
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/checklistha" 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)]  py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3  rounded-lg"}
                    >
                        وضعیت چک لیست ها
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/yaft" 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)]  py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3  rounded-lg"}
                    >
                        یافته
                    </NavLink>
                </li>
             
                <li>
                    <NavLink 
                        to="/reporttable" 
                        className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3  rounded-lg "}
                    >
                        گزارش 
                    </NavLink>
                </li>
            
          
             
            </ul>
        </nav>
        <div className=" max-w-full h-0.5 bg-black border border-black border-solid w-[1400px] flex flex-col items-center  mx-auto " />
        </div>
    );
};

export default NavList;
