import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

import axios from 'axios';
import { useLocation , useNavigate } from 'react-router-dom';
import ModalFinding from './ModalFinding';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const FindingDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const findingGroup = queryParams.get('finding_group');
  const reportId = '6628290587158293b9883e82'; // Hardcoded for now, replace with actual report ID if needed
  const navigate = useNavigate(); // Use useNavigate hook

  const [titlesData, setTitlesData] = useState([]);
  const [risksData, setRisksData] = useState([]);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // Fetch titles
        const titlesUrl = `http://188.121.99.245/api/report/finding/titles?report_id=${reportId}&finding_group=${findingGroup}`;
        const titlesResponse = await axios.get(titlesUrl, { headers: { Authorization: `Bearer ${token}` } });
        setTitlesData(titlesResponse.data.data || []);

        // Fetch risks
        const risksUrl = `http://188.121.99.245/api/report/finding/risks?report_id=${reportId}&finding_group=${findingGroup}`;
        const risksResponse = await axios.get(risksUrl, { headers: { Authorization: `Bearer ${token}` } });
        setRisksData(risksResponse.data.data || []);

        // Fetch suggestions
        const suggestionsUrl = `http://188.121.99.245/api/report/finding/suggestions?report_id=${reportId}&finding_group=${findingGroup}`;
        const suggestionsResponse = await axios.get(suggestionsUrl, { headers: { Authorization: `Bearer ${token}` } });
        setSuggestionsData(suggestionsResponse.data.data || []);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg">در حال بارگیری...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleFileDownload = async () => {
    try {
      const token = localStorage.getItem('accessToken');
  
      const response = await axios.get(
        `http://188.121.99.245/api/report/finding/detail?report_id=${reportId}&finding_group=${findingGroup}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // Important: Set the response type to blob
        }
      );
  
      const fileName = 'downloaded_file.docx';
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  const handleSaveChanges = () => {
    // Implement logic to send the modified file back to the server
    // This will depend on your backend implementation
  };
  
  const handleGoBack = () => {
    navigate('/yaft'); // Navigate back to the OngoingFiles component
};


  return (
    <div className="container mx-auto px-4 my-2 " dir="rtl">
           <button
                            onClick={handleGoBack}
                            className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg"
                        >
                            Back
                        </button>
      {/* Display Titles */}
      <h2 className="text-xl font-semibold text-gray-800 my-5">عناوین یافته ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">عناوین یافته ها</th>
          </tr>
        </thead>
        <tbody>
          {titlesData.map((title, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{title.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setIsTitleModalOpen(true)} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>
      {/* Display Risks */}
      <h2 className="text-xl font-semibold text-gray-800 my-5">ریسک ها</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">ریسک ها</th>
          </tr>
        </thead>
        <tbody>
          {risksData.map((risk, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{risk.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setIsRiskModalOpen(true)} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
        اضافه کردن
      </button>
      {/* Display Suggestions */}
      <h2 className="text-xl font-semibold text-gray-800 my-5">پیشنهادات</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-right">پیشنهادات</th>
          </tr>
        </thead>
        <tbody>
          {suggestionsData.map((suggestion, index) => (
            <tr key={index} className="bg-white border-b border-gray-200">
              <td className="py-3 px-6 text-right">{suggestion.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setIsSuggestionModalOpen(true)} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">
        اضافه کردن
      </button>

     {/* Add Entry Modals */}
     <ModalFinding
        open={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        entryType="titles"
        reportId={reportId}
        findingGroup={findingGroup}
      />
      <ModalFinding
        open={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        entryType="risks"
        reportId={reportId}
        findingGroup={findingGroup}
      />
      <ModalFinding
        open={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        entryType="suggestions"
        reportId={reportId}
        findingGroup={findingGroup}
      />
       <button onClick={handleFileDownload} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">Download File</button>
      <button onClick={handleSaveChanges} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">Save Changes</button>
     <div className="container mx-auto px-4 my-2 h-[700px] rounded-md border " dir="rtl">
      <h2>Edit Document</h2>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
    
    </div>
    
    </div>
  );
};

export default FindingDetailPage;
