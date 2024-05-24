import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalFinding from './ModalFinding';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DynamicTableEditor from './DynamicTableEditor';
import ReactDOMServer from 'react-dom/server';
import { convertFromHTML } from 'draft-convert';
import { useReport } from '../ReportContext';
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

const FindingDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const findingGroup = queryParams.get('finding_group');
  const { fileId } = useReport(); // Retrieve fileId using useReport hook

  const navigate = useNavigate(); // Use useNavigate hook

  const [titlesData, setTitlesData] = useState([]);
  const [risksData, setRisksData] = useState([]);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [sections, setSections] = useState([{ editorState: EditorState.createEmpty(), tableData: [] }]);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('accessToken');

      const titlesUrl = `http://188.121.99.245:8080/api/report/finding/titles?report_id=${fileId}&finding_group=${findingGroup}`;
      const titlesResponse = await axios.get(titlesUrl, { headers: { Authorization: `Bearer ${token}` } });
      setTitlesData(titlesResponse.data.data || []);

      const risksUrl = `http://188.121.99.245:8080/api/report/finding/risks?report_id=${fileId}&finding_group=${findingGroup}`;
      const risksResponse = await axios.get(risksUrl, { headers: { Authorization: `Bearer ${token}` } });
      setRisksData(risksResponse.data.data || []);

      const suggestionsUrl = `http://188.121.99.245:8080/api/report/finding/suggestions?report_id=${fileId}&finding_group=${findingGroup}`;
      const suggestionsResponse = await axios.get(suggestionsUrl, { headers: { Authorization: `Bearer ${token}` } });
      setSuggestionsData(suggestionsResponse.data.data || []);

     

    } catch (error) {
      setError(' خطا در دریافت اطلاعات');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error(error);
    }finally {
      setIsLoading(false);
  }
  };

  const handleTextChange = (index, value) => {
    const newSections = [...sections];
    newSections[index].text = value;
    setSections(newSections);
  };
  

  const handleTableDataChange = (index, newData) => {
    const newSections = [...sections];
    newSections[index].tableData = newData;
    setSections(newSections);
  };

 

  const handleSaveChanges = async () => {
    try {
      // Format the data for sending to the backend
      const dataToSend = sections.map((section) => ({
        text: section.text,
        table: section.tableData,
      }));
  
      console.log('Data to send:', dataToSend);
  
      // Send a POST request to the backend API with the formatted data
      const response = await axios.post('YOUR_BACKEND_ENDPOINT', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      // Handle the response from the backend
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const handleDeleteEntry = async (entryType, id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const dataToSend = {
        item_id: id,
        report_id: fileId,
        finding_group: findingGroup
      };
      await axios.delete(`http://188.121.99.245:8080/api/report/finding/${entryType.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: dataToSend
      });
      setSuccessMessage('با موفقیت حذف شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchData();
    } catch (error) {
      setError('خطا در حذف اطلاعات');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error deleting entry:', error);
    }
  };
  

  const handleGoBack = () => {
    navigate('/yaft'); // Navigate back to the OngoingFiles component
  };

  const handleAddEntry = async (entryType) => {
    // Open the corresponding modal based on the entry type
    switch (entryType) {
      case 'titles':
        setIsTitleModalOpen(true);
        break;
      case 'risks':
        setIsRiskModalOpen(true);
        break;
      case 'suggestions':
        setIsSuggestionModalOpen(true);
        break;
      default:
        break;
    }
  };

  const addSection = () => {
    setSections([...sections, { editorState: EditorState.createEmpty(), tableData: [] }]);
  };

  
  console.log();

  return (
    <>
    {isLoading && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    )}
    <div className="container mx-auto px-4 my-2 " dir="rtl">
      <button onClick={handleGoBack} className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg">
        بازگشت
      </button>

      {/* Display Titles */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)]">عناوین یافته ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">عناوین یافته ها</th>
            <th className="py-3 px-6 text-right"> </th>
            <th className="py-3 px-6 text-right"> </th>
          </tr>
        </thead>
        <tbody>
          {titlesData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{title.title}</td>
              <td className="px-4 py-2">
                <button className="text-[color:var(--color-primary)] py-2 px-4 rounded-md" ><MdModeEdit /></button>
              </td>
              <td className="px-4 py-2">
              <button onClick={() => handleDeleteEntry('titles',title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('titles')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Display Risks */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)]">ریسک ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right ">ریسک ها</th>
            <th className="py-3 px-6 text-right "> </th>
            <th className="py-3 px-6 text-right "> </th>
          </tr>
        </thead>
        <tbody>
          {risksData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{title.title}</td>
              <td className="px-4 py-2">
                <button className="text-[color:var(--color-primary)] py-2 px-4 rounded-md" ><MdModeEdit /></button>
              </td>
              <td className="px-4 py-2">
              <button onClick={() => handleDeleteEntry('risks',title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('risks')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Display Suggestions */}
      <h2 className="text-2xl font-semibold my-5 text-[color:var(--color-primary-variant)] ">پیشنهادات</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">پیشنهادات</th>
            <th className="py-3 px-6 text-right"></th>
            <th className="py-3 px-6 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {suggestionsData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{title.title}</td>
              <td className="px-4 py-2">
                <button className="text-[color:var(--color-primary)] py-2 px-4 rounded-md" ><MdModeEdit /></button>
              </td>
              <td className="px-4 py-2">
              <button onClick={() => handleDeleteEntry('suggestions',title._id.$oid)} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleAddEntry('suggestions')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Add Entry Modals */}
      <ModalFinding open={isTitleModalOpen} onClose={() => setIsTitleModalOpen(false)} entryType="titles" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />
      <ModalFinding open={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} entryType="risks" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />
      <ModalFinding open={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} entryType="suggestions" fileId={fileId} findingGroup={findingGroup} fetchData={fetchData} />

      <button onClick={handleSaveChanges} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5"> ارسال</button>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <div key={index} className="container mx-auto px-4 my-2" dir="rtl">
          <h2>قسمت  {index + 1}</h2>
          <textarea
                placeholder="توضیحات"
                className="border border-gray-300 rounded-md h-[400px] px-4 py-2 w-full"
                value={sections[index].text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                
              ></textarea>
              
          <div className="l px-4 my-2 items-center justify-center" dir="rtl">
            <DynamicTableEditor tableData={section.tableData} setTableData={(data) => handleTableDataChange(index, data)} />
          </div>
        </div>
      ))}

      <button onClick={addSection} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">اضافه کردن قسمت جدید </button>
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

export default FindingDetailPage;
