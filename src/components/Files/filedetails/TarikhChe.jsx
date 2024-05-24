import React, { useState, useEffect } from 'react';
import NavList from './NavList';
import { useReport } from './ReportContext'; // Import the useReport hook



const TarikhChe = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { fileId } = useReport(); // Retrieve fileId using useReport hook


  // Function to fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://188.121.99.245:8080/api/report/comment/?report_id=${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      } else {
        console.error('Failed to fetch comments:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      setError('خطا در دریافت کامنت ها');
      setTimeout(() => {
        setError('');
    }, 3000);
    }finally {
      setIsLoading(false);
    }
  };

  // Function to handle comment submission
  const submitComment = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://188.121.99.245:8080/api/report/comment/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: fileId,
          content: newComment,
        }),
      });
      if (response.ok) {
        // Refresh comments after successful submission
        fetchComments();
        // Clear the new comment input field
        setNewComment('');
        setSuccessMessage('کامنت با موفقیت ارسال شد'); // Display a pop-up for successful upload
      setTimeout(() => {
        setSuccessMessage('');
    }, 3000); 
      } else {
        console.error('Failed to submit comment:', response.status, response.statusText);
        setError('خطا در ارسال کامنت');
        setTimeout(() => {
          setError('');
      }, 3000);
      }
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }finally {
      setIsLoading(false);
    }
  };

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);
 
console.log(newComment)

  return (
    <>
      <NavList />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
      <div className=" ml-[700px] justify-center">
      <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>

        <h2 className="text-2xl font-bold mb-4 my-1 text-[color:var(--color-primary-variant)]">تاریخچه</h2>
        <h3 className="text-2xl font-bold mb-4 my-1 text-[color:var(--color-primary-variant)]">کامنت ها </h3>
        {/* Display existing comments */}
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id?.$oid} className="bg-gray-100 p-4 rounded-md">
              <div className="text-lg">{comment.content}</div>
              <div className="flex justify-between text-gray-500">
                <span>فرستنده : {comment.sender}</span>
                <span>زمان ارسال : {comment.upload_date_jalali}</span>
              </div>
            </li>
          ))}
        </ul>
        {/* Input field for new comment */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را وارد کنید..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
          />
          <button onClick={submitComment} className="mt-2 px-4 py-2 bg-[color:var(--color-bg-variant)] text-white rounded-md hover:bg-[color:var(--color-primary)] focus:outline-none float-right" >
          {isLoading ? 'درحال ارسال کامنت...' : 'تایید کامنت'}
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
    </>
  );
};

export default TarikhChe;
