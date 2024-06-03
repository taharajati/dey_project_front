import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PermissionsContext } from '../../../App'; // Import the context

const NavList = ({ activeReportId }) => {
    const navigate = useNavigate(); // Use useNavigate hook
    const permissions = useContext(PermissionsContext); // Use the context

    const handleGoBack = () => {
        navigate('/ongoingfiles'); // Navigate back to the OngoingFiles component
    };


    console.log("permissions",permissions)

 

    return (
        <div>
            <nav className="text-black p-4 md:mx-[75px] mx-4 ">
                <button
                    onClick={handleGoBack}
                    className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"
                >
                    بازگشت
                </button>
                <ul className="flex flex-wrap justify-end space-x-4 rtl:space-x-reverse float-right  " dir='rtl'>
                    {permissions.document && (
                        <li>
                            <NavLink 
                                to={`/report/${activeReportId}`} 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                مدارک و فایل ها
                            </NavLink>
                        </li>
                    )}
                    {permissions.other_documents && (
                        <li>
                            <NavLink 
                                to={`/zamime`} 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                دیگر فایل های ضمیمه
                            </NavLink>
                        </li>
                    )}
                    {permissions.assign && (
                        <li>
                            <NavLink 
                                to="/takhsis" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                تخصیص
                            </NavLink>
                        </li>
                    )}
                    {permissions.checklist && (
                        <li>
                            <NavLink 
                                to="/checklist" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                چک لیست
                            </NavLink>
                        </li>
                    )}
                    {permissions.checklist_status && (
                        <li>
                            <NavLink 
                                to="/checklistha" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                وضعیت چک لیست ها
                            </NavLink>
                        </li>
                    )}
                    {permissions.comment && (
                        <li>
                            <NavLink 
                                to="/comment" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                تاریخچه  
                            </NavLink>
                        </li>
                    )}
                    {permissions.finding && (
                        <li>
                            <NavLink 
                                to="/yaft" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                یافته
                            </NavLink>
                        </li>
                    )}
                    {permissions.report && (
                        <li>
                            <NavLink 
                                to="/reporttable" 
                                className={({ isActive }) => isActive ? "text-[color:var(--color-light)] py-2 px-4 rounded-lg bg-[color:var(--color-primary-variant)]" : "bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"}
                            >
                                گزارش 
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="max-w-full h-0.5 bg-black border border-black border-solid md:w-[1400px] w-full flex flex-col items-center mx-auto" />
        </div>
    );
};

export default NavList;
