import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import NavList from './NavList';
import { useReport } from '../filedetails/ReportContext';

const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorq, setErrorq] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { fileId } = useReport();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
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
  };

  const handleEditClick = () => {
    setErrorq('شما نمیتوانید از این قابلیت استفاده کنید');
  };

  const handlePdfCreationClick = async (fileId, reportType) => {
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
  };

  const handleReportFinalizationClick = async (fileId, reportType) => {
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
  };

  const handlePdfDownloadClick = async (reportId, reportType) => {
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

      setSuccessMessage('گزارش PDF با موفقیت دانلود شد');
    } catch (error) {
      setErrorq('خطا در دانلود گزارش PDF');
      console.error('Error downloading PDF report:', error);
    }
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

  return (
    <>
      <NavList />
      <div className="justify-center">
        <div className="mx-[-100px] my-2 p-6 bg-white w-full" dir="rtl">
          <h1 className="text-2xl font-semibold mb-10 text-[color:var(--color-primary-variant)]" dir="rtl">گزارش</h1>
          <div className="container px-4 my-2">
            {loading ? (
              <p>بارگذاری...</p>
            ) : error ? (
              <p className="text-[color:var(--color-primary-variant)]">خطا: {error}</p>
            ) : reports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              <table className="min-w-full leading-normal">
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
                  {reports.map(report => (
                    <tr key={report._id.$oid} className="bg-white border-b text-center border-gray-200">
                      <td className="py-3 px-6">{report.report_type_fa}</td>
                      <td className="py-3 px-6">{report.status}</td>
                      {renderEditOption(report.created, report.finished, report.report_type)}
                      {renderPdfCreationOption(report.created, report.finished, fileId, report.report_type)}
                      {renderReportFinalizationOption(report.pdf_created, report.finished, report.report_type, fileId)}
                      {renderPdfDownloadOption(report.pdf_created, fileId, report.report_type)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
