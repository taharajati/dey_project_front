import React, { useState, useEffect } from 'react';
import NavList from './NavList';
import { useReport } from '../filedetails/ReportContext'; // Import the useReport hook


const ChecklistHa = () => {
  // State to store checklist status
  const [checklistStatus, setChecklistStatus] = useState(null);
  const { reportId } = useReport(); // Retrieve reportId using useReport hook


  const translations = {
    "Fire": "آتش سوزی",
    "ExaminingTheFiringCost": "بررسی عملیات خسارت آتش سوزی",
    "ExaminingTheFiringIssuance": "بررسی عملیات صدور آتش سوزی",
    "Cargo": "باربری",
    "ExaminingTheCargoCost": "بررسی عملیات خسارت بیمه های باربری داخلی",
    "ExaminingTheCargoCostExport": "بررسی عملیات خسارت بیمه های باربری صادراتی",
    "ExaminingTheCargoCostImport": "بررسی عملیات خسارت بیمه های باربری وارداتی",
    "ExaminingTheCargoIssuance": "بررسی عملیات صدور بیمه های باربری",
    "Car": "خودرو",
    "ExaminingTheCarCostBodyInit": "بررسی عملیات بازدید اولیه رشته خودرو بدنه",
    "ExaminingTheCarCostBody": "بررسی عملیات خسارت رشته خودرو - بدنه",
    "ExaminingTheCarIssuanceBody": "بررسی عملیات خسارت رشته شخص ثالث - جانی",
    "ExaminingTheCarCostThirdPersonFinancial": "بررسی عملیات خسارت رشته شخص ثالث - مالی",
    "ExaminingTheCarCostThirdPersonLife": "بررسی عملیات صدور رشته خودرو بدنه",
    "ExaminingTheCarIssuanceThirdPerson": "بررسی عملیات صدور رشته شخص ثالث",
    "LifeGA": "عمر و حوادث گروهی",
    "ExaminingTheLifeGACost": "کاربرگ خسارت بیمه عمر و حوادث گروهی",
    "ExaminingTheLifeGAIssuance": "کاربرگ صدور عمر و حوادث گروهی",
    "Life": "زندگی",
    "ExaminingTheLifeCost": "کاربرگ صدور بیمه‌های زندگی",
    "ExaminingTheLifeIssuance": "کاربرگ خسارت بیمه‌های زندگی",
    "Health": "درمان",
    "ExaminingTheHealthIssuance": "کاربرگ صدور درمان",
    "Liability": "مسئولیت",
    "ExaminingTheLiabilityCost": "بررسی عملیات خسارت بیمه های مسئولیت",
    "ExaminingTheLiabilityIssuance": "بررسی عملیات صدور بیمه های مسئولیت",
    "Engineering": "مهندسی",
    "ExaminingTheEngineeringCost": "بررسی عملیات خسارت مهندسی",
    "ExaminingTheEngineeringIssuanceT": "بررسی عملیات صدور رشته مهندسی تمام خطر نصب و پیمانکاری",
    "ExaminingTheEngineeringIssuanceMachineFailure": "بررسی عملیات صدور رشته مهندسی شکست ماشین آلات"
};


  useEffect(() => {
    // Function to fetch checklist status
    const fetchChecklistStatus =async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // Make GET request to the API endpoint
        const response = await fetch(`http://188.121.99.245/api/report/checklist/checklist_status?report_id=${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Parse JSON response
        const data = await response.json();

        // Set checklist status in state
        setChecklistStatus(data.data);
      } catch (error) {
        console.error('Error fetching checklist status:', error);
      }
    };

    // Call fetchChecklistStatus function when component mounts
    fetchChecklistStatus();
  }, []); // Empty dependency array to run effect only once

  return (
    <>
      <NavList />
      <div className="container mx-auto px-4 my-2" dir='rtl'>

      <h1 className="text-2xl   font-semibold  mb-10    text-[color:var(--color-primary-variant)]" dir='rtl'>وضعیت چک لیست ها </h1>

      <button className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md">
        ساخت پیش نویس گزارش
        </button>
      <div className="max-w-4xl mx-auto mt-8  w-[900px]" dir='rtl'>
        {/* Display checklist status */}
        {checklistStatus && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border-r">موضوع</th>
                <th className="py-2 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="py-2 px-4 border-r">{translations["Fire"]}</td>
                <td className="py-2 px-4">{checklistStatus.fire_status}</td>
              </tr>
              <tr className="bg-gray-100 border-b">
                <td className="py-2 px-4 border-r">{translations["Cargo"]}</td>
                <td className="py-2 px-4">{checklistStatus.cargo_status}</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="py-2 px-4 border-r">{translations["Car"]}</td>
                <td className="py-2 px-4">{checklistStatus.car_status}</td>
              </tr>
              <tr className="bg-gray-100 border-b">
                <td className="py-2 px-4 border-r">{translations["LifeGA"]}</td>
                <td className="py-2 px-4">{checklistStatus.lifeGA_status}</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="py-2 px-4 border-r">{translations["Life"]}</td>
                <td className="py-2 px-4">{checklistStatus.life_status}</td>
              </tr>
              <tr className="bg-gray-100 border-b">
                <td className="py-2 px-4 border-r">{translations["Health"]}</td>
                <td className="py-2 px-4">{checklistStatus.health_status}</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="py-2 px-4 border-r">{translations["Liability"]}</td>
                <td className="py-2 px-4">{checklistStatus.liability_status}</td>
              </tr>
              <tr className="bg-gray-100 border-b">
                <td className="py-2 px-4 border-r">{translations["Engineering"]}</td>
                <td className="py-2 px-4">{checklistStatus.engineering_status}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      
      </div>
    </>
  );
};

export default ChecklistHa;
