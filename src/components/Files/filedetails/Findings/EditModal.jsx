import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, titles, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);
  const [findingTitleId, setFindingTitleId] = useState('');

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-5 h-auto w-[900px] max-h-[90vh] mx-auto shadow-lg overflow-y-auto" dir='rtl'>
        <h2 className="text-2xl font-semibold mb-4 text-[color:var(--color-primary-variant)]">ویرایش شرح یافته</h2>
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl text-gray-700 font-bold mb-2">انتخاب یافته</label>
            <select
              className="block w-full border rounded-md"
              value={findingTitleId}
              onChange={(e) => setFindingTitleId(e.target.value)}
              required
            >       
              <option value="">{formData.finding_title_text || ''} </option>
            {titles.map((title, index) => (
              <option key={index} value={title._id.$oid}>{title.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content_title">
              عنوان شرح
            </label>
            <input
              type="text"
              id="content_title"
              name="content_title"
              value={formData.content_title || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              شرح
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              className="w-full p-2 h-[150px] border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-[color:var(--color-primary-variant2)] hover:bg-[color:var(--color-primary-variant)] text-white py-2 px-4 rounded-md mx-2"
              onClick={onClose}
            >
              لغو
            </button>
            <button
              type="submit"
              className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white py-2 px-4 rounded-md"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
