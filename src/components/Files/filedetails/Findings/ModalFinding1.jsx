// ModalFinding1 component
import React, { useState } from 'react';

const ModalFinding1 = ({ isOpen, onClose, onSubmit, titles }) => {
  const [findingTitleId, setFindingTitleId] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(findingTitleId, contentTitle, content);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-[900px] h-[600px] p-[70px] ">
            <h2 className="text-xl font-semibold mb-4">اضافه کردن جزئیات محتوا</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">انتخاب یافته</label>
                <select
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-[color:var(--color-primary-variant)] focus:ring focus:ring-[color:var(--color-primary-variant)] focus:ring-opacity-50"
                  value={findingTitleId}
                  onChange={(e) => setFindingTitleId(e.target.value)}
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {titles.map((title, index) => (
                    <option key={index} value={title._id.$oid}>{title.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
                <input
                  type="text"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-[color:var(--color-primary-variant)] focus:ring focus:ring-[color:var(--color-primary-variant)] focus:ring-opacity-50"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">شرح</label>
                <textarea
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-[color:var(--color-primary-variant)] focus:ring focus:ring-[color:var(--color-primary-variant)] focus:ring-opacity-50"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                >
                  بستن
                </button>
                <button
                  type="submit"
                  className="bg-[color:var(--color-primary-variant)] text-white py-2 px-4 rounded-lg"
                >
                  ارسال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalFinding1;
