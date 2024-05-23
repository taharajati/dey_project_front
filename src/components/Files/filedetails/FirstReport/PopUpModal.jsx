import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from '../ReportContext'; // Import the useReport hook


const PopUpModal = ({ finding, onClose }) => {
  const [previousMessages, setPreviousMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [findingGroup, setFindingGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { fileId } = useReport(); // Retrieve fileId using useReport hook


  useEffect(() => {
    fetchPreviousMessages(); 
  // Call the function to fetch previous messages when the component mounts
  }, [findingGroup]);

  const fetchFindingsData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `http://188.121.99.245:8080/api/report/finding/?report_id=${fileId}`;
      console.log(`Fetching findings data from: ${url}`);

      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Findings data:', response.data);

      // Set the finding group
      setFindingGroup(response.data.finding_group);
    } catch (error) {
      console.error('Error fetching findings data:', error);
    }
  };

console.log("findingGroup",findingGroup)
  const fetchPreviousMessages = async () => {
    try {
        const token = localStorage.getItem('accessToken');

      const response = await axios.get(`http://188.121.99.245:8080/api/report/comment/report_comment?report_id=${fileId}&finding_group=`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'}
      
    });
      setPreviousMessages(response.data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post('http://188.121.99.245:8080/api/report/comment/report_comment', {
        report_id: finding.report_id,
        finding_group: finding.finding_group,
        content: newMessage
      });
      // Clear the message input after sending the message
      setNewMessage('');
      // Fetch previous messages again to update the list
      fetchPreviousMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      {/* Modal backdrop */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal content */}
        <div className="relative bg-white rounded-lg p-8 mx-auto max-w-md">
          {/* Render previous messages */}
          <ul className="mb-4">
            {previousMessages.map((message, index) => (
              <li key={index}>{message.content}</li>
            ))}
          </ul>
          {/* Input field for new message */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          />
          {/* Button to send message */}
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Send
          </button>
          {/* Button to close the modal */}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
