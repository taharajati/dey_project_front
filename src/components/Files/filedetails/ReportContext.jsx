import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {

const [reportId, setReportId] = useState(() => localStorage.getItem('report_id') || '');
    
        const updateReportId = (id) => {
            localStorage.setItem('report_id', id);
            setReportId(id);
        };
    
    
    return (
        <ReportContext.Provider value={{ reportId, setReportId }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => useContext(ReportContext);