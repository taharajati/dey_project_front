
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import NavList from '../NavList';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart, CategoryScale, LinearScale, LineController, PointElement, LineElement, Title } from 'chart.js/auto';
import { PersianNumber } from "persian-number-converter";
import FindingComponent from './finding_box'; 
import TableComponent from './table';

import LalezarFont from '../../../../fonts/Lalezar-Regular.ttf'; // Adjust the path accordingly
import Top1 from "../../../../assets/top1.png"
import Top2 from "../../../../assets/top2.png"
import Down1 from "../../../../assets/down1.png"
import Down2 from "../../../../assets/down2.png"


Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, Title); // Register necessary components


const englishToPersianNumber = (number) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return String(number).replace(/[0-9]/g, (match) => persianDigits[parseInt(match)]);
};

const FirstReport = () => {
  const [reportData, setReportData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);
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
      const response = await fetch("http://188.121.99.245/api/report/fake_data", {
       // headers: {
        //  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
       // }
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        setEditableData(data);
        setEditedData(data); // Initialize editedData with fetched data
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


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setEditableData(editedData); // Update editableData with edited data
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('allContent');
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const marginTopFirstPage = 60; // Margin from the top of the first page
      const marginTopRemainingPages = 0; // Margin from the top of remaining pages
  
      const addImages = (page) => {
          if (page === 1) {
              pdf.addImage(Top1, 'PNG', 0, 0, imgWidth);
              pdf.addImage(Down1, 'PNG', 0, pageHeight - marginTopFirstPage, imgWidth, marginTopFirstPage);
          } else {
              pdf.addImage(Top2, 'PNG', 0, 0, imgWidth, marginTopRemainingPages);
              pdf.addImage(Down2, 'PNG', 0, pageHeight - marginTopRemainingPages, imgWidth, marginTopRemainingPages);
          }
      };
  
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      // Check if content fits within the first page
      if (heightLeft < pageHeight - marginTopFirstPage) {
        position = marginTopFirstPage;
        addImages(1);
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight , undefined, 'FAST');
      } else {
        // Add content to subsequent pages
        addImages(1);
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight , undefined, 'FAST');
        heightLeft -= pageHeight - marginTopFirstPage;
        let currentPage = 2;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          addImages(currentPage);
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight , undefined, 'FAST');
          heightLeft -= pageHeight;
          currentPage++;
        }
      }
  
      pdf.save('content.pdf');
    });
};
const handleInputChange = (e, key) => {
  const value = e.target.value;
  setEditedData(prevState => {
    const newState = { ...prevState };
    let currentState = newState;
    const keys = key.split('.');
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentState[key] = value;
      } else {
        currentState[key] = { ...currentState[key] };
        currentState = currentState[key];
      }
    });
    return newState;
  });
};




console.log('editedData', editedData);
console.log('reportData', reportData);


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
          <br/>
          <div className='flex mt-5 mb-5'>
              <button
                className="mt-8 bg-[color:var(--color-bg-variant)]  hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                onClick={handleDownloadPDF}
              >
                دانلود 
              </button>
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

          <div id="allContent" >
 {/* Content for the first page */}
          <div id="page1 " className="text-center" style={{ width: '210mm', height: '297', fontSize: '16px', lineHeight: '1.5' ,paddingTop: '400px'}}>
              
                <h1 className="text-5xl font-bold  mb-[100px]  text-center  " >
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 rounded-lg border border-gray-300"
                            rows={6}
                            value={editedData.first_page?.branch_name}
                            onChange={(e) => handleInputChange(e, 'first_page.branch_name')}
                        />
                    ) : (
                        editableData.first_page?.branch_name
                    )}
                </h1>
                <h2 className="text-xl my-[100px] text-center">
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 rounded-lg border border-gray-300"
                            rows={6}
                            value={editedData.first_page?.report_period}
                            onChange={(e) => handleInputChange(e, 'first_page.report_period')}
                        />
                    ) : (
                        editableData.first_page?.report_period
                    )}
                </h2>
                <h3 className="text-lg my-2 text-center">
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 rounded-lg border border-gray-300"
                            rows={6}
                            value={editedData.first_page?.date_title}
                            onChange={(e) => handleInputChange(e, 'first_page.date_title')}
                        />
                    ) : (
                        editableData.first_page?.date_title
                    )}
                </h3>
                <br />
            </div>

            {/* Content for the second page */}
            <div id="page2" className="new_page2 p-[30px] " style={{ width: '210mm', height: '297mm' , paddingTop: ''}}>
                <h4 className="text-2xl font-bold my-2">مقدمه:</h4>
                {isEditing ? (
                    <textarea
                        className="w-full p-[30px] rounded-lg border border-gray-300"
                        rows={12}
                        value={editedData.introduction?.content}
                        onChange={(e) => handleInputChange(e, 'introduction.content')}
                    />
                ) : (
                    <div>
                        <p>{editableData.introduction?.content}</p>
                    </div>
                )}
<h4 className="text-2xl font-bold my-10">اهداف ارزیابی:</h4>
{isEditing ? (
  <textarea
    className="w-full p-[60px] rounded-lg border border-gray-300"
    rows={12}
    value={editedData.evaluation_goals?.content}
    onChange={(e) => handleInputChange(e, 'evaluation_goals.content')}
  />
) : (
  <div>
    <p>{editableData.evaluation_goals?.content}</p>
  </div>
)}
<h4 className="text-2xl font-bold my-10">دامنه رسیدگی:</h4>
{isEditing ? (
  <textarea
    className="w-full p-[60px] rounded-lg border border-gray-300"
    rows={12}
    value={editedData.domain?.content}
    onChange={(e) => handleInputChange(e, 'domain.content')}
  />
) : (
  <div>
    <p>{editableData.domain?.content}</p>
  </div>
)}
<h4 className="text-2xl font-bold my-10">اهداف:</h4>

<br/>
</div>
    
 {/* Content for the third page */}
 {reportData && reportData.personnel && reportData.personnel.table && (
            <div id="page3" className="text-center" style={{ width: '210mm', height: '297mm', fontSize: '16px', lineHeight: '1.5' }}>
            <h4 className="text-2xl font-bold my-10">{reportData.personnel.title}</h4>
    {isEditing ? (
      <textarea
        className="w-full p-[60px] rounded-lg border border-gray-300"
        rows={12}
        value={editedData.introduction?.content}
        onChange={(e) => handleInputChange(e, 'introduction.content')}
      />
      
    ) : (
      <div>
        <p>{editableData.introduction?.content}</p>
      </div>
    )}
    <br/>
    {reportData.personnel.table && (
      <table className="table-auto w-full mt-8">
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
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel.table.data[rowIndex].first_name
          }
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].first_name`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.last_name}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].last_name`)
          }
        />
        
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.degree}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].degree`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.major}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].major`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.hiring_date_jalali}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].hiring_date_jalali`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.position}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].position`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.experience_relative}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].experience_relative`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.experience_semi_relative}
          onChange={(e) =>
            handleInputChange(e, `personnel.table.data[${rowIndex}].experience_semi_relative`)
          }
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-gray-300"
          value={editedData.personnel?.table?.data[rowIndex]?.experience_not_relative}
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
      <td className="px-4 py-2 text-center">{rowData.first_name}</td>
      <td className="px-4 py-2 text-center">{rowData.last_name}</td>
      <td className="px-4 py-2 text-center">{rowData.degree}</td>
      <td className="px-4 py-2 text-center">{rowData.major}</td>
      <td className="px-4 py-2 text-center">{rowData.hiring_date_jalali}</td>
      <td className="px-4 py-2 text-center">{rowData.position}</td>
      <td className="px-4 py-2 text-center">{rowData.experience_relative}</td>
      <td className="px-4 py-2 text-center">{rowData.experience_semi_relative}</td>
      <td className="px-4 py-2 text-center">{rowData.experience_not_relative}</td>
    </tr>
  ))
)}
                </tbody>
              </table>
              
            )}
             <h4 className="text-2xl font-bold my-10">{reportData.performance_control.title}</h4>
    <p className="mb-6">{reportData.performance_control.description}</p>
    <table className="table-auto w-full">
      <caption className="text-lg font-semibold mb-6">{reportData.performance_control.table.caption}</caption>
      <thead>
        <tr className="bg-gray-200 ">
          {Object.values(reportData.performance_control.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody> 
      {isEditing ? (
          reportData.performance_control.table.data.map((rowData, rowIndex) => (
            <tr key={rowIndex} className="bg-white  ">
              <td className="px-4 py-2  ">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300 "
                  value={editedData.performance_control.table.data[rowIndex].insurance_revenue}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].insurance_revenue`)}
                />
              </td>
              <td className="px-4 py-2 ">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].loss}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].losse`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].commission_cost}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].commission_cost`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].administrative_costs}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].administrative_costs`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].other_operational_costs}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].other_operational_costs`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].non_operational_costs}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].non_operational_costs`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].personnel_costs}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].personnel_costs`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].depreciation_costs}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].depreciation_costs`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].cost_ratio}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].cost_ratio`)}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  value={editedData.performance_control.table.data[rowIndex].profit_lost}
                  onChange={(e) => handleInputChange(e, `performance_control.table.data[${rowIndex}].profit_lost`)}
                />
              </td>
              
            </tr>
          ))
        ) : (
        reportData.performance_control.table.data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100 item" : "bg-white"}>
            <td className={`px-4 py-2 text-center ${rowData.insurance_revenue < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.insurance_revenue)}</td>
            <td className={`px-4 py-2 text-center ${rowData.loss < 0 ? 'text-red-500' : ''}`}>{rowData.loss}</td>
            <td className={`px-4 py-2 text-center ${rowData.commission_cost < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.commission_cost)}</td>
            <td className={`px-4 py-2 text-center ${rowData.administrative_costs < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.administrative_costs)}</td>
            <td className={`px-4 py-2 text-center ${rowData.other_operational_costs< 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.other_operational_costs)}</td>
            <td className={`px-4 py-2 text-center ${rowData.non_operational_costs < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.non_operational_costs)}</td>
            <td className={`px-4 py-2 text-center ${rowData.personnel_costs < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.personnel_costs)}</td>
            <td className={`px-4 py-2 text-center ${rowData.depreciation_costs < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.depreciation_costs)}</td>
            <td className={`px-4 py-2 text-center ${rowData.cost_ratio < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.cost_ratio)}</td>
            <td className={`px-4 py-2 text-center ${rowData.profit_lost < 0 ? 'text-red-500' : ''}`}>{PersianNumber(rowData.profit_lost)}</td>
            </tr>
          ))
        )}
        
      </tbody>
    </table>

   
    <h4 className="text-2xl font-bold my-10 ">{reportData.FinancialPerformanceIssueLossCompareBudget.title}</h4>
    <p className="mb-6">{reportData.FinancialPerformanceIssueLossCompareBudget.description}</p>
    <table className="table-auto w-full">
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
                    value={rowData[key]}
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
                <td key={index} className={`px-4 py-2 text-center ${value < 0 ? 'text-red-500' : ''}`}>{PersianNumber(value)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>

          </div>
        )}
 {/* Content for the fourth page */}
 <div id="page4" className="text-center" style={{ width: '210mm', height: '297mm', fontSize: '16px', lineHeight: '1.5', padding: '30px', marginTop: '50px' }}>
    <caption className="text-lg font-semibold my-6 w-[800px]">{reportData.Chart_1.caption}</caption>
    <div className="text-lg" style={{ width: '800px', height: '600px', margin: '0 auto' }}>
        <canvas ref={chartCanvasRef}></canvas>
    </div>
    <caption className="text-lg font-semibold my-6 w-[800px]">{reportData.Chart_2.caption}</caption>
    <div className="text-lg" style={{ width: '600px', height: '450px', margin: '0 auto' }}>
        <canvas ref={pieChart1CanvasRef}></canvas>
    </div>
    <caption className="text-lg font-semibold my-6 w-[800px]">{reportData.Chart_3.caption}</caption>
    <div className="text-lg" style={{ width: '600px', height: '450px', margin: '0 auto' }}>
        <canvas ref={pieChart2CanvasRef}></canvas>
    </div>
</div>


{/* Content for the fifth page */}
<div id="page5" className="page-content" style={{ width: '210mm', height: '297mm', fontSize: '16px', lineHeight: '1.5' , padding: '30px', marginTop: '50px'}}>
    <FindingComponent finding="Finding_1" editedData={editedData} isEditing={isEditing} handleInputChange={handleInputChange} />
    <div className="my-8 px-5">
        <h4 className="text-2xl font-bold my-10">{reportData.SalesPerformance.title}</h4>
        <p className="pb-5">{reportData.SalesPerformance.description}</p>
        <table className="table-auto w-full">
            <caption className="text-lg font-semibold mb-6">{englishToPersianNumber(reportData.SalesPerformance.table.caption)}</caption>
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
                                    <input type="text" className="w-full p-2 rounded-lg border border-gray-300" value={rowData[key]} onChange={(e) => handleInputChange(e, `SalesPerformance.table.data[${rowIndex}].${key}`)} />
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    reportData.SalesPerformance.table.data.map((rowData, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            {Object.keys(rowData).map((key, cellIndex) => (
                                <td key={cellIndex} className={`px-4 py-2 text-center ${rowData[key] < 0 ? 'text-red-500' : ''}`}>
                                    {typeof rowData[key] === 'number' ? PersianNumber(rowData[key]) : rowData[key]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
</div>
</div>

{/* Content for the sixth page */}
<div id="page6" className="page-content" style={{ width: '420mm', height: '594mm', fontSize: '16px', lineHeight: '1.5' , padding: '30px', marginTop: '50px'}}>
    <FindingComponent finding="Finding_2" editedData={editedData} isEditing={isEditing} handleInputChange={handleInputChange} />
    <div className="my-8 px-5">
        <table className="table-auto w-full">
            <caption className="text-lg font-semibold mb-6">{editedData.AgentsSales.table.caption}</caption>
            <thead>
                <tr className="bg-gray-200">
                    {Object.values(editedData.AgentsSales.table.column_names).map((columnName, index) => (
                        <th key={index} className="px-4 py-2">{columnName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {editedData.AgentsSales.table.data.map((rowData, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        {Object.values(rowData).map((cellData, cellIndex) => (
                            <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
                                {typeof cellData === 'number' ? PersianNumber(cellData) : cellData}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    <div className="my-8 px-5">
        <table className="table-auto w-full">
            <caption className="text-lg font-semibold mb-6">{editedData.AgentsLoss.table.caption}</caption>
            <thead>
                <tr className="bg-gray-200">
                    {Object.values(editedData.AgentsLoss.table.column_names).map((columnName, index) => (
                        <th key={index} className="px-4 py-2">{columnName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {editedData.AgentsLoss.table.data.map((rowData, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        {Object.values(rowData).map((cellData, cellIndex) => (
                            <td key={cellIndex} className={`px-4 py-2 text-center ${cellData < 0 ? 'text-red-500' : ''}`}>
                                {typeof cellData === 'number' ? PersianNumber(cellData) : cellData}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

{/* Content for the seventh page */}
<div id="page7" className="text-center" style={{ width: '210mm', height: '594mm', fontSize: '16px', lineHeight: '1.5' , padding: '30px', marginTop: '50px'}}>
    <h4 className="text-2xl font-bold my-8 p-2">{editedData.OperationalPlan.title}</h4>
    <div className="px-5 pb-2">
        <p>{editedData.OperationalPlan.content}</p>
    </div>
    <FindingComponent finding="Finding_3" editedData={editedData} isEditing={isEditing} handleInputChange={handleInputChange} />
    <div>
        <h4 className="text-2xl font-bold my-6 p-2">{editedData.Claims.title}</h4>
        <p className="px-5 pb-2">{editedData.Claims.content}</p>
    </div>
    <table className="table-auto w-full my-8">
        <caption className="text-lg font-semibold mb-6">{editedData.ClaimRemain.table.caption}</caption>
        <thead>
            <tr className="bg-gray-200">
                {Object.values(editedData.ClaimRemain.table.column_names).map((columnName, index) => (
                    <th key={index} className="px-4 py-2">{columnName}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {editedData.ClaimRemain.table.data.map((rowData, rowIndex) => (
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
    <table className="table-auto w-full my-8">
        <caption className="text-lg font-semibold mb-6">{editedData.ClaimsDecomByAge.table.caption}</caption>
        <thead>
            <tr className="bg-gray-200">
                {Object.values(editedData.ClaimsDecomByAge.table.column_names).map((columnName, index) => (
                    <th key={index} className="px-4 py-2">{columnName}</th>
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

{/* Content for the eighth page */}
<div id="page8" className="text-center" style={{ width: '210mm', height: '594mm', fontSize: '16px', lineHeight: '1.5', padding: '30px', marginTop: '50px' }}>
    <table className="table-auto w-full my-8">
        <caption className="text-lg font-semibold mb-6">{editedData.ClaimsDecomByInsuranceType.table.caption}</caption>
        <thead>
            <tr className="bg-gray-200">
                {Object.values(editedData.ClaimsDecomByInsuranceType.table.column_names).map((columnName, index) => (
                    <th key={index} className="px-4 py-2">{columnName}</th>
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
    <FindingComponent finding="Finding_4" editedData={editedData} isEditing={isEditing} handleInputChange={handleInputChange} />
</div>


<div id="page9" className="">
<h4 className="text-2xl font-bold my-8 p-2">{editedData.SalesNetwork.title}</h4>
<div className='px-5 pb-2'>
    <p></p>
  </div>

  <h5 className="text-2xl font-bold my-8 p-2">{editedData.AgentsRevenue.title}</h5>
<div className='px-5 pb-2'>
    <p></p>
  </div>


  {/* AgentsRevenueMonthlyTable */}
  <div>
    <table className="table-auto w-full my-8">
      <caption className="text-lg font-semibold mb-6">{editedData.AgentsRevenueMonthlyTable.table.caption}</caption>
      <thead>
        <tr className="bg-gray-200">
          {Object.values(editedData.AgentsRevenueMonthlyTable.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editedData.AgentsRevenueMonthlyTable.table.data.map((rowData, rowIndex) => (
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


</div>

<div id="page10" className="">

  <FindingComponent
  finding="Finding_6"
  editedData={editedData}
  isEditing={isEditing}
  handleInputChange={handleInputChange}
/>

<div id="page11" className="">
<h4 className="text-2xl font-bold my-8 p-2">{editedData.PerformanceControlOfBranch.title}</h4>
<div className='px-2 pb-1'>
   
  </div>

  <h5 className="text-2xl font-bold my-8 p-2">{editedData.PerformanceControlOfBranch_CarThird.title}</h5>
<div className='px-5 pb-2'>
    <p></p>
  </div>


  {/* PerformanceControlOfBranch_CarThirdTable */}
  <div>
    <table className="table-auto w-full my-8">
      <caption className="text-lg font-semibold mb-6">{editedData.PerformanceControlOfBranch_CarThirdTable.table.caption}</caption>
      <thead>
        <tr className="bg-gray-200">
          {Object.values(editedData.PerformanceControlOfBranch_CarThirdTable.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editedData.PerformanceControlOfBranch_CarThirdTable.table.data.map((rowData, rowIndex) => (
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

  <div>
    <table className="table-auto w-full my-8">
      <caption className="text-lg font-semibold mb-6">{editedData.PerformanceControlOfBranch_CarThirdTableOther.table.caption}</caption>
      <thead>
        <tr className="bg-gray-200">
          {Object.values(editedData.PerformanceControlOfBranch_CarThirdTableOther.table.column_names).map((columnName, index) => (
            <th key={index} className="px-4 py-2">{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editedData.PerformanceControlOfBranch_CarThirdTableOther.table.data.map((rowData, rowIndex) => (
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
</div>

</div>

             <div className='flex mt-5 mb-5'>
              <button
                className="mt-8 bg-[color:var(--color-bg-variant)]  hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 mx-2 rounded"
                onClick={handleDownloadPDF}
              >
                دانلود 
              </button>
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