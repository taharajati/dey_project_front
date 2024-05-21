import React, { useState, useEffect } from 'react';
import NavList from './NavList';
import { useReport } from './ReportContext'; // Import the useReport hook



const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { fileId } = useReport(); // Retrieve fileId using useReport hook


  // Function to fetch comments
  const fetchComments = async () => {
    try {
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
    }
  };

  // Function to handle comment submission
  const submitComment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://188.121.99.245:8080/api/report/comment/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: '662a05a2c9c0718052b312ba',
          content: newComment,
        }),
      });
      if (response.ok) {
        // Refresh comments after successful submission
        fetchComments();
        // Clear the new comment input field
        setNewComment('');
      } else {
        console.error('Failed to submit comment:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error.message);
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
      <div className=" ml-[700px] justify-center">
      <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>

        <h2 className="text-2xl font-bold mb-4 my-1 text-[color:var(--color-primary-variant)]">کامنت ها </h2>
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
            تایید کامنت
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default Comments;
