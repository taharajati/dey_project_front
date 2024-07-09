import React, { useState, useEffect } from 'react';

const EditNoteModal = ({ isOpen, onClose, onSubmit, note }) => {
  const [noteContent, setNoteContent] = useState('');


   
  useEffect(() => {
    if (note) {
      setNoteContent(note.title);
    }
  }, [note]);

  const handleSubmit = () => {
    onSubmit({ ...note, content: noteContent });
  };

  console.log("noteContent",noteContent)
  console.log("note",note)


  if (!isOpen || !note) return null; // Ensure note is not null before rendering

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-1/3" dir='rtl'>
        <h2 className="text-xl mb-4 text-[color:var(--color-primary-variant)]">ویرایش یادداشت</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="5"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-[color:var(--color-primary-variant2)] hover:bg-[color:var(--color-primary-variant)] text-white py-2 px-4 rounded mx-2">لغو</button>
          <button onClick={handleSubmit} className="bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white py-2 px-4 rounded">ذخیره</button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
