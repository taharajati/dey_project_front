
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from '../NavList';
import Modal from './Modal';

import { useReport } from '../ReportContext'; // Import the useReport hook


const Checklist = () => {
  const [checklistData, setChecklistData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentFormDefinition, setCurrentFormDefinition] = useState({});
  const [sectionName, setSectionName] = useState("");
  const [formData, setFormData] = useState({});
  const [detailName, setDetailName] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);

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
    if (reportId) {
      fetchChecklistData(reportId);
    } else {
      setError('Report ID not found');
      setLoading(false);
    }
  }, [reportId]);

  const fetchChecklistData = async (reportId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `http://188.121.99.245/api/report/checklist/?report_id=${reportId}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setChecklistData(response.data.data || {});
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch checklist data');
      setLoading(false);
      console.error(error);
    }
  };


  const handleFormSubmit = async (formData) => {
    if (!currentFormDefinition || !currentFormDefinition.section || !currentFormDefinition.detail) {
      console.error("Error: currentFormDefinition is not properly defined.");
      return;
    }

    formData.reportId = reportId;


    const newData = { ...checklistData };
    newData[currentFormDefinition.section][currentFormDefinition.detail].data.push(formData);
    setChecklistData(newData);
    setShowForm(false); // Close form after submission
  };


  const openForm = (section, detail) => {
    setCurrentFormDefinition({ section, detail });
    setSectionName(section); // Update sectionName state when modal is opened
  };

  const handleAddRowClick = (section) => {
    console.log("Add New Row button clicked");
    // Find the corresponding detailName from checklistData using section
    const detailName = Object.keys(checklistData[section])[0]; // Get the first detailName for the section
    setDetailName(detailName); // Set detailName in the state
    setShowQuestionModal(true);
    openForm(section, detailName); // Ensure both section and detailName are passed to openForm
  };


  const handleQuestionModalClose = () => {
    setShowQuestionModal(false);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    
    // Update insuranceNumber and amount fields if they are changed
    if (name === "insurance_number" || name === "total_cost") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  return (
    <>
 <NavList/>
 <Modal isOpen={showQuestionModal} onClose={handleQuestionModalClose} detailName={detailName}   reportId={reportId}  formData={formData} handleChange={handleChange} onSubmit={handleFormSubmit} >



  <h2 className="text-xl font-semibold text-gray-800">Your Question Goes Here</h2>

  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Submit
  </button>
</Modal>
      <div className="container mx-auto px-4 my-2" dir='rtl'>
      
        {Object.entries(checklistData).length > 0 ? Object.entries(checklistData).map(([sectionName, sectionDetails]) => (
          <div key={sectionName} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">{translations[sectionName] || sectionName}</h2>
            {Object.entries(sectionDetails).map(([detailName, detail]) => (
              <div key={detailName} className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">{translations[detailName] || detailName}</h3>
                <button onClick={() => handleAddRowClick(sectionName, detailName)} className=" text-[11px] mb-2 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)]  text-white font-bold py-2 px-4 rounded">
                افزودن ردیف جدید
</button>
                {detail.data && detail.data.length > 0 ? (
                  <div className="overflow-x-auto shadow-md">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">تاریخ </th>
                          <th className="py-3 px-6 text-left">شماره بیمه</th>
                          <th className="py-3 px-6 text-left">هزینه کل</th>
                          {Object.keys(detail.data[0]).filter(key => key.startsWith('q')).map(q => (
                            <th key={q} className="py-3 px-6 text-center">{q.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detail.data.map((item, index) => (
                          <tr key={index} className="bg-white border-b border-gray-200">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{item.date_filled_str}</td>
                            <td className="py-3 px-6 text-left">{item.insurance_number}</td>
                            <td className="py-3 px-6 text-left">{item.total_cost}</td>
                            {Object.keys(item).filter(key => key.startsWith('q')).map(q => (
                              <td key={q} className={`py-3 px-6 text-center ${item[q] ? 'text-green-500' : 'text-red-500'}`}>
                                {item[q] ? 'بله' : 'خیر'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className='text-[color:var(--color-primary-variant)]'>هیچ داده ای برای این دسته در دسترس نیست</p>}
              </div>
            ))}
          </div>
        )) : <p className="text-center text-lg  ">اطلاعاتی موجود نیست.</p>}
      </div>
    </>
  );
};

export default Checklist;