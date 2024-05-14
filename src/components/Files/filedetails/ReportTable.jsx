import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from './NavList';
import { NavLink, useNavigate } from 'react-router-dom';
import { useReport } from '../filedetails/ReportContext'; // Import the useReport hook



const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { reportId } = useReport(); // Retrieve reportId using useReport hook


  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('accessToken');
    
      const response = await axios.get(`http://188.121.99.245/api/report/reports_files?report_id=${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setReports(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch reports');
      setLoading(false);
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <>
      <NavList />
      <div className="container mx-auto px-4 my-2" dir='rtl'>

<h1 className="text-2xl   font-semibold  mb-10    text-[color:var(--color-primary-variant)]" dir='rtl'>گزارش </h1>
     

      <div className="container mx-auto px-4 my-2" >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <table className="min-w-full leading-normal" >
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 ">نوع گزارش</th>
                <th className="py-3 px-6">وضعیت گزارش</th>
                <th className="py-3 px-6"> </th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id.$oid} className="bg-white border-b border-gray-200">
                  <td className="py-3 px-6">{report.report_type_fa}</td>
                  <td className="py-3 px-6 ">{report.status}</td>
                  <NavLink 
                        to="/first-report" 
                       
                    >
                         <td className="py-3 px-6  text-[color:var(--color-primary)]">ویرایش و نهایی سازی</td>
                    </NavLink>
                 
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </>
  );
};

export default ReportTable;
