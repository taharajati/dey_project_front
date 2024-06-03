import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useReport } from './filedetails/ReportContext'; // Adjust the import path as necessary
import NavList from './filedetails/NavList';
import { PermissionsContext } from '../../App'; // Import the context



const FileDetailsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const permissions = useContext(PermissionsContext); // Use the context


  const { fileId } = useReport(); // Retrieve fileId from ReportContext



  useEffect(() => {
    if (fileId) {
      fetchAllDocuments(fileId);
    } else {
      setError("نمی توان شناسه گزارش را بازیابی کرد");
      
    }
  }, [fileId]);

  const fetchAllDocuments = async (fileId) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://188.121.99.245:8080/api/report/documents/', {
        params: {
          report_id: fileId,
          only_uploaded: false
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDocuments(response.data.data);
    } catch (error) {
      setError('اسناد دریافت نشد. لطفا دوباره تلاش کنید');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setError("لطفاً یک فایل و یک نوع سند را انتخاب کنید");
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
      formData.append('document', selectedDocumentType);

      const response = await axios.post('http://188.121.99.245:8080/api/report/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setSuccessMessage('فایل با موفقیت ارسال شد '); // Display a pop-up for successful upload
      setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
      // Refresh the list of documents after successful upload
      fetchAllDocuments(fileId);
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

  const handleDownload = async (documentId, fileId) => {
    try {
      const response = await axios.get(`http://188.121.99.245:8080/api/report/documents/download?report_id=${fileId}&document=${documentId}`, {
        responseType: 'blob', // Important: Set the response type to blob
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${documentId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('خطا در دانلود فایل')
      setTimeout(() => {
        setError('');
    }, 3000);
    }
  };

  

  return (
    <>
      <NavList activeReportId={fileId} />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
      <div className="flex flex-col w-full mt-8 px-5 max-md:mt-10 max-md:max-w-full m-[-100px]" dir="rtl">
        <h2 className=" mb-4 font-semibold  text-[color:var(--color-primary-variant)] text-2xl " dir="rtl"> مدارک و فایل ها</h2>

        {permissions?.document_detail.add && (

        <div className="mb-3 w-full max-w-md">
          <label htmlFor="documentType" className="block text-black mb-2">انتخاب نوع مدرک :</label>
          <select id="documentType" onChange={(e) => setSelectedDocumentType(e.target.value)} className="block w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value=""></option>
            {documents.map((doc) => (
              <option key={doc._id.$oid} value={doc.document}>
                {doc.document_fa}
              </option>
            ))}
          </select>
          
        </div>
         )}

         {permissions?.document_detail.add && (

        <div className="w-full max-w-md">
          <label htmlFor="fileUpload">انتخاب فایل :</label>
          <input type="file" id="fileUpload" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 m-4" />
          <button onClick={handleFileUpload} disabled={isLoading} className="mt-3 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isLoading ? 'درحال بارگزاری...' : 'بارگزاری'}
          </button>
        </div>
        
      )}


      </div>

   

      {/* Uploaded Files Table */}
      <div className="max-w-full overflow-x-auto mt-8 px-5 max-md:mt-10">
      {permissions?.document_detail.list && (

        <table className="min-w-full  my-[90px]" dir='rtl'>
          <thead>
            <tr className="bg-gray-200 text-gray-800 font-semibold text-sm">
              <th className="py-3 px-4">عنوان فایل</th>
              <th className="py-3 px-4">تاریخ بارگزاری</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id.$oid} className="border-b border-gray-200 ">
                <td className="py-3 px-4">{doc.document_fa}</td>
                <td className="py-3 px-4 text-center">{doc.upload_date_jalali}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDownload(doc.document, fileId)} className="text-[color:var(--color-bg-variant)] hover:text-[color:var(--color-primary)] focus:outline-none">
                    <i className="fas fa-file-excel mr-2"></i>دانلود
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          )}
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

export default FileDetailsPage;
