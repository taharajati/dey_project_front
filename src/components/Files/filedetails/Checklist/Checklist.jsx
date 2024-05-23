import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from '../NavList';
import Modal from './Modal';
import { FaTrash } from "react-icons/fa";
import { useReport } from '../ReportContext';

const Checklist = () => {
  const [checklistData, setChecklistData] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorCheck, setErrorCheck] = useState('');
  const [successCheck, setSuccessCheck] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [currentFormDefinition, setCurrentFormDefinition] = useState({});
  const [sectionName, setSectionName] = useState("");
  const [formData, setFormData] = useState({});
  const [detailName, setDetailName] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rowToDelete, setRowToDelete] = useState({ tableId: null, detailName: null });

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
    if (fileId) {
      fetchChecklistData(fileId);
    } else {
      setError('Report ID not found');
      setLoading(false);
    }
  }, [fileId]);

  const fetchChecklistData = async (fileId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const originalUrl = `http://188.121.99.245:8080/api/report/checklist/?report_id=${fileId}`;
      const newUrl = `http://188.121.99.245:8080/api/report/checklist/user_role?report_id=${fileId}`;

      // First attempt to fetch data from the original URL
      try {
        console.log(`Fetching checklist data from: ${originalUrl}`);
        const response = await axios.get(originalUrl, { headers: { Authorization: `Bearer ${token}` } });
        console.log('API response from original URL:', response);
        if (response.data && response.data.data) {
          setChecklistData(response.data.data);
        } else {
          setChecklistData({});
        }
      } catch (error) {
        console.error('Failed to fetch checklist data from original URL:', error);

        // If the first fetch fails, attempt to fetch data from the new URL
        console.log(`Fetching checklist data from: ${newUrl}`);
        const response = await axios.get(newUrl, { headers: { Authorization: `Bearer ${token}` } });
        console.log('API response from new URL:', response);
        if (response.data && response.data.data) {
          setChecklistData(response.data.data);
        } else {
          setChecklistData({});
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch checklist data:', error);
      setError('Failed to fetch checklist data');
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (!currentFormDefinition || !currentFormDefinition.section || !currentFormDefinition.detail) {
        console.error("Error: currentFormDefinition is not properly defined.");
        return;
      }
      formData.fileId = fileId;
      const updatedData = { ...checklistData };
      updatedData[currentFormDefinition.section][currentFormDefinition.detail].data.push(formData);
      setChecklistData(updatedData);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const openForm = (section, detail) => {
    setCurrentFormDefinition({ section, detail });
    setSectionName(section);
  };

  const handleAddRowClick = (section, detail) => {
    setDetailName(detail);
    setShowQuestionModal(true);
    openForm(section, detail);
  };

  const handleQuestionModalClose = () => {
    setShowQuestionModal(false);
  };

  const handleDeleteClick = (tableId, detailName) => {
    setRowToDelete({ tableId, detailName });
    setShowConfirmation(true);
  };

  const cancelDeleteTableRow = () => {
    setShowConfirmation(false);
    setRowToDelete({ tableId: null, detailName: null });
  };

  const confirmDeleteTableRow = async () => {
    const { tableId, detailName } = rowToDelete;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://188.121.99.245:8080/api/report/checklist/${detailName}?item_id=${tableId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedData = { ...checklistData };
      updatedData[currentFormDefinition.section][currentFormDefinition.detail].data = updatedData[currentFormDefinition.section][currentFormDefinition.detail].data.filter(item => item._id?.$oid !== tableId);
      setChecklistData(updatedData);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting table row:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === "insurance_number" || name === "total_cost") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };


   // Function to handle click on "Complete Checklist" button
   const handleCompleteChecklist = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `http://188.121.99.245:8080/api/report/checklist/finished`;
      const payload = {
        report_id: fileId
      };
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessCheck('چک لیست تکمیل شد', response.data);
      setTimeout(() => {
        setSuccessCheck('');
    }, 3000);
      // Optionally, you can handle the response and show a success message
    } catch (error) {
      setErrorCheck('خطا در تکمیل چک لیست', error);
      setTimeout(() => {
        setErrorCheck('');
    }, 3000);
      // Optionally, you can handle errors and show an error message
    }
  };


  return (
    <>
      <NavList />

      <Modal isOpen={showQuestionModal} onClose={handleQuestionModalClose} detailName={detailName} fileId={fileId} formData={formData} handleChange={handleChange} onSubmit={handleFormSubmit}>
        <h2 className="text-xl font-semibold text-gray-800">Your Question Goes Here</h2>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </Modal>
      <div className="  justify-center">
      <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>
      <h1 className="text-2xl font-semibold mb-10 text-[color:var(--color-primary-variant)]" dir='rtl'>چک لیست</h1>

      <button onClick={handleCompleteChecklist} className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md mb-4">
          تکمیل چک لیست
        </button>
        {errorCheck && <p className="bg-red-100 text-red-800 text-center p-2 rounded">{errorCheck}</p>}
        {successCheck && <p className="bg-green-100 text-green-800 text-center p-2 rounded">{successCheck}</p>}

        {Object.entries(checklistData).length > 0 ? Object.entries(checklistData).map(([sectionName, sectionDetails]) => (
          <div key={sectionName} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">{translations[sectionName] || sectionName}</h2>
            {Object.entries(sectionDetails).map(([detailName, detail]) => (
              <div key={detailName} className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">{translations[detailName] || detailName}</h3>
                <button onClick={() => handleAddRowClick(sectionName, detailName)} className="text-[11px] mb-2 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded">
                  افزودن ردیف جدید
                </button>
                {detail.data && detail.data.length > 0 ? (
                  <div className="overflow-x-auto shadow-md w-[80%]">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left"></th>
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
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                              <button onClick={() => handleDeleteClick(item._id?.$oid, detailName)} className="text-red-500">
                                <FaTrash />
                              </button>
                            </td>
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
        )) : <p className="text-center text-lg">اطلاعاتی موجود نیست.</p>}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md">
              <p className="text-lg font-semibold mb-4">آیا مطمئن هستید که می‌خواهید این سطر را حذف کنید؟</p>
              <div className="flex justify-between">
                <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2" onClick={confirmDeleteTableRow}>
                  بله، حذف کن
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={cancelDeleteTableRow}>
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Checklist;

