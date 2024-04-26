import React from 'react';
import axios from 'axios';

const ModalFinding = ({ open, onClose, entryType, reportId, findingGroup }) => {
  const [newEntryContent, setNewEntryContent] = React.useState('');

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
         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg max-h-[600px] overflow-auto w-500px] h-[200px]" >
           <div className="relative">
      
           <h3>Add New {entryType.charAt(0).toUpperCase() + entryType.slice(1)}</h3>
              <input
                type="text"
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                className="border border-gray-400 p-3 mt-2 w-full rounded-lg focus:outline-none focus:border-blue-500"
                placeholder={`Enter new ${entryType} content`}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 focus:outline-none"
                >
                  Add
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
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