import React, { useState } from 'react';

import { FaComments } from "react-icons/fa";
import PopUpModal from './PopUpModal'; // Import the modal component


import RenderContent from './report_element'; // Import the component

const FindingComponent = ({ finding, editedData, isEditing, handleInputChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleCommentIconClick = () => {
    setIsModalOpen(true); // Open the modal when the comment icon is clicked
  };
  return (
    <>
    <div className='bg-slate-200'>


       <div className="  my-8 p-7  bg-slate-300">
      <span className="text-2xl font-bold p-2"  >یافته ها </span>
      <span className="float-left text-white mb-2 bg-[color:var(--color-primary)] rounded-full w-8 h-8 flex items-center justify-center" onClick={handleCommentIconClick}>
          <FaComments />
        </span>      </div>
      <div className='px-5 pb-2'>
        <h4 className="text-1xl font-bold my-8  py-1">عنوان یافته</h4>
        {/* Rendering Finding titles */}
        {isEditing ? (
          <textarea
            className="w-full p-[60px] rounded-lg border border-gray-300"
            rows={12}
            value={editedData[finding]?.title instanceof Array ? editedData[finding].title.map(item => item.text).join('\n') : editedData[finding]?.title}
            onChange={(e) => handleInputChange(e, `${finding}.title`)}
          />
        ) : (
          <RenderContent content={editedData[finding]?.title} />
        )}

        {/* Rendering Finding content */}
        {isEditing ? (
          <textarea
            className="w-full p-[60px] rounded-lg border border-gray-300"
            rows={12}
            value={editedData[finding]?.content instanceof Array ? editedData[finding].content.map(item => item.text).join('\n') : editedData[finding]?.content}
            onChange={(e) => handleInputChange(e, `${finding}.content`)}
          />
        ) : (
          <RenderContent content={editedData[finding]?.content} />
        )}
        <h4 className="text-1xl font-bold my-8  py-1">ریسک ها</h4>
        {isEditing ? (
          <textarea
            className="w-full p-[60px] rounded-lg border border-gray-300"
            rows={12}
            value={editedData[finding]?.risk instanceof Array ? editedData[finding].risk.map(item => item.text).join('\n') : editedData[finding]?.risk}
            onChange={(e) => handleInputChange(e, `${finding}.risk`)}
          />
        ) : (
          <RenderContent content={editedData[finding]?.risk} />
        )}
        <h4 className="text-1xl font-bold my-8 py-1">پیشنهاد ها</h4>
        {isEditing ? (
          <textarea
            className="w-full p-[60px] rounded-lg border border-gray-300"
            rows={12}
            value={editedData[finding]?.suggestions instanceof Array ? editedData[finding].suggestions.map(item => item.text).join('\n') : editedData[finding]?.suggestions}
            onChange={(e) => handleInputChange(e, `${finding}.suggestions`)}
          />
        ) : (
          <RenderContent content={editedData[finding]?.suggestions} />
        )}
      </div>
        {/* Render the modal */}
        {isModalOpen && (
        <PopUpModal
          finding={finding}
          onClose={() => setIsModalOpen(false)} // Close the modal when onClose is triggered
        />
      )}
    </div>
   
   </>
  );
};

export default FindingComponent;
