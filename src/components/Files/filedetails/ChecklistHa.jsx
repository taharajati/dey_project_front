import React, { useState, useEffect , useContext } from 'react';
import NavList from './NavList';
import { useReport } from '../filedetails/ReportContext';
import { PermissionsContext } from '../../../App'; // Import the context


const ChecklistHa = () => {
  const [checklistStatus, setChecklistStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const permissions = useContext(PermissionsContext); // Use the context


  const { fileId } = useReport();



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
    const fetchChecklistStatus = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://188.121.99.245:8080/api/report/checklist/checklist_status?report_id=${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setChecklistStatus(data.data);
      } catch (error) {
        console.error('Error fetching checklist status:', error);
        setError(' دریافت نشد. لطفا دوباره تلاش کنید');
        setTimeout(() => {
          setError('');
      }, 3000);
        
      }finally {
        setIsLoading(false);
      }
    };

    fetchChecklistStatus();
  }, [fileId]);

  const handleCreateReport = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('accessToken');
      const url = 'http://188.121.99.245:8080/api/report/export/';
      const payload = { report_id: fileId };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      setSuccessMessage('صدور گزارش با وفقیت انجام شد'); // Display a pop-up for successful upload
      setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
      console.log('Report export response:', responseData);
      // Optionally, you can handle the response accordingly
    } catch (error) {
      console.error('Error exporting report:', error);
      setError('خطا در صدور گزارش:');
      setTimeout(() => {
        setError('');
    }, 3000);
      // Optionally, you can handle errors and show an error message
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavList />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}

      {permissions?.checklist_status_detail.list&& (

      <div className="  justify-center">
      <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>
        <h1 className="text-2xl font-semibold mb-10 text-[color:var(--color-primary-variant)]" dir='rtl'>وضعیت چک لیست ها </h1>
         


        <button onClick={handleCreateReport} className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md">
          
        {isLoading ? 'درحال ایجاد متن گزارش اولیه' : 'ایجاد متن گزارش اولیه'}

          
        </button>
        <div className="max-w-4xl  mt-8  " dir='rtl'>
        {/* Display checklist status */}
        {checklistStatus && (
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border-r">موضوع</th>
                <th className="py-2 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b  ">
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
      </div>

)}
            {/* Error Pop-up */}
            {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChecklistHa;
