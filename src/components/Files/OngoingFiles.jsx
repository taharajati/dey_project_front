import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from './filedetails/ReportContext'; // Adjust the import path as necessary
import { IoClose } from "react-icons/io5";


const OngoingFiles = () => {
  const [ongoingFiles, setOngoingFiles] = useState([]);
  const navigate = useNavigate();
  const { setReportId } = useReport();

  useEffect(() => {
    fetchOngoingFiles();
  }, []);

  const fetchOngoingFiles = async () => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const response = await fetch('http://188.121.99.245/api/report/?finished=false', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOngoingFiles(data.data);
      } else {
        console.error('Failed to fetch ongoing files:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching ongoing files:', error.message);
    }
  };

  const redirectToReportDetail = (reportId) => {
    setReportId(reportId);
    navigate(`/report/${reportId}`);
  };
  const handleDelete = async (fileId) => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const response = await fetch(`http://188.121.99.245/api/report/?report_id=${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
        
      });
      console.log({fileId})
      if (response.ok) {
        // Refresh ongoing files after deletion
        fetchOngoingFiles();
      } else {
        console.error('Failed to delete file:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };
  return (
    <div className="flex justify-center items-center w-full" >
      <div className="w-full max-w-6xl px-4 py-6 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className=" text-2xl mb-4 font-semibold text-center text-[color:var(--color-primary-variant)]">پرونده های در جریان</h2>
        <div className="overflow-x-auto" dir='rtl'>
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-200  text-center">
              <tr>
                <th className="px-4 py-2">تاریخ ایجاد</th>
                <th className="px-4 py-2">شعبه</th>
                <th className="px-4 py-2">رئیس حسابرسی</th>
                <th className="px-4 py-2">مرحله</th>
                <th className="px-4 py-2">دوره رسیدگی</th>
                <th className="px-4 py-2">مشاهده جزئیات</th>
                <th className="px-4 py-2">حذف</th>
              </tr>
            </thead>
            <tbody>
              {ongoingFiles.map(file => (
                <tr key={file._id.$oid} className="border-t text-center">
                  <td className="px-4 py-2">{file.creation_date_jalali}</td>
                  <td className="px-4 py-2">{file.branch_name}</td>
                  <td className="px-4 py-2">{file.audit_chief_full_name}</td>
                  <td className="px-4 py-2">{file.step}</td>
                  <td className="px-4 py-2">{file.period}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => redirectToReportDetail(file._id.$oid)}
                      className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline "
                    >
                      مشاهده جزئیات
                    </button>
                   
                  </td>
                  <td className="px-4 py-2">
                  <button 
                        onClick={() => handleDelete(file._id.$oid)} // Assuming you have a delete function
                        className="text-[color:var(--color-primary-variant)] hover:text-[color:var(--color-primary)] focus:outline-none text-center"
                      >
                        <IoClose />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OngoingFiles;
