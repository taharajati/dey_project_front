import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from './ReportContext'; // Adjust the import path as necessary
import NavList from './NavList';

const Zamime = () => {
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fileId } = useReport(); // Retrieve fileId from ReportContext

  useEffect(() => {
    if (fileId) {
      fetchOtherDocuments(fileId);
    } else {
      setError("Cannot retrieve report ID.");
    }
  }, [fileId]);

  const fetchOtherDocuments = async (reportId) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://188.121.99.245:8080/api/report/other_docs/', {
        params: {
          report_id: reportId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      // Ensure the response is an array
      if (Array.isArray(response.data)) {
        setOtherDocuments(response.data);
      } else {
        setOtherDocuments([]);
        setError('Unexpected response format');
      }
    } catch (error) {
      setError('Failed to fetch other documents. Please try again.');
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
      setError("Please select a file and provide a description.");
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
      alert('File successfully uploaded.');
      // Refresh the list of documents after successful upload
      fetchOtherDocuments(fileId);
    } catch (error) {
      setError('File upload failed. Please try again.');
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
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://188.121.99.245:8080/api/report/other_docs/?item_id=${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      alert('File successfully deleted.');
      // Refresh the list of documents after successful deletion
      fetchOtherDocuments(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <>
      <NavList />
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
            {isLoading ? 'Uploading...' : 'بارگزاری'}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
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
              <th className="py-3 px-4">عملیات</th>
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
                  <button onClick={() => handleDelete(doc._id.$oid)} className="text-red-500 hover:text-red-700 focus:outline-none ml-4">
                    <i className="fas fa-trash-alt mr-2"></i>حذف
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

export default Zamime;
