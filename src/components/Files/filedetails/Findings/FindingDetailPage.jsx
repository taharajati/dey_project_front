import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalFinding from './ModalFinding';
import { EditorState, ContentState , convertToRaw , convertFromRaw  } from 'draft-js'; // Add ContentState import
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DynamicTableEditor from './DynamicTableEditor'; // Import the DynamicTableEditor component
import ReactDOMServer from 'react-dom/server'; // Add ReactDOMServer import
import { convertFromHTML } from 'draft-convert'; // Add convertFromHTML import

const FindingDetailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const findingGroup = queryParams.get('finding_group');
  const reportId = '662f7e8efce395369e27f801'; // Hardcoded for now, replace with actual report ID if needed
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
  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const titlesUrl = `http://188.121.99.245/api/report/finding/titles?report_id=${reportId}&finding_group=${findingGroup}`;
      const titlesResponse = await axios.get(titlesUrl, { headers: { Authorization: `Bearer ${token}` } });
      setTitlesData(titlesResponse.data.data || []);

      const risksUrl = `http://188.121.99.245/api/report/finding/risks?report_id=${reportId}&finding_group=${findingGroup}`;
      const risksResponse = await axios.get(risksUrl, { headers: { Authorization: `Bearer ${token}` } });
      setRisksData(risksResponse.data.data || []);

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

  const handleSaveChanges  = async () => {
    try {
      console.log("tableData",tableData)

      // Format the table data for sending to the backend
      const formattedTableData = tableData.map(row => ({ cells: row }));
      console.log("formattedTableData",formattedTableData)
      // Send a POST request to the backend API
      const response = await axios.post('YOUR_BACKEND_ENDPOINT', formattedTableData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      // Handle the response from the backend
      console.log('Table data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving table data:', error);
    }
    
   
  };

  const handleEditSaveChanges = async () => {
    try {
      // Get the content from the editorState
      const contentState = editorState.getCurrentContent();
      // Convert the contentState to raw JSON
      const rawContentState = convertToRaw(contentState);
      
      // Construct the data object with the required fields
      const data = {
        report_id: reportId,
        finding_group: findingGroup,
        text: JSON.stringify(rawContentState), // Convert to string
        table: (tableData), // Convert tableData to string
      };
      console.error('data:', data);

      // Send a POST request to the backend API with the data
      const response = await axios.post('http://188.121.99.245/api/report/finding/', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      // Handle the response from the backend
      console.log('Data sent successfully:', response.data);
    } catch (error) {
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

    const insertTable = () => {
      // Render the DynamicTableEditor component to a string
      const tableComponentString = ReactDOMServer.renderToString(<DynamicTableEditor />);
    
      // Convert the HTML string to Draft.js content state
      const blocksFromHTML = convertFromHTML(tableComponentString);
      const contentState = ContentState.createFromBlockArray(blocksFromHTML);
    
      // Update the editor's content state with the new table
      const newState = EditorState.push(
        editorState,
        contentState,
        'insert-table'
      );
      setEditorState(newState);
    };

    
 
    
  };
console.log()
  return (
    <div className="container mx-auto px-4 my-2 " dir="rtl">
      <button onClick={handleGoBack} className="bg-[color:var(--color-primary-variant-02)] py-1 px-3 rounded-lg">
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
      <button onClick={() => handleAddEntry('titles')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
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
      <button onClick={() => handleAddEntry('risks')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4 focus:outline-none m-5">
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
      <button onClick={() => handleAddEntry('suggestions')} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">
        اضافه کردن
      </button>

      {/* Add Entry Modals */}
      <ModalFinding open={isTitleModalOpen} onClose={() => setIsTitleModalOpen(false)} entryType="titles" reportId={reportId} findingGroup={findingGroup} fetchData={fetchData} />
      <ModalFinding open={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} entryType="risks" reportId={reportId} findingGroup={findingGroup} fetchData={fetchData} />
      <ModalFinding open={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} entryType="suggestions" reportId={reportId} findingGroup={findingGroup} fetchData={fetchData} />

      <button onClick={handleFileDownload} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">Download File</button>
      <button onClick={handleEditSaveChanges} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">Save editor</button>
      {/* Editor Section */}
      <div className="container mx-auto px-4 my-2 w-[1000px] h-[400px] rounded-md border " dir="rtl">
        <h2>Edit Document</h2>
        <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />
        
      </div>
      <div className="container mx-auto px-4 my-2 h-[200px]  " dir="rtl">
      <button onClick={handleSaveChanges} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mb-4  focus:outline-none m-5">Save table</button>
          <DynamicTableEditor tableData={tableData} setTableData={setTableData} />

      </div>
      <br/>
      <br/>
      <br/><br/><br/>
    </div>
  );
};

export default FindingDetailPage;
