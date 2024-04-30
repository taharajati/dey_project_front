import React from 'react';
import axios from 'axios';

const ModalFinding = ({ open, onClose, entryType, reportId, findingGroup, fetchData }) => {
  const [newEntryContent, setNewEntryContent] = React.useState('');

  const translations = {
    "Risks": "ریسک",
    "Titles" : "عنوان",
    "Suggestions": "پیشنهاد",
   
};


  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://188.121.99.245/api/report/finding/${entryType}`,
        {
          report_id: reportId,
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
    <div>
      {open && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg max-h-[600px] overflow-auto w-500px] h-[200px]">
            <div className="relative">
              <h3>اضافه کردن {translations[entryType.charAt(0).toUpperCase() + entryType.slice(1)]}</h3>
              <input
                type="text"
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                className="border border-gray-400 p-3 mt-2 w-full rounded-lg focus:outline-none focus:border-blue-500"
                placeholder={"محتوای جدید را وارد کنید"}
              />
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
  );
};

export default ModalFinding;
