import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from './ReportContext'; // Adjust the import path as necessary
import NavList from './NavList';
import { FaTrash } from "react-icons/fa";


const Zamime = () => {
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { fileId } = useReport(); // Retrieve fileId from ReportContext

  useEffect(() => {
    if (fileId) {
      fetchOtherDocuments(fileId);
    } else {
      setError("Cannot retrieve report ID.");
    }
  }, [fileId]);

  const fetchOtherDocuments = async (fileId) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://188.121.99.245:8080/api/report/other_docs/', {
        params: {
          report_id: fileId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });


      console.log('Response data:', response.data);

      // Adjust the condition based on the actual response structure
      if (response.data && Array.isArray(response.data.data)) {
        setOtherDocuments(response.data.data);
      } else {
        setOtherDocuments([]);
        setError('قالب پاسخ غیرمنتظره');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      setError('اسناد دریافت نشد. لطفا دوباره تلاش کنید');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error fetching other documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !description) {
      setError("لطفاً یک فایل را انتخاب کنید و توضیحات ارائه دهید");
      setTimeout(() => {
        setError('');
    }, 3000);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('report_id', fileId);
      formData.append('file', selectedFile);
      formData.append('description', description);

      const response = await axios.post('http://188.121.99.245:8080/api/report/other_docs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      // Refresh the list of documents after successful upload
      fetchOtherDocuments(fileId);
      setSuccessMessage('فایل با موفقیت ارسال شد '); // Display a pop-up for successful upload
      setTimeout(() => {
        setSuccessMessage('');
    }, 3000); 
    } catch (error) {
      setError('آپلود فایل انجام نشد. لطفا دوباره تلاش کنید');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      const response = await axios.get(`http://188.121.99.245:8080/api/report/other_docs/${documentId}/download`, {
        responseType: 'blob', // Important: Set the response type to blob
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${documentId}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('خطا در دانلود فایل ');
      setTimeout(() => {
        setError('');
    }, 3000);
    }
  };

  const handleDelete = async (itemId) => {
    try {
            setIsLoading(true);

      await axios.delete(`http://188.121.99.245:8080/api/report/other_docs/?item_id=${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      // Refresh the list of documents after successful deletion
      fetchOtherDocuments(fileId);
      setSuccessMessage('حذف با موفقیت انجام شد'); // Display a pop-up for successful upload
      setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
    } catch (error) {
      console.error('', error);
      setError('خطا در حذف فایل');
      setTimeout(() => {
        setError('');
    }, 3000);
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavList />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
      <div className="flex flex-col w-full mt-8 px-5 max-md:mt-10 max-md:max-w-full m-[-100px]" dir="rtl">
        <h2 className="mb-4 font-semibold text-[color:var(--color-primary-variant)] text-2xl" dir="rtl">فایل های پیوست دیگر</h2>
        
        <div className="mb-3 w-full max-w-md">
          <label htmlFor="description" className="block text-black mb-2">توضیحات :</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full max-w-md">
          <label htmlFor="fileUpload">انتخاب فایل :</label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 m-4"
          />
          <button onClick={handleFileUpload} disabled={isLoading} className="mt-3 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isLoading ? 'درحال بارگزاری...' : 'بارگزاری'}
          </button>
        </div>
      </div>

      {/* Uploaded Files Table */}
      <div className="max-w-full overflow-x-auto mt-8 px-5 max-md:mt-10">
        <table className="min-w-full my-[90px]" dir='rtl'>
          <thead>
            <tr className="bg-gray-200 text-gray-800 font-semibold text-sm">
              <th className="py-3 px-4">عنوان فایل</th>
              <th className="py-3 px-4">تاریخ بارگزاری</th>
              <th className="py-3 px-4">بارگذاری شده توسط</th>
              <th className="py-3 px-4"></th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(otherDocuments) && otherDocuments.map((doc) => (
              <tr key={doc._id.$oid} className="border-b border-gray-200">
                <td className="py-3 px-4">{doc.document_name}</td>
                <td className="py-3 px-4 text-center">{doc.upload_date_jalali}</td>
                <td className="py-3 px-4 text-center">{doc.uploaded_by_name}</td>
               
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDownload(doc._id.$oid)} className="text-[color:var(--color-bg-variant)] hover:text-[color:var(--color-primary)] focus:outline-none">
                    <i className="fas fa-download mr-2"></i>دانلود
                  </button>
                  </td>
                  <td className=" text-center">
                  <button onClick={() => handleDelete(doc._id.$oid)} className="text-red-500 hover:text-red-700 focus:outline-none ml-4">
                    <i className=" "></i><FaTrash/>
                  </button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
             {/* Error Pop-up */}
             {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Zamime;
