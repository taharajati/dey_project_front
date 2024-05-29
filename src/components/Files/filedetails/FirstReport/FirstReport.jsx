
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NavList from '../NavList';

import FindingComponent from './finding_box'; 

import { useReport } from '../ReportContext'; // Adjust the import path as necessary






const englishToPersianNumber = (number) => {
  if (number === undefined || number === null) {
    return '';
  }
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return String(number).replace(/[0-9]/g, (match) => persianDigits[parseInt(match)]);
};

const FirstReport = () => {
  const { reportType } = useParams(); // Get reportType from URL params

  const [reportData, setReportData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { fileId } = useReport(); // Retrieve fileId from ReportContext

  const navigate = useNavigate(); // Use useNavigate hook



  useEffect(() => {
    fetchReportData();
  }, []);
  


  
  const fetchReportData = async () => {
    try {

      const response = await fetch(`http://188.121.99.245:8080/api/report/export/content?report_id=${fileId}&report_type=${reportType}` ,{
       
        headers: {
           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log('reportData8i4874 data', data.data.content);
        setReportData(data.data.content);

        setEditableData(data.data.content);
        setEditedData(data.data.content); // Initialize editedData with fetched data
      } else {
        console.error('Failed to fetch report data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false); // Update loading state after fetching data
    }

  };

  const handleSave = async () => {
    try {

      const response = await fetch("http://188.121.99.245:8080/api/report/export/save_edited", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(editedData),
      });
      if (response.ok) {
        console.log('Report data saved successfully');
        setIsEditing(false); // Exit edit mode
        fetchReportData(); // Refresh data
      } else {
        console.error('Failed to save report data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving report data:', error);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setEditedData(prevState => {
      const newState = { ...prevState };
      let currentState = newState;
      const keys = key.split('.');
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          currentState[key] = englishToPersianNumber(value); // Convert the value to Persian number
        } else {
          currentState[key] = { ...currentState[key] };
          currentState = currentState[key];
        }
      });
      return newState;
    });
  };



console.log('editedData', editedData);


const handleGoBack = () => {
  navigate('/Reporttable'); // Navigate back to the OngoingFiles component
};


  return (
    <>
      <NavList />
      <div className="container mx-auto p-6" dir='rtl'>
        <button
          onClick={handleGoBack}
          className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"
        >
          بازگشت به گزارش
        </button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <br />
            <div className='flex mt-5 mb-5'>
              {isEditing ? (
                <button
                  className="mt-8 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                  onClick={handleSave}
                >
                  ذخیره
                </button>
              ) : (
                <button
                  className="mt-8 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                  onClick={handleEdit}
                >
                  ویرایش
                </button>
              )}
            </div>
            {/* Content for the first_page */}
            <div className="first_page">
              <h1 className="text-5xl font-bold my-9 mb-[200px] text-center">
                {isEditing ? (
                  <textarea
                    className="w-full p-2 rounded-lg border border-gray-300"
                    rows={6}
                    value={englishToPersianNumber(editedData.first_page?.branch_name)}
                    onChange={(e) => handleInputChange(e, 'first_page.branch_name')}
                  />
                ) : (
                  englishToPersianNumber(editedData.first_page?.branch_name)
                )}
              </h1>
              <h2 className="text-xl my-[200px] text-center">
                {isEditing ? (
                  <textarea
                    className="w-full p-2 rounded-lg border border-gray-300"
                    rows={6}
                    value={englishToPersianNumber(editedData.first_page?.report_period)}
                    onChange={(e) => handleInputChange(e, 'first_page.report_period')}
                  />
                ) : (
                  englishToPersianNumber(editedData.first_page?.report_period)
                )}
              </h2>
              <h3 className="text-lg my-4 text-center">
                {isEditing ? (
                  <textarea
                    className="w-full p-2 rounded-lg border border-gray-300"
                    rows={6}
                    value={englishToPersianNumber(editedData.first_page?.date_title)}
                    onChange={(e) => handleInputChange(e, 'first_page.date_title')}
                  />
                ) : (
                  englishToPersianNumber(editedData.first_page?.date_title)
                )}
              </h3>
            </div>

            {/* Content for the introduction */}
            <div className="introduction">
            <h4 className="text-2xl font-bold my-10">
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded-lg border border-gray-300"
                        rows={2}
                        value={englishToPersianNumber(editedData.introduction?.title)}
                        onChange={(e) => handleInputChange(e, 'introduction.title')}
                      />
                    ) : (
                      englishToPersianNumber(reportData.introduction.title)
                    )}
                  </h4>              {isEditing ? (
                <textarea
                  className="w-full p-[60px] rounded-lg border border-gray-300"
                  rows={12}
                  value={englishToPersianNumber(editedData.introduction?.content)}
                  onChange={(e) => handleInputChange(e, 'introduction.content')}
                />
              ) : (
                <div>
                  <p>{englishToPersianNumber(editableData.introduction?.content)}</p>
                </div>
              )}
            </div>

            {/* Content for the evaluation_goals */}
            <div className="evaluation_goals">
            <h4 className="text-2xl font-bold my-10">
                {isEditing ? (
                  <textarea
                    className="w-full p-2 rounded-lg border border-gray-300"
                    rows={2}
                    value={englishToPersianNumber(editedData.evaluation_goals?.title)}
                    onChange={(e) => handleInputChange(e, 'evaluation_goals.title')}
                  />
                ) : (
                  englishToPersianNumber(reportData.evaluation_goals.title)
                )}
              </h4>              {isEditing ? (
                <textarea
                  className="w-full p-[60px] rounded-lg border border-gray-300"
                  rows={12}
                  value={englishToPersianNumber(editedData.evaluation_goals?.content)}
                  onChange={(e) => handleInputChange(e, 'evaluation_goals.content')}
                />
              ) : (
                <div>
                  <p>{englishToPersianNumber(editableData.evaluation_goals?.content)}</p>
                </div>
              )}
            </div>

            {/* Content for the domain */}
            <div className="domain">
            <h4 className="text-2xl font-bold my-10">
                      {isEditing ? (
                        <textarea
                          className="w-full p-2 rounded-lg border border-gray-300"
                          rows={2}
                          value={englishToPersianNumber(editedData.domain?.title)}
                          onChange={(e) => handleInputChange(e, 'domain.title')}
                        />
                      ) : (
                        englishToPersianNumber(reportData.domain.title)
                      )}
                    </h4>              {isEditing ? (
                <textarea
                  className="w-full p-[60px] rounded-lg border border-gray-300"
                  rows={12}
                  value={englishToPersianNumber(editedData.domain?.content)}
                  onChange={(e) => handleInputChange(e, 'domain.content')}
                />
              ) : (
                <div>
                  <p>{englishToPersianNumber(editableData.domain?.content)}</p>
                </div>
              )}
            </div>

          {/* Content for the goals */}
            <div className="goals">
  <h4 className="text-2xl font-bold my-10">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={2}
        value={englishToPersianNumber(editedData.goals?.title) || ''}
        onChange={(e) => handleInputChange(e, 'goals.title')}
      />
    ) : (
      englishToPersianNumber(reportData.goals.title)
    )}
  </h4>

  {isEditing ? (
    <div>
      {reportData.goals.content.map((goal, index) => (
        <div key={index} className="my-4">
          
          <textarea
            className="w-full p-2 rounded-lg border border-gray-300"
            rows={4}
            value={englishToPersianNumber(editedData.goals?.content[index]?.text) || englishToPersianNumber(goal.text)}
            onChange={(e) =>
              handleInputChange(e, `goals.content[${index}].text`)
            }
          />
        </div>
      ))}
    </div>
  ) : (
    <div>
      {reportData.goals.content.map((goal, index) => (
        <div key={index} className="my-4">
          <h5 className="font-semibold">{goal.title}</h5>
          <p>{englishToPersianNumber(goal.text)}</p>
        </div>
      ))}
    </div>
  )}
            </div>

            {/* Content for the personnel */}
            <div className="personnel">
            <h4 className="text-2xl font-bold my-10">
                       {isEditing ? (
                         <textarea
                           className="w-full p-2 rounded-lg border border-gray-300"
                           rows={2}
                           value={englishToPersianNumber(editedData.personnel?.title)}
                           onChange={(e) => handleInputChange(e, 'personnel.title')}
                         />
                       ) : (
                        englishToPersianNumber( )
                       )}
                     </h4>              {isEditing ? (
                <textarea
                  className="w-full p-[60px] rounded-lg border border-gray-300"
                  rows={8}
                  value={englishToPersianNumber(editedData.personnel?.description)}
                  onChange={(e) => handleInputChange(e, 'personnel.description')}
                />
              ) : (
                <div>
                  <p>{englishToPersianNumber(editableData.personnel?.description)}</p>
                </div>
              )}
              <br />
              {reportData.personnel.table && (
                <table className="table-auto w-full mt-8" dir='rtl'>
                  <caption className="text-lg font-semibold mb-12">{reportData.personnel.table.caption}</caption>
                  <thead>
                    <tr className="bg-gray-200">
                      {Object.values(reportData.personnel.table.column_names).map((columnName, index) => (
                        <th key={index} className="px-4 py-2">{columnName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isEditing ? (
                      reportData.personnel?.table?.data.map((rowData, rowIndex) => (
                        <tr key={rowIndex} className="bg-white">
                          <td className="px-4 py-2">
                            <input
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel.table.data[rowIndex].first_name)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].first_name`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.last_name)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].last_name`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.degree)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].degree`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.major)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].major`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.hiring_date_jalali)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].hiring_date_jalali`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.position)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].position`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.experience_relative)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].experience_relative`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.experience_semi_relative)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].experience_semi_relative`)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 rounded-lg border border-gray-300"
                              value={englishToPersianNumber(editedData.personnel?.table?.data[rowIndex]?.experience_not_relative)}
                              onChange={(e) =>
                                handleInputChange(e, `personnel.table.data[${rowIndex}].experience_not_relative`)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Render plain text for non-editing mode
                      reportData.personnel?.table?.data.map((rowData, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.first_name)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.last_name)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.degree)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.major)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.hiring_date_jalali)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.position)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.experience_relative)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.experience_semi_relative)}</td>
                          <td className="px-4 py-2 text-center">{englishToPersianNumber(rowData.experience_not_relative)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
     
    

{/* Content for the performance_control */}
<div className="performance_control">
  <h4 className="text-2xl font-bold my-10">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={2}
        value={englishToPersianNumber(editedData.performance_control.title)}
        onChange={(e) => handleInputChange(e, 'performance_control.title')}
      />
    ) : (
      englishToPersianNumber(reportData.performance_control.title)
    )}
  </h4>
  <p className="mb-6">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={4}
        value={englishToPersianNumber(editedData.performance_control.description)}
        onChange={(e) => handleInputChange(e, 'performance_control.description')}
      />
    ) : (
      englishToPersianNumber(reportData.performance_control.description)
    )}
  </p>
  <table className="table-auto w-full mt-8" dir='rtl'>
  <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(reportData.performance_control.table.caption)}</caption>
  <thead>
    <tr className="bg-gray-200">
      {Object.values(reportData.performance_control.table.column_names).map((columnName, index) => (
        <th key={index} className="px-4 py-2">{columnName}</th>
      ))}
    </tr>
  </thead>
  <tbody> 
    {isEditing ? (
      editedData.performance_control.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className="bg-white">
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.insurance_revenue)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].insurance_revenue`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.loss)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].loss`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.commission_cost)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].commission_cost`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.administrative_costs)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].administrative_costs`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.other_operational_costs)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].other_operational_costs`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.non_operational_revenue)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].non_operational_revenue`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.personnel_costs)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].personnel_costs`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.depreciation_costs)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].depreciation_costs`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.cost_ratio)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].cost_ratio`)}
            />
          </td>
          <td className="px-4 py-2">
            <input
              className="w-full p-2 rounded-lg border border-gray-300"
              value={englishToPersianNumber(rowData.profit_loss)}
              onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].profit_loss`)}
            />
          </td>
        </tr>
      ))
    ) : (
      reportData.performance_control.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100 item" : "bg-white"}>
          <td className={`px-4 py-2 text-center ${rowData.insurance_revenue < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.insurance_revenue)}</td>
          <td className={`px-4 py-2 text-center ${rowData.loss < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.loss)}</td>
          <td className={`px-4 py-2 text-center ${rowData.commission_cost < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.commission_cost)}</td>
          <td className={`px-4 py-2 text-center ${rowData.administrative_costs < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.administrative_costs)}</td>
          <td className={`px-4 py-2 text-center ${rowData.other_operational_costs < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.other_operational_costs)}</td>
          <td className={`px-4 py-2 text-center ${rowData.non_operational_revenue < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.non_operational_revenue)}</td>
          <td className={`px-4 py-2 text-center ${rowData.personnel_costs < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.personnel_costs)}</td>
          <td className={`px-4 py-2 text-center ${rowData.depreciation_costs < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.depreciation_costs)}</td>
          <td className={`px-4 py-2 text-center ${rowData.cost_ratio < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.cost_ratio)}</td>
          <td className={`px-4 py-2 text-center ${rowData.profit_loss < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(rowData.profit_loss)}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

</div>

{/* Content for the FinancialPerformanceIssueLossCompareBudget */}
<div className="FinancialPerformanceIssueLossCompareBudget">
  <h4 className="text-2xl font-bold my-10">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={2}
        value={englishToPersianNumber(editedData.FinancialPerformanceIssueLossCompareBudget.title)}
        onChange={(e) => handleInputChange(e, 'FinancialPerformanceIssueLossCompareBudget.title')}
      />
    ) : (
      englishToPersianNumber(reportData.FinancialPerformanceIssueLossCompareBudget.title)
    )}
  </h4>
  <p className="mb-6">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={4}
        value={englishToPersianNumber(editedData.FinancialPerformanceIssueLossCompareBudget.description)}
        onChange={(e) => handleInputChange(e, 'FinancialPerformanceIssueLossCompareBudget.description')}
      />
    ) : (
      englishToPersianNumber(reportData.FinancialPerformanceIssueLossCompareBudget.description)
    )}
  </p>
  <table className="table-auto w-full" dir='ltr'>
      <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(reportData.FinancialPerformanceIssueLossCompareBudget.table.caption)}</caption>
      <thead>
        <tr className="bg-gray-200">
          {Object.values(reportData.FinancialPerformanceIssueLossCompareBudget.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isEditing ? (
          editedData.FinancialPerformanceIssueLossCompareBudget.table.data.map((rowData, rowIndex) => (
            <tr key={rowIndex} className="bg-white">
              {Object.keys(rowData).map((key, index) => (
                <td key={index} className="px-4 py-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-gray-300"
                    value={englishToPersianNumber(rowData[key])}
                    onChange={(e) => handleInputChange(e, `FinancialPerformanceIssueLossCompareBudget.table.data[${rowIndex}].${key}`)}
                    />
                </td>
              ))}
            </tr>
          ))
        ) : (
          reportData.FinancialPerformanceIssueLossCompareBudget.table.data.map((rowData, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              {Object.values(rowData).map((value, index) => (
                <td key={index} className={`px-4 py-2 text-center ${value < 0 ? 'text-red-500' : ''}`}>{englishToPersianNumber(value)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
</div>


 {/* Content for the Finding_1 */}

<div className="Finding_1">

 <FindingComponent
  finding="Finding_1"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_1?.finding_group}
/>
  </div>

 {/* Content for the SalesPerformance */}

<div className="FindiSalesPerformanceng_1">
  <h4 className="text-2xl font-bold my-10 p-5">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.SalesPerformance.title)}
        onChange={(e) => handleInputChange(e, 'SalesPerformance.title')}
      />
    ) : (
      englishToPersianNumber(reportData.SalesPerformance.title)
    )}
  </h4>
  <p className='px-5 pb-5'>
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.SalesPerformance.description)}
        onChange={(e) => handleInputChange(e, 'SalesPerformance.description')}
      />
    ) : (
      englishToPersianNumber(reportData.SalesPerformance.description)
    )}
  </p>
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {englishToPersianNumber(reportData.SalesPerformance.table.caption)}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(reportData.SalesPerformance.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.SalesPerformance.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `SalesPerformance.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        reportData.SalesPerformance.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center ${rowData[key] < 0 ? 'text-red-500' : ''}`}>
                {englishToPersianNumber(rowData[key])}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


 {/* Content for the Finding_2 */}

<div className="Finding_2">

<FindingComponent
  finding="Finding_2"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_2?.finding_group}
/>
  </div>

{/* Content for the AgentSales */}
<div className="AgentSales my-8">
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {englishToPersianNumber(editedData.AgentSales.table.caption)}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.AgentSales.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.AgentSales.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `AgentSales.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.AgentSales.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* Content for the AgentsLoss */}
<div className="AgentsLoss my-8">
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {englishToPersianNumber(editedData.AgentsLoss.table.caption)}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.AgentsLoss.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.AgentsLoss.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `AgentsLoss.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.AgentsLoss.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* Content for OperationalPlan */}
<div className="OperationalPlan">
  <h4 className="text-2xl font-bold my-8 p-2">
    {isEditing ? (
      <input
        type="text"
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.OperationalPlan.title)}
        onChange={(e) => handleInputChange(e, 'OperationalPlan.title')}
      />
    ) : (
      englishToPersianNumber(editedData.OperationalPlan.title)
    )}
  </h4>
  <div className='px-5 pb-2'>
    <p>
      {isEditing ? (
        <textarea
          className="w-full p-2 rounded-lg border border-gray-300"
          rows={4}
          value={englishToPersianNumber(editedData.OperationalPlan.content)}
          onChange={(e) => handleInputChange(e, 'OperationalPlan.content')}
        />
      ) : (
        englishToPersianNumber(editedData.OperationalPlan.content)
      )}
    </p>
  </div>
</div>

{/* Content for Finding_3 */}

<div  className="Finding_3">
  <FindingComponent
  finding="Finding_3"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_3?.finding_group}
/>
</div>
 
{/* Content for the Assets */}
<div className="Assets my-8">
  <h4 className="text-2xl font-bold my-10 p-5">
    {isEditing ? (
      <input
        type="text"
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.Assets.title)}
        onChange={(e) => handleInputChange(e, 'Assets.title')}
      />
    ) : (
      englishToPersianNumber(reportData.Assets.title)
    )}
  </h4>
  <p className='px-5 pb-5'>
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={4}
        value={englishToPersianNumber(editedData.Assets.description)}
        onChange={(e) => handleInputChange(e, 'Assets.description')}
      />
    ) : (
      englishToPersianNumber(reportData.Assets.description)
    )}
  </p>
</div>

 {/* Content for Finding_4 */}

 <div  className="Finding_4">

<FindingComponent
  finding="Finding_4"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_4?.finding_group}
/>
  </div>
  

{/* Claims */}
<div className="Claims">
  <h4 className="text-2xl font-bold my-6 p-2">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.Claims.title)}
        onChange={(e) => handleInputChange(e, 'Claims.title')}
      />
    ) : (
      englishToPersianNumber(editedData.Claims.title)
    )}
  </h4>
  <p className="px-5 pb-2">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        value={englishToPersianNumber(editedData.Claims.content)}
        onChange={(e) => handleInputChange(e, 'Claims.content')}
      />
    ) : (
      englishToPersianNumber(editedData.Claims.content)
    )}
  </p>
</div>

{/* ClaimRemain */}
<div className="ClaimRemain">
  <table className="table-auto w-full my-8" dir='rtl'>
    <caption className="text-lg font-semibold mb-6">
      {isEditing ? (
        <textarea
          className="w-full p-2 rounded-lg border border-gray-300"
          value={englishToPersianNumber(editedData.ClaimRemain.table.caption)}
          onChange={(e) => handleInputChange(e, 'ClaimRemain.table.caption')}
        />
      ) : (
        englishToPersianNumber(editedData.ClaimRemain.table.caption)
      )}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.ClaimRemain.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300"
                value={columnName}
                onChange={(e) => handleInputChange(e, `ClaimRemain.table.column_names[${index}]`)}
              />
            ) : (
              columnName
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {editedData.ClaimRemain.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          {Object.values(rowData).map((cellData, cellIndex) => (
            <td key={cellIndex} className="px-4 py-2 text-center">
              {englishToPersianNumber(cellData)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* ClaimsDecomByAge */}
<div className="ClaimsDecomByAge ">
  <table className="table-auto w-full my-8" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {isEditing ? (
        <textarea
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.ClaimsDecomByAge.table.caption}
          onChange={(e) => handleInputChange(e, 'ClaimsDecomByAge.table.caption')}
        />
      ) : (
        editedData.ClaimsDecomByAge.table.caption
      )}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.ClaimsDecomByAge.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300"
                value={columnName}
                onChange={(e) => handleInputChange(e, `ClaimsDecomByAge.table.column_names[${index}]`)}
              />
            ) : (
              columnName
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {editedData.ClaimsDecomByAge.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          {Object.values(rowData).map((cellData, cellIndex) => (
            <td key={cellIndex} className="px-4 py-2 text-center">
              {typeof cellData === 'number' ? cellData.toLocaleString() : cellData}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* ClaimsDecomByInsuranceType */}
<div className="ClaimsDecomByInsuranceType">
  <table className="table-auto w-full my-8" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {isEditing ? (
        <textarea
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.ClaimsDecomByInsuranceType.table.caption}
          onChange={(e) => handleInputChange(e, 'ClaimsDecomByInsuranceType.table.caption')}
        />
      ) : (
        editedData.ClaimsDecomByInsuranceType.table.caption
      )}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.ClaimsDecomByInsuranceType.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300"
                value={columnName}
                onChange={(e) => handleInputChange(e, `ClaimsDecomByInsuranceType.table.column_names[${index}]`)}
              />
            ) : (
              columnName
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {editedData.ClaimsDecomByInsuranceType.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          {Object.values(rowData).map((cellData, cellIndex) => (
            <td key={cellIndex} className="px-4 py-2 text-center">
              {typeof cellData === 'number' ? cellData.toLocaleString() : cellData}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>


 
 {/* Finding_5 */}

 <div className="Finding_5">

  <FindingComponent
  finding="Finding_5"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_5?.finding_group}
/>
</div>

{/* SalesNetwork */}
<div className="SalesNetwork my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full p-2 rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.SalesNetwork.title)}
      onChange={(e) => handleInputChange(e, 'SalesNetwork.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10  p-5">{englishToPersianNumber(editedData.SalesNetwork.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.SalesNetwork.description)}
      onChange={(e) => handleInputChange(e, 'SalesNetwork.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.SalesNetwork.description)}</p>
  )}
</div>

{/* AgentsRevenue */}
<div className="AgentsRevenue my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full p-2 rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.AgentsRevenue.title)}
      onChange={(e) => handleInputChange(e, 'AgentsRevenue.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10  p-5">{englishToPersianNumber(editedData.AgentsRevenue.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.AgentsRevenue.description)}
      onChange={(e) => handleInputChange(e, 'AgentsRevenue.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.AgentsRevenue.description)}</p>
  )}
   <table className="table-auto w-full" dir='rtl'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.AgentsRevenue.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.AgentsRevenue.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.AgentsRevenue.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `AgentsRevenue.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.AgentsRevenue.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>





             <div className='flex mt-5 mb-5'>
             
              {isEditing ? (
                <button
                  className="mt-8 bg-[color:var(--color-bg-variant)]  hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                  onClick={handleSave}
                >
                  ذخیره
                </button>
              ) : (
                <button
                  className="mt-8 bg-[color:var(--color-bg-variant)]  hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                  onClick={handleEdit}
                >
                  ویرایش
                </button>
              )}
            </div>


 <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>
          </>
        )}
         <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>
      </div>
      <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>
    </>
  );
};

export default FirstReport;