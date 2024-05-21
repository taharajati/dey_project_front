import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from '../ReportContext'; // Import the useReport hook


const ChecklistForm = ({ detailName }) => {
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const { fileId } = useReport(); // Retrieve fileId using useReport hook


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!detailName) return; // Check if detailName is undefined
        const response = await axios.get(`http://188.121.99.245:8080/api/report/checklist/?report_id=${fileId}`);
        const data = response.data.data;

        // Find the detail corresponding to the desired detailName
        for (const key in data) {
          const section = data[key];
          if (section.hasOwnProperty(detailName)) {
            setQuestions(section[detailName].data);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        // Handle error
      }
    };

    fetchQuestions(); // Call the fetchQuestions function directly
  }, [detailName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const url = `http://188.121.99.245:8080/api/report/checklist/${detailName}`;
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('با موفقیت ارسال شد:', response.data);
      // Handle success response
    } catch (error) {
      console.error('خطا در ارسال :', error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((question, index) => (
        <div key={index}>
          <label htmlFor={question.id} className="block">{question.text}</label>
          <select
            id={question.id}
            name={question.id}
            value={formData[question.id] || ''}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      ))}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
};

export default ChecklistForm;
