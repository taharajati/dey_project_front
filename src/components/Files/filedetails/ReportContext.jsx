import React, { createContext, useContext, useState, useEffect } from 'react';

const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {
  const [fileId, setFileId] = useState(() => {
    // Initialize fileId from local storage if available
    return localStorage.getItem('fileId') || null;
  });

  // Update local storage whenever fileId changes
  useEffect(() => {
    localStorage.setItem('fileId', fileId);
  }, [fileId]);

  const updateFileId = (id) => {
    setFileId(id);
  };

  return (
    <ReportContext.Provider value={{ fileId, updateFileId }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
