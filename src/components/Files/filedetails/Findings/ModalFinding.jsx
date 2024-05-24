import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from '../ReportContext'; // Import the useReport hook

const ModalFinding = ({ open, onClose, entryType, reportId, findingGroup, fetchData }) => {
  const { fileId } = useReport(); // Retrieve fileId from ReportContext

  const [newEntryContent, setNewEntryContent] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const translations = {
    "Risks": "ریسک",
    "Titles": "عنوان",
    "Suggestions": "پیشنهاد",
  };

  useEffect(() => {
    if (newEntryContent) {
      fetchSuggestions(newEntryContent);
    }
  }, [newEntryContent]);

  const fetchSuggestions = async (query) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('accessToken');
      const singularEntryType = entryType.slice(0, -1).toLowerCase();

      const response = await axios.get(
        `http://188.121.99.245:8080/api/report/finding/field_options`,
        {
          params: {
            finding_group: findingGroup,
            field_type: singularEntryType.toLowerCase()
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuggestions(response.data.filter(item => item.includes(query)));
    

    } catch (error) {
      console.error('Error fetching suggestions:', error);
     

    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewEntryContent(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://188.121.99.245:8080/api/report/finding/${entryType.toLowerCase()}`,
        {
          report_id: fileId,
          content: newEntryContent,
          finding_group: findingGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Add entry response:', response.data);
      // Clear the input field after successful addition
      setNewEntryContent('');
      // Close the modal
      onClose();
      // Fetch data again to update the list after adding a new entry
      fetchData();
    } catch (error) {
      console.error('Error adding entry:', error);
      // Handle error
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
    <div>
      {open && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg max-h-[600px] overflow-auto w-[500px] h-[200px]">
            <div className="relative">
              <h3>اضافه کردن {translations[entryType.charAt(0).toUpperCase() + entryType.slice(1)]}</h3>
              <input
                type="text"
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                className="border border-gray-400 p-3 mt-2 w-full rounded-lg focus:outline-none focus:border-blue-500"
                placeholder={"محتوای جدید را وارد کنید"}
              />
              {suggestions.length > 0 && (
                <ul className="border border-gray-300 rounded-lg mt-2 max-h-48 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded mr-2 focus:outline-none m-1"
                >
                  اضافه کردن
                </button>
                <button
                  onClick={onClose}
                  className="bg-[color:var(--color-primary-variant)] text-white px-4 py-2 rounded hover:bg-gray-400 focus:outline-none m-1"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ModalFinding;
