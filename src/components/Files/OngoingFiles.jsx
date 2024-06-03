import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useReport } from './filedetails/ReportContext';
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

import { PermissionsContext } from '../../App'; // Import the context


const OngoingFiles = () => {
  const [ongoingFiles, setOngoingFiles] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control delete confirmation dialog
  const [fileToDelete, setFileToDelete] = useState(null); // State to store the file to delete
  const navigate = useNavigate();
  const { updateFileId } = useReport(); // Use updateFileId instead of setReportId
  const permissions = useContext(PermissionsContext); // Use the context


  useEffect(() => {
    fetchOngoingFiles();
  }, []);

  const fetchOngoingFiles = async () => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const response = await fetch('http://188.121.99.245:8080/api/report/?finished=false', {
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

  const redirectToReportDetail = (fileId) => {
    // Use updateFileId to set the fileId in the ReportContext
    updateFileId(fileId);
    navigate(`/report/${fileId}`);
  };

  const handleDelete = async () => {
    if (fileToDelete) {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://188.121.99.245:8080/api/report/?report_id=${fileToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (response.ok) {
          // Refresh ongoing files after deletion
          fetchOngoingFiles();
          // Hide the confirmation dialog after deletion
          setShowDeleteConfirmation(false);
        } else {
          console.error('Failed to delete file:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error deleting file:', error.message);
      }
    }
  };

  const handleDeleteConfirmation = (fileId) => {
    // Set the file to delete and show the confirmation dialog
    setFileToDelete(fileId);
    setShowDeleteConfirmation(true);
  };

  return (
    <div className="flex justify-center items-center w-full" >
      <div className="w-full max-w-6xl px-4 py-6 bg-white overflow-hidden">
        <h2 className=" text-2xl mb-[40px] font-semibold text-center text-[color:var(--color-primary-variant)] ">پرونده های در جریان</h2>
        <div className="overflow-x-auto shadow-md rounded-lg  " dir='rtl'>
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-200  text-center ">
              <tr >
                <th className="px-5 py-4 ">تاریخ ایجاد</th>
                <th className="px-5 py-4 ">شعبه</th>
                <th className="px-5 py-4 ">رئیس حسابرسی</th>
                <th className="px-5 py-4 ">مرحله</th>
                <th className="px-5 py-4 ">دوره رسیدگی</th>
                {permissions?.report_detail.edit && (

                <th className="px-5 py-4 ">مشاهده جزئیات</th>
              )}
                {permissions?.report_detail.delete && (

                <th className="px-5 py-4 "></th>
              )}
              </tr>
            </thead>
            <tbody>
              {ongoingFiles.map(file => (
                <tr key={file._id.$oid} className="border-t  text-center">
                  <td className="px-5 py-4  ">{file.creation_date_jalali}</td>
                  <td className="px-5 py-4 ">{file.branch_name}</td>
                  <td className="px-5 py-4 ">{file.audit_chief_full_name}</td>
                  <td className="px-5 py-4 ">{file.step}</td>
                  <td className="px-5 py-4 ">{file.period}</td>
                  {permissions?.report_detail.edit && (

                  <td className="px-5 py-4 ">
                    <button 
                      onClick={() => redirectToReportDetail(file._id.$oid)}
                      className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline "
                    >
                      مشاهده جزئیات
                    </button>
                  </td>
                   )}
                   {permissions?.report_detail.delete && (
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleDeleteConfirmation(file._id.$oid)} // Open confirmation dialog
                      className="text-[color:var(--color-primary-variant)] hover:text-[color:var(--color-primary)] focus:outline-none text-center"
                    >
                      <FaTrash />
                    </button>
                  </td>
                   )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirmation dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <p className="text-lg font-semibold text-center text-[color:var(--color-primary-variant)]">
              آیا مطمئن هستید که می‌خواهید این پرونده را حذف کنید؟
            </p>
            <div className="flex justify-center mt-6 space-x-4">
            <button 
                onClick={handleDelete} // Delete the file
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
              >
                حذف
              </button>
              <button 
                onClick={() => setShowDeleteConfirmation(false)} // Close confirmation dialog
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                لغو
              </button>
            
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OngoingFiles;
