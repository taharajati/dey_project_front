import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from './filedetails/ReportContext'; // Adjust the import path as necessary
import NavList from './filedetails/NavList';

const FileDetailsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { reportId } = useReport();

  useEffect(() => {
    if (reportId) {
      fetchAllDocuments(reportId);
    } else {
      setError("Cannot retrieve report ID.");
    }
  }, [reportId]);

  const fetchAllDocuments = async (reportId) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://188.121.99.245/api/report/documents/', {
        params: {
          report_id: reportId,
          only_uploaded: false
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDocuments(response.data.data);
    } catch (error) {
      setError('Failed to fetch documents. Please try again.');
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUploadedDocuments = async (reportId) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://188.121.99.245/api/report/documents/', {
        params: {
          report_id: reportId,
          only_uploaded: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDocuments(response.data.data);
    } catch (error) {
      setError('Failed to fetch uploaded documents. Please try again.');
      console.error('Error fetching uploaded documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setError("Please select a file and a document type.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('report_id', reportId);
      formData.append('file', selectedFile);
      formData.append('document', selectedDocumentType);
      console.log("setSelectedDocumentType",setSelectedDocumentType)
      console.log("formData",formData)

      const response = await axios.post('http://188.121.99.245/api/report/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      alert('File successfully uploaded.');
      // Refresh the list of documents after successful upload
      fetchUploadedDocuments(reportId);
    } catch (error) {
      setError('File upload failed. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
   
  };
  const handleDownload = async (documentId) => {
    try {
      const response = await axios.get(`http://188.121.99.245/api/report/documents/${documentId}/download`, {
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
    }
  };
  return (
    <>
      <NavList activeReportId={reportId} />
      <div className="flex flex-col w-full mt-8 px-5 max-md:mt-10 max-md:max-w-full m-[-100px]" dir="rtl">
      <h2 className=" mb-4 font-semibold  text-[color:var(--color-primary-variant)] text-2xl " dir="rtl"> مدارک و فایل ها</h2>
      
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
        <div className="w-full max-w-md">
          <label htmlFor="fileUpload">انتخاب فایل :</label>
          <input type="file" id="fileUpload" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 m-4" />
          <button onClick={handleFileUpload} disabled={isLoading} className="mt-3 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isLoading ? 'Uploading...' : 'بارگزاری'}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>

      {/* Uploaded Files Table */}
      <div className="max-w-full overflow-x-auto mt-8 px-5 max-md:mt-10">
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
  <button onClick={() => handleDownload(doc._id.$oid)} className="text-[color:var(--color-bg-variant)] hover:text-[color:var(--color-primary)] focus:outline-none">
    <i className="fas fa-file-excel mr-2"></i>دانلود
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FileDetailsPage;
