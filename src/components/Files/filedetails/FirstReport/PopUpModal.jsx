import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from '../ReportContext'; // Import the useReport hook

const PopUpModal = ({ finding, onClose, findingGroup }) => {
  const [previousMessages, setPreviousMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { fileId } = useReport(); // Retrieve fileId using useReport hook

  useEffect(() => {
    fetchPreviousMessages();
  }, [findingGroup]);
  const fetchPreviousMessages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://188.121.99.245:8080/api/report/comment/report_comment`, {
        params: {
          report_id: fileId,
          finding_group: findingGroup
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPreviousMessages(response.data.data || []); // Ensure previousMessages is an array
    } catch (error) {
      console.error('Error fetching previous messages:', error);
      setError('خطا در دریافت کامنت ها');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      await axios.post(`http://188.121.99.245:8080/api/report/comment/report_comment`, {
        report_id: fileId,
        finding_group: findingGroup,
        content: newMessage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Clear the message input after sending the message
      setNewMessage('');
      // Fetch previous messages again to update the list
      fetchPreviousMessages();
      setSuccessMessage('کامنت با موفقیت ارسال شد');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('خطا در ارسال کامنت');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
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
        <div className="relative bg-white rounded-lg p-8 mx-auto w-3/4 max-w-3xl">
          {/* Render previous messages */}
          <ul className="mb-4 max-h-96 overflow-y-auto">
            {previousMessages.map((message) => (
              <li key={message._id.$oid} className="bg-gray-100 p-4 rounded-md mb-2">
                <div className="text-lg">{message.content}</div>
                <div className="flex justify-between text-gray-500 mt-2">
                  <span>فرستنده: {message.sender}</span>
                  <span>تاریخ: {message.upload_date_jalali} زمان: {message.time}</span>
                </div>
              </li>
            ))}
          </ul>
          {/* Input field for new message */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 h-24"
            placeholder="پیام جدید را وارد کنید..."
          />
          <div className="flex justify-end">
            {/* Button to send message */}
            <button
              onClick={handleSendMessage}
              className="text-white bg-[color:var(--color-primary)] px-4 py-2 rounded-lg m-2"
              disabled={isLoading}
            >
              {isLoading ? 'درحال ارسال...' : 'ارسال'}
            </button>
            {/* Button to close the modal */}
            <button
              onClick={onClose}
              className="text-white bg-[color:var(--color-primary-variant)] px-4 py-2 rounded-lg m-2"
            >
              لغو
            </button>
          </div>
        </div>
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
    </div>
  );
};

export default PopUpModal;
