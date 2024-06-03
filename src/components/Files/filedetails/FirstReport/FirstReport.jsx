
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NavList from '../NavList';
import { Chart, CategoryScale, LinearScale, LineController, PointElement, LineElement, Title } from 'chart.js/auto';

import FindingComponent from './finding_box'; 

import { useReport } from '../ReportContext'; // Adjust the import path as necessary


Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, Title); // Register necessary components




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
  const chartCanvasRef = useRef(null);
  const pieChart1CanvasRef = useRef(null);
  const pieChart2CanvasRef = useRef(null);
  const navigate = useNavigate(); // Use useNavigate hook



  useEffect(() => {
    fetchReportData();
  }, []);
  

  useEffect(() => {
    if (reportData) {
      createChart(); // Call createChart when reportData is available
    }
    
  }, [reportData]);
  
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
 


  const createChart = () => {
    const ctx = chartCanvasRef.current.getContext('2d');
    const persianLabels = reportData.Chart_1.x_axis_labels.map(label => englishToPersianNumber(label));
    const persianPerformanceData = reportData.Chart_1.data.map(item => englishToPersianNumber(item.performance));
    const persianBudgetData = reportData.Chart_1.data.map(item => englishToPersianNumber(item.premium_budget));
    const performanceDataEnglish = reportData.Chart_1.data.map(item => item.performance); // Keep data in English
    const BudgetDataEnglish = reportData.Chart_1.data.map(item => item.premium_budget); // Keep data in English

    console.log('Persian Labels:', persianLabels);
    console.log('Persian Performance Data:', persianPerformanceData);
    console.log('Persian Budget Data:', persianBudgetData);

    Chart.defaults.font.size = 20;
    Chart.defaults.font.family = "Lalezar"
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: reportData.Chart_1.x_axis_labels,
        datasets: [
          {
            label: 'کارایی',
            data: performanceDataEnglish,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'بودجه ممتاز',
            data: BudgetDataEnglish,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',

            font: {
              size: 25 // Larger font size for x-axis labels
            },
            
            grid: {
              display: false
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
              callback: function(value, index, values) {
                return englishToPersianNumber(value);
              },
              font: {
                size: 25 // Larger font size for y-axis ticks
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += englishToPersianNumber(context.parsed.y);
                return label;
              }
            },
            title: {
              font: {
                size: 25 // Larger font size for tooltip title
              }
            },
            body: {
              font: {
                size: 25 // Larger font size for tooltip body
              }
            }
          },
          legend: {
            display: true,
            labels: {
              fontSize: 25 // Larger font size for legend labels
            },
            title: {
              font: {
                size: 25 // Larger font size for legend labels
              }
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 25 // Larger font size for legend labels
            }
          }
        }
      }
      
    });
    
    

    // Next, create the first pie chart
    const pieChart1Ctx = pieChart1CanvasRef.current.getContext('2d');
    const pieChart1 = new Chart(pieChart1Ctx, {
        type: 'pie',
        data: {
            labels: reportData.Chart_2.x_axis_labels,
            datasets: [{
                label: reportData.Chart_2.caption,
                data: reportData.Chart_2.data.map(item => item.value),
                backgroundColor:  [
                  '#FF5252', // Color for خودرو شخص ثالث
                  '#FFC352', // Color for عمر گروهی
                  '#EFFF52', // Color for آتش سوزی
                  '#89FF52', // Color for بدنه اتومبیل
                  '#52FFB8', // Color for باربری
                  '#52CDFF', // Color for درمان
                  '#5C52FF', // Color for حوادث
                  '#A352FF', // Color for مسئولیت
                  '#E552FF', // Color for مهندسی
                  '#FF52D0', // Color for سایر (کشتی)
                  '#52FF77', // Color for عمر و سرمایه گذاری
                 
              ],
                borderColor: 'rgba(255, 255, 255)',
                borderWidth: 1
            }]
        },
        options: {
            // Options for the first pie chart...
        }
    });

    // Finally, create the second pie chart
    const pieChart2Ctx = pieChart2CanvasRef.current.getContext('2d');
    const pieChart2 = new Chart(pieChart2Ctx, {
        type: 'pie',
        data: {
            labels: reportData.Chart_3.x_axis_labels,
            datasets: [{
                label: reportData.Chart_3.caption,
                data: reportData.Chart_3.data.map(item => item.value),
                backgroundColor: [
                  '#FF5252', // Color for خودرو شخص ثالث
                  '#FFC352', // Color for عمر گروهی
                  '#EFFF52', // Color for آتش سوزی
                  '#89FF52', // Color for بدنه اتومبیل
                  '#52FFB8', // Color for باربری
                  '#52CDFF', // Color for درمان
                  '#5C52FF', // Color for حوادث
                  '#A352FF', // Color for مسئولیت
                  '#E552FF', // Color for مهندسی
                  '#FF52D0', // Color for سایر (کشتی)
                  '#52FF77', // Color for عمر و سرمایه گذاری
                 
              ],
                borderWidth: 1
            }]
        },
        options: {
            // Options for the second pie chart...
        }
    });
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


{/* Content for the FinancialPerformanceIssueLossByType */}

<div className="FinancialPerformanceIssueLossByType">
  {isEditing ? (
    <textarea
      className="w-full p-2 rounded-lg border border-gray-300"
      rows={2}
      value={englishToPersianNumber(editedData.FinancialPerformanceIssueLossByType.title)}
      onChange={(e) => handleInputChange(e, 'FinancialPerformanceIssueLossByType.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10">
      {englishToPersianNumber(reportData.FinancialPerformanceIssueLossByType.title)}
    </h4>
  )}
  {isEditing ? (
    <textarea
      className="w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.FinancialPerformanceIssueLossByType.description)}
      onChange={(e) => handleInputChange(e, 'FinancialPerformanceIssueLossByType.description')}
    />
  ) : (
    <p className="mb-6">
      {englishToPersianNumber(reportData.FinancialPerformanceIssueLossByType.description)}
    </p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">
      {englishToPersianNumber(reportData.FinancialPerformanceIssueLossByType.table.caption)}
    </caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(reportData.FinancialPerformanceIssueLossByType.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{englishToPersianNumber(columnName)}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.FinancialPerformanceIssueLossByType.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {Object.keys(rowData).map((key, index) => (
              <td key={index} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `FinancialPerformanceIssueLossByType.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        reportData.FinancialPerformanceIssueLossByType.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((value, index) => (
              <td key={index} className={`px-4 py-2 text-center ${value < 0 ? 'text-red-500' : ''}`}>
                {englishToPersianNumber(value)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>



  {/* Content for the Chart_1 */}

  <caption className="text-lg font-semibold my-6 w-[800px]">{reportData.Chart_1.caption}</caption>
 
   <div className=" text-lg " style={{ width: '1350px', height: '690px' }}>
 
     <canvas className=' text-5x' ref={chartCanvasRef}></canvas>
   </div>

   {/* Content for the Chart_2 */}

   <caption className="text-lg font-semibold my-6 w-[800px] ">{reportData.Chart_2.caption}</caption>
 
   <div className=" mr-[400px]" style={{ width: '600px', height: '450px' }}>
       <canvas ref={pieChart1CanvasRef}></canvas>
     </div>

     {/* Content for the Chart_3 */}

     <caption className="text-lg font-semibold my-6 w-[800px]">{reportData.Chart_3.caption}</caption>
 
     <div className="mr-[400px]" style={{ width: '600px', height: '450px' }}>
       <canvas ref={pieChart2CanvasRef}></canvas>
     </div>


 {/* Content for the Finding_Branch_performance_control_with_approved_budget */}

<div className="Finding_Branch_performance_control_with_approved_budget">
        <FindingComponent
          finding="Finding_Branch_performance_control_with_approved_budget"
          editedData={editedData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          findingGroup={reportData?.Finding_Branch_performance_control_with_approved_budget?.finding_group}
        />
      </div>

 {/* Content for the SalesPerformance */}

<div className="SalesPerformance">
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


 {/* Content for the Finding_Sales_network_performance */}

 <div className="Finding_Sales_network_performance">
        <FindingComponent
          finding="Finding_Sales_network_performance"
          editedData={editedData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          findingGroup={reportData?.Finding_Sales_network_performance?.finding_group}
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

{/* Content for Finding_Operational_program_of_the_branch */}

<div className="Finding_Operational_program_of_the_branch">
        <FindingComponent
          finding="Finding_Operational_program_of_the_branch"
          editedData={editedData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          findingGroup={reportData?.Finding_Operational_program_of_the_branch?.finding_group}
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

{/* Content for Finding_Property_and_assets_of_the_branch */}

<div className="Finding_Property_and_assets_of_the_branch">
        <FindingComponent
          finding="Finding_Property_and_assets_of_the_branch"
          editedData={editedData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          findingGroup={reportData?.Finding_Property_and_assets_of_the_branch?.finding_group}
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


 
 {/* Finding_Branch_claims_status */}

 <div className="Finding_Branch_claims_status">

  <FindingComponent
  finding="Finding_Branch_claims_status"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Branch_claims_status?.finding_group}
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


 {/* Finding_Branch_sales_network */}

 <div className="Finding_Branch_sales_network">

  <FindingComponent
  finding="Finding_Branch_sales_network"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Branch_sales_network?.finding_group}
/>
</div>

{/* PerformanceControlOfBranch */}
<div className="PerformanceControlOfBranch my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full  rounded-lg border border-gray-300"
      value={editedData.PerformanceControlOfBranch.title}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.PerformanceControlOfBranch.description}</p>
  )}
</div>

{/* PerformanceControlOfBranch_CarThird */}
<div className="PerformanceControlOfBranch_CarThird my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full  rounded-lg border border-gray-300"
      value={editedData.PerformanceControlOfBranch_CarThird.title}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_CarThird.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_CarThird.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch_CarThird.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_CarThird.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.PerformanceControlOfBranch_CarThird.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_CarThird.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_CarThird.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_CarThird.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_CarThird.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_CarThird.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_CarThird */}
<div className="InsurancePerformanceByTypeOther_CarThird my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full  rounded-lg border border-gray-300"
      value={editedData.InsurancePerformanceByTypeOther_CarThird.title}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_CarThird.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_CarThird.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.InsurancePerformanceByTypeOther_CarThird.description}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_CarThird.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.InsurancePerformanceByTypeOther_CarThird.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_CarThird.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_CarThird.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_CarThird.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_CarThird.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_CarThird.table.data.map((rowData, rowIndex) => (
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

 {/* Finding_Car_third_party_insurance */}

 <div className="Finding_Car_third_party_insurance">

  <FindingComponent
  finding="Finding_Car_third_party_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Car_third_party_insurance?.finding_group}
/>
</div>

 {/* Finding_Car_third_party_insurance_financial_loss */}

 <div className="Finding_Car_third_party_insurance_financial_loss">

  <FindingComponent
  finding="Finding_Car_third_party_insurance_financial_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Car_third_party_insurance_financial_loss?.finding_group}
/>
</div>


 {/* Finding_Car_third_party_insurance_live_loss */}

 <div className="Finding_Car_third_party_insurance_live_loss">

  <FindingComponent
  finding="Finding_Car_third_party_insurance_live_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Car_third_party_insurance_live_loss?.finding_group}
/>
</div>


{/* PerformanceControlOfBranch_Body */}
<div className="PerformanceControlOfBranch_Body my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full p-2 rounded-lg border border-gray-300"
      value={editedData.PerformanceControlOfBranch_Body.title}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Body.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Body.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch_Body.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Body.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.PerformanceControlOfBranch_Body.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Body.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Body.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Body.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Body.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_Body.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_Body */}
<div className="InsurancePerformanceByTypeOther_Body my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full  rounded-lg border border-gray-300"
      value={editedData.InsurancePerformanceByTypeOther_Body.title}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Body.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Body.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.InsurancePerformanceByTypeOther_Body.description}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Body.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.InsurancePerformanceByTypeOther_Body.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Body.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Body.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Body.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Body.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_Body.table.data.map((rowData, rowIndex) => (
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

 {/* Finding_Car_body_insurance */}

 <div className="Finding_Car_body_insurance">

  <FindingComponent
  finding="Finding_Car_body_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Car_body_insurance?.finding_group}
/>
</div>

{/* Finding_Car_body_insurance_loss */}

<div className="Finding_Car_body_insurance_loss">

<FindingComponent
finding="Finding_Car_body_insurance_loss"
editedData={editedData}
isEditing={isEditing}
handleInputChange={handleInputChange}
findingGroup={reportData?.Finding_Car_body_insurance_loss?.finding_group}
/>
</div>

{/* PerformanceControlOfBranch_Fire */}
<div className="PerformanceControlOfBranch_Fire my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={editedData.PerformanceControlOfBranch_Fire.title}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Fire.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Fire.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch_Fire.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Fire.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.PerformanceControlOfBranch_Fire.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Fire.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Fire.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Fire.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Fire.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_Fire.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_Fire */}
<div className="InsurancePerformanceByTypeOther_Fire my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full  rounded-lg border border-gray-300"
      value={editedData.InsurancePerformanceByTypeOther_Fire.title}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Fire.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Fire.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.InsurancePerformanceByTypeOther_Fire.description}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Fire.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.InsurancePerformanceByTypeOther_Fire.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Fire.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Fire.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Fire.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Fire.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_Fire.table.data.map((rowData, rowIndex) => (
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

 {/* Finding_Fire_insurance */}

 <div className="Finding_Fire_insurance">

<FindingComponent
finding="Finding_Fire_insurance"
editedData={editedData}
isEditing={isEditing}
handleInputChange={handleInputChange}
findingGroup={reportData?.Finding_Fire_insurance?.finding_group}
/>
</div>

 {/* Finding_Fire_insurance_loss */}

 <div className="Finding_Fire_insurance_loss">

  <FindingComponent
  finding="Finding_Fire_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Fire_insurance_loss?.finding_group}
/>
</div>

{/* PerformanceControlOfBranch_Liability */}
<div className="PerformanceControlOfBranch_Liability my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={editedData.PerformanceControlOfBranch_Liability.title}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Liability.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Liability.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch_Liability.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Liability.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.PerformanceControlOfBranch_Liability.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Liability.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Liability.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Liability.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Liability.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_Liability.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_Liability */}
<div className="InsurancePerformanceByTypeOther_Liability my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={editedData.InsurancePerformanceByTypeOther_Liability.title}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Liability.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Liability.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.InsurancePerformanceByTypeOther_Liability.description}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Liability.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{editedData.InsurancePerformanceByTypeOther_Liability.description}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Liability.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Liability.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Liability.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Liability.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_Liability.table.data.map((rowData, rowIndex) => (
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

 {/* Finding_Liability_insurance */}

 <div className="Finding_Liability_insurance">

  <FindingComponent
  finding="Finding_Liability_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Liability_insurance?.finding_group}
/>
</div>


 {/* Finding_Liability_insurance_loss */}

 <div className="Finding_Liability_insurance_loss">

  <FindingComponent
  finding="Finding_Liability_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Liability_insurance_loss?.finding_group}
/>
</div>


 
{/* PerformanceControlOfBranch_Engineering */}
<div className="PerformanceControlOfBranch_Engineering my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.PerformanceControlOfBranch_Engineering.title)}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Engineering.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Engineering.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={editedData.PerformanceControlOfBranch_Engineering.description}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Engineering.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.PerformanceControlOfBranch_Engineering.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Engineering.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Engineering.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Engineering.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Engineering.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_Engineering.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_Engineering */}
<div className="InsurancePerformanceByTypeOther_Engineering my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={editedData.InsurancePerformanceByTypeOther_Engineering.title}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Engineering.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Engineering.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Engineering.description)}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Engineering.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Engineering.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Engineering.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Engineering.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Engineering.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={rowData[key]}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Engineering.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_Engineering.table.data.map((rowData, rowIndex) => (
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



 {/* Finding_Engineering_insurance */}

 <div className="Finding_Engineering_insurance">

  <FindingComponent
  finding="Finding_Engineering_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Engineering_insurance?.finding_group}
/>
</div>


 {/* Finding_Engineering_insurance_loss */}

 <div className="Finding_Engineering_insurance_loss">

  <FindingComponent
  finding="Finding_Engineering_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Engineering_insurance_loss?.finding_group}
/>
</div>



{/* PerformanceControlOfBranch_Cargo */}
<div className="PerformanceControlOfBranch_Cargo my-8">
  <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Cargo.title)}</h4>
  <p className='px-5 pb-5'>{englishToPersianNumber(editedData.PerformanceControlOfBranch_Cargo.description)}</p>
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Cargo.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Cargo.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {editedData.PerformanceControlOfBranch_Cargo.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          {Object.values(rowData).map((cellData, cellIndex) => (
            <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
              {englishToPersianNumber(cellData)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* InsurancePerformanceByTypeOther_Cargo */}
<div className="InsurancePerformanceByTypeOther_Cargo my-8">
  <p className='px-5 pb-5'>{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Cargo.description)}</p>
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Cargo.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Cargo.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {editedData.InsurancePerformanceByTypeOther_Cargo.table.data.map((rowData, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          {Object.values(rowData).map((cellData, cellIndex) => (
            <td key={cellIndex} className={`px-4 py-2 text-center`}>
              {englishToPersianNumber(cellData)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

 {/* Finding_Cargo_insurance */}

 <div className="Finding_Cargo_insurance">

  <FindingComponent
  finding="Finding_Cargo_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Cargo_insurance?.finding_group}
/>
</div>


 {/* Finding_Cargo_insurance_loss */}

 <div className="Finding_Cargo_insurance_loss">

  <FindingComponent
  finding="Finding_Cargo_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Cargo_insurance_loss?.finding_group}
/>
</div>


{/* Content for the PerformanceControlOfBranch_Ship */}
<div className="PerformanceControlOfBranch_Ship">
  <h4 className="text-2xl font-bold my-10">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={2}
        value={englishToPersianNumber(editedData.PerformanceControlOfBranch_Ship.title)}
        onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Ship.title')}
      />
    ) : (
      englishToPersianNumber(reportData.PerformanceControlOfBranch_Ship.title)
    )}
  </h4>
  <p className="mb-6">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={4}
        value={englishToPersianNumber(editedData.PerformanceControlOfBranch_Ship.description)}
        onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Ship.description')}
      />
    ) : (
      englishToPersianNumber(reportData.PerformanceControlOfBranch_Ship.description)
    )}
  </p>
  <table className="table-auto w-full" dir='rtl'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(reportData.PerformanceControlOfBranch_Ship.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(reportData.PerformanceControlOfBranch_Ship.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Ship.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {Object.keys(rowData).map((key, index) => (
              <td key={index} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Ship.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        reportData.PerformanceControlOfBranch_Ship.table.data.map((rowData, rowIndex) => (
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

{/* Content for the InsurancePerformanceByTypeOther_Ship */}
<div className="InsurancePerformanceByTypeOther_Ship">
  <h4 className="text-2xl font-bold my-10">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={2}
        value={englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Ship.title)}
        onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Ship.title')}
      />
    ) : (
      englishToPersianNumber(reportData.InsurancePerformanceByTypeOther_Ship.title)
    )}
  </h4>
  <p className="mb-6">
    {isEditing ? (
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300"
        rows={4}
        value={englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Ship.description)}
        onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Ship.description')}
      />
    ) : (
      englishToPersianNumber(reportData.InsurancePerformanceByTypeOther_Ship.description)
    )}
  </p>
  <table className="table-auto w-full" dir='rtl'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(reportData.InsurancePerformanceByTypeOther_Ship.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(reportData.InsurancePerformanceByTypeOther_Ship.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Ship.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className="bg-white">
            {Object.keys(rowData).map((key, index) => (
              <td key={index} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Ship.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        reportData.InsurancePerformanceByTypeOther_Ship.table.data.map((rowData, rowIndex) => (
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


 {/* Finding_Ship_insurance */}

 <div className="Finding_Ship_insurance">

  <FindingComponent
  finding="Finding_Ship_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Ship_insurance?.finding_group}
/>
</div>


 {/* Finding_Ship_insurance_loss */}

 <div className="Finding_Ship_insurance_loss">

  <FindingComponent
  finding="Finding_Ship_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Ship_insurance_loss?.finding_group}
/>
</div>


{/* PerformanceControlOfBranch_LifeGA */}
<div className="PerformanceControlOfBranch_LifeGA my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.PerformanceControlOfBranch_LifeGA.title)}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_LifeGA.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_LifeGA.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.PerformanceControlOfBranch_LifeGA.description)}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_LifeGA.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.PerformanceControlOfBranch_LifeGA.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_LifeGA.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_LifeGA.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_LifeGA.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_LifeGA.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_LifeGA.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_LifeGA */}
<div className="InsurancePerformanceByTypeOther_LifeGA my-8">
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_LifeGA.description)}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_LifeGA.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_LifeGA.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_LifeGA.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_LifeGA.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_LifeGA.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_LifeGA.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_LifeGA.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


 {/* Finding_Life_and_GA_insurance */}

 <div className="Finding_Life_and_GA_insurance">

  <FindingComponent
  finding="Finding_Life_and_GA_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Life_and_GA_insurance?.finding_group}
/>
</div>


 {/* Finding_Life_and_GA_insurance_loss */}

 <div className="Finding_Life_and_GA_insurance_loss">

  <FindingComponent
  finding="Finding_Life_and_GA_insurance_loss"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Life_and_GA_insurance_loss?.finding_group}
/>
</div>



{/* PerformanceControlOfBranch_Health */}
<div className="PerformanceControlOfBranch_Health my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.PerformanceControlOfBranch_Health.title)}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Health.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Health.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.PerformanceControlOfBranch_Health.description)}
      onChange={(e) => handleInputChange(e, 'PerformanceControlOfBranch_Health.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.PerformanceControlOfBranch_Health.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.PerformanceControlOfBranch_Health.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.PerformanceControlOfBranch_Health.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.PerformanceControlOfBranch_Health.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `PerformanceControlOfBranch_Health.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.PerformanceControlOfBranch_Health.table.data.map((rowData, rowIndex) => (
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

{/* InsurancePerformanceByTypeOther_Health */}
<div className="InsurancePerformanceByTypeOther_Health my-8">
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Health.description)}
      onChange={(e) => handleInputChange(e, 'InsurancePerformanceByTypeOther_Health.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Health.description)}</p>
  )}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData.InsurancePerformanceByTypeOther_Health.table.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.InsurancePerformanceByTypeOther_Health.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData.InsurancePerformanceByTypeOther_Health.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.keys(rowData).map((key, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(rowData[key])}
                  onChange={(e) => handleInputChange(e, `InsurancePerformanceByTypeOther_Health.table.data[${rowIndex}].${key}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData.InsurancePerformanceByTypeOther_Health.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

 {/* Finding_Health_insurance */}

 <div className="Finding_Health_insurance">

  <FindingComponent
  finding="Finding_Health_insurance"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Health_insurance?.finding_group}
/>
</div>


 {/* Finding_Health_insurance_personnel */}

 <div className="Finding_Health_insurance_personnel">

  <FindingComponent
  finding="Finding_Health_insurance_personnel"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Health_insurance_personnel?.finding_group}
/>
</div>

 {/* Finding_Health_insurance_eval_comp */}

 <div className="Finding_Health_insurance_eval_comp">

  <FindingComponent
  finding="Finding_Health_insurance_eval_comp"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Health_insurance_eval_comp?.finding_group}
/>
</div>


 {/* Finding_Health_insurance_contracts */}

 <div className="Finding_Health_insurance_contracts">

  <FindingComponent
  finding="Finding_Health_insurance_contracts"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Health_insurance_contracts?.finding_group}
/>
</div>


{/* LossHavale */}
<div className="LossHavale my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.LossHavale.title)}
      onChange={(e) => handleInputChange(e, 'LossHavale.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.LossHavale.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.LossHavale.description)}
      onChange={(e) => handleInputChange(e, 'LossHavale.description')}
    />
  ) : null}
</div>

{/* LossRemained */}
<div className="LossRemained my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData.LossRemained.title)}
      onChange={(e) => handleInputChange(e, 'LossRemained.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData.LossRemained.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData.LossRemained.description)}
      onChange={(e) => handleInputChange(e, 'LossRemained.description')}
    />
  ) : (
    <p className='px-5 pb-5'>{englishToPersianNumber(editedData.LossRemained.description)}</p>
  )}
</div>


 {/* Finding_Deferred_damage_control */}

 <div className="Finding_Deferred_damage_control">

  <FindingComponent
  finding="Finding_Deferred_damage_control"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Deferred_damage_control?.finding_group}
/>
</div>


 {/* Finding_Damage_remittances_without_settlement_and_payment */}

 <div className="Finding_Damage_remittances_without_settlement_and_payment">

  <FindingComponent
  finding="Finding_Damage_remittances_without_settlement_and_payment"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Damage_remittances_without_settlement_and_payment?.finding_group}
/>
</div>


 {/* Finding_Settlement_with_customers_without_payment_operations */}

 <div className="Finding_Settlement_with_customers_without_payment_operations">

  <FindingComponent
  finding="Finding_Settlement_with_customers_without_payment_operations"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
  findingGroup={reportData?.Finding_Settlement_with_customers_without_payment_operations?.finding_group}
/>
</div>




{/* LowRisks */}
<div className="LowRisks my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData?.LowRisks?.title)}
      onChange={(e) => handleInputChange(e, 'LowRisks.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData?.LowRisks?.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData?.LowRisks?.description)}
      onChange={(e) => handleInputChange(e, 'LowRisks.description')}
    />
  ) : null}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData?.LowRisks?.table?.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData?.LowRisks?.table?.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData?.LowRisks?.table?.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(cellData)}
                  onChange={(e) => handleInputChange(e, `LowRisks.table.data[${rowIndex}].${Object.keys(rowData)[cellIndex]}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData?.LowRisks?.table?.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
                {englishToPersianNumber(cellData)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* HighRisks */}
<div className="HighRisks my-8">
  {isEditing ? (
    <input
      type="text"
      className="text-2xl font-bold my-10 p-5 w-full rounded-lg border border-gray-300"
      value={englishToPersianNumber(editedData?.HighRisks?.title)}
      onChange={(e) => handleInputChange(e, 'HighRisks.title')}
    />
  ) : (
    <h4 className="text-2xl font-bold my-10 p-5">{englishToPersianNumber(editedData?.HighRisks?.title)}</h4>
  )}
  {isEditing ? (
    <textarea
      className="px-5 pb-5 w-full p-2 rounded-lg border border-gray-300"
      rows={4}
      value={englishToPersianNumber(editedData?.HighRisks?.description)}
      onChange={(e) => handleInputChange(e, 'HighRisks.description')}
    />
  ) : null}
  <table className="table-auto w-full" dir='ltr'>
    <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(editedData?.HighRisks?.table?.caption)}</caption>
    <thead>
      <tr className="bg-gray-200">
        {Object.values(editedData.HighRisks.table.column_names).map((columnName, index) => (
          <th key={index} className="px-4 py-2">{columnName}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {isEditing ? (
        editedData?.HighRisks?.table?.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={englishToPersianNumber(cellData)}
                  onChange={(e) => handleInputChange(e, `HighRisks.table.data[${rowIndex}].${Object.keys(rowData)[cellIndex]}`)}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        editedData?.HighRisks?.table?.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
            {Object.values(rowData).map((cellData, cellIndex) => (
              <td key={cellIndex} className={`px-4 py-2 text-center`}>
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