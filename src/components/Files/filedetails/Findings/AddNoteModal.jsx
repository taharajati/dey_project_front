import React, { useState } from 'react';

const AddNoteModal = ({ open, onClose,onSubmit, handleNoteSubmit }) => {
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(noteContent);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex justify-center items-center z-50" dir='rtl'> 
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg max-w-md w-full">
            <div className="relative">
              <h3 className="text-xl font-semibold mb-4 text-[color:var(--color-primary-variant)]">اضافه کردن یادداشت جدید</h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="border border-gray-400 p-3 mt-2 w-full rounded-lg focus:outline-none "
                rows={4}
                placeholder="متن یادداشت را وارد کنید"
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className= " bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] mx-2 text-white px-4 py-2 rounded focus:outline-none"
                  disabled={isLoading || !noteContent.trim()}
                >
                  {isLoading ? 'در حال ذخیره...' : 'ذخیره یادداشت'}
                </button>
                <button
                  onClick={onClose}
                  className="bg-[color:var(--color-primary-variant2)] hover:bg-[color:var(--color-primary-variant)] text-white px-4 py-2 rounded ml-2 focus:outline-none"
                  disabled={isLoading}
                >
                  لغو
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNoteModal;
