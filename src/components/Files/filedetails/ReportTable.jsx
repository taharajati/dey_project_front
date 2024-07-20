import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import NavList from './NavList';
import { useReport } from '../filedetails/ReportContext';
import { PermissionsContext } from '../../../App'; // Import the context


const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorq, setErrorq] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const permissions = useContext(PermissionsContext); // Use the context
  const { fileId } = useReport();

  console.log("permissions",permissions)



  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://188.121.99.245:8080/api/report/reports_files?report_id=${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setReports(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('گزارش ها دریافت نشد');
      setLoading(false);
      console.error('Error fetching reports:', error);
    }
    setLoading(false)

  };

  const handleEditClick = () => {
    setErrorq('شما نمیتوانید از این قابلیت استفاده کنید');
  };

  const handlePdfCreationClick = async (fileId, reportType) => {
    setLoading(true)

    try {
      console.log('Creating PDF for fileId:', fileId, 'reportType:', reportType);

      const token = localStorage.getItem('accessToken');
      await axios.post(`http://188.121.99.245:8080/api/report/export/convert_to_pdf`, {
        report_id: fileId,
        report_type: reportType
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setSuccessMessage('گزارش PDF با موفقیت ایجاد شد');
    } catch (error) {
      setErrorq('گزارش PDF ایجاد نشد');
      console.error('Error creating PDF report:', error);
    }
    setLoading(false)

  };

  const handleReportFinalizationClick = async (fileId, reportType) => {
    setLoading(true)

    try {
      console.log('Finalizing report for fileId:', fileId, 'reportType:', reportType);

      const token = localStorage.getItem('accessToken');
      await axios.post(`http://188.121.99.245:8080/api/report/export/send_report`, {
        report_id: fileId,
        report_type: reportType
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setSuccessMessage('گزارش با موفقیت ارسال شد');
    } catch (error) {
      setErrorq('گزارش ارسال نشد');
      console.error('Error sending report:', error);
    }
    setLoading(false)

  };

  const handlePdfDownloadClick = async (reportId, reportType) => {
    setLoading(true)

    try {
      console.log('Downloading PDF for reportId:', reportId, 'reportType:', reportType);

      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://188.121.99.245:8080/api/report/export/download?report_id=${reportId}&report_type=${reportType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf' // Set Accept header to 'application/pdf' for downloading PDF
        },
        responseType: 'blob' // Set responseType to 'blob' to handle binary response
      });

      // Create a temporary anchor element to initiate download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();

      setSuccessMessage(' گزارش با موفقیت دانلود شد');
    } catch (error) {
      setErrorq('PDFخطا در دانلود گزارش ');
      console.error('Error downloading PDF report:', error);
    }
    setLoading(false)

  };

  const renderEditOption = (created, finished, reportType) => {
    if (created && !finished) {
      return (
        <NavLink to={`/first-report/${reportType}`}>
          <td className="py-3 px-6 text-[color:var(--color-primary)]">ویرایش و نهایی سازی</td>
        </NavLink>
      );
    } else {
      return (
        <td className="py-3 px-6 text-gray-400" onClick={handleEditClick}>ویرایش و نهایی سازی</td>
      );
    }
  };

  const renderPdfCreationOption = (created, finished, fileId, reportType) => {
    if (created && !finished) {
      return (
        <td className="py-3 px-6 text-[color:var(--color-primary)] cursor-pointer" onClick={() => handlePdfCreationClick(fileId, reportType)}>ایجاد گزارش PDF</td>
      );
    } else {
      return (
        <td className="py-3 px-6 text-gray-400">ایجاد گزارش PDF</td>
      );
    }
  };

  const renderPdfDownloadOption = (pdfCreated, reportId, reportType) => {
    if (pdfCreated) {
      return (
        <td className="py-3 px-6 text-[color:var(--color-primary)] cursor-pointer" onClick={() => handlePdfDownloadClick(reportId, reportType)}>دانلود گزارش PDF</td>
      );
    } else {
      return (
        <td className="py-3 px-6 text-gray-400">گزارش PDF در دسترس نیست</td>
      );
    }
  };
  
  const renderReportFinalizationOption = (pdfCreated, finished, reportType, fileId) => {
    if (pdfCreated && !finished) {
      return (
        <td className="py-3 px-6 text-[color:var(--color-primary)] cursor-pointer" onClick={() => handleReportFinalizationClick(fileId, reportType)}>نهایی سازی گزارش</td>
      );
    } else {
      return (
        <td className="py-3 px-6 text-gray-400" onClick={handleEditClick}>نهایی سازی گزارش</td>
      );
    }
  };

  const renderRow = (report) => {
    const reportType = report.report_type;
    if (permissions.report_content_detail[reportType]) {
      return (
        <tr key={report._id.$oid} className="bg-white border-b text-center border-gray-200">
          <td className="py-3 px-6">{report.report_type_fa}</td>
          <td className="py-3 px-6">{report.status}</td>
          {renderEditOption(report.created, report.finished, reportType)}
          {renderPdfCreationOption(report.created, report.finished, fileId, reportType)}
          {renderReportFinalizationOption(report.pdf_created, report.finished, reportType, fileId)}
          {renderPdfDownloadOption(report.pdf_created, fileId, reportType)}
        </tr>
      );
    }
    return null; // If no permission, return null (do not render row)
  };

  return (
    <>
      <NavList />
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
      <div className="justify-center">
        <div className=" my-2 p-6 bg-white w-full" dir="rtl">
          <h1 className="text-2xl font-semibold mb-10 text-[color:var(--color-primary-variant)]" dir="rtl">گزارش</h1>
          <div className="container px-4 my-2">
          
    
              <table className="min-w-full leading-normal ">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6">نوع گزارش</th>
                    <th className="py-3 px-6">وضعیت گزارش</th>
                    <th className="py-3 px-6"></th>
                    <th className="py-3 px-6"></th>
                    <th className="py-3 px-6"></th>
                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody>
                {reports.map(report => renderRow(report))}
                </tbody>
              </table>
          
          </div>
        </div>
      </div>
      {/* Popup for error message */}
      {errorq && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <p className="text-red-600">{errorq}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setErrorq('')}>
              OK
            </button>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <p className="text-green-600">{successMessage}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSuccessMessage('')}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportTable;
