import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './style.css';
import Nav from './components/nav/Nav';
import Login from './components/Login/Login';
import UserList from './components/UserList/UserList';
import BranchList from './components/BranchList/BranchList';
import CompletedFiles from './components/Files/CompletedFiles';
import NewFile from './components/Files/NewFile';
import OngoingFiles from './components/Files/OngoingFiles';
import FileDetailsPage from './components/Files/FileDetailsPage';
import Allocation from './components/Files/filedetails/Allocation/Allocation';
import Checklist from './components/Files/filedetails/Checklist/Checklist';
import TarikhChe from './components/Files/filedetails/TarikhChe';
import FinalReport from './components/Files/filedetails/FinalReport';
import Findings from './components/Files/filedetails/Findings/Findings';
import { ReportProvider } from './components/Files/filedetails/ReportContext';
import FindingDetailPage from './components/Files/filedetails/Findings/FindingDetailPage';
import FirstReport from './components/Files/filedetails/FirstReport/FirstReport';
import BranchAnsr from './components/Files/filedetails/BranchAnsr';
import ChecklistHa from './components/Files/filedetails/ChecklistHa';
import ReportTable from './components/Files/filedetails/ReportTable';
import Word from './components/Files/filedetails/Word';
import Zamime from './components/Files/filedetails/Zamime';

export const PermissionsContext = createContext();
export const LogoutContext = createContext();


function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState(null);


  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const response = await fetch('http://188.121.99.245:8080/api/auth/get_user', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setPermissions(data.data.permission); // Set permissions
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Error checking token validity:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkTokenValidity();
  }, []);

 

  if (loading) {
    return null; // Render nothing until token validation is complete
  }

  return (
    <ReportProvider>
      <PermissionsContext.Provider value={permissions}>
      <LogoutContext.Provider value={{ setIsAuthenticated, setPermissions }}>

        <Router>
          <div>
          {isAuthenticated && window.location.pathname !== '/login' && <Nav />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/users" element={isAuthenticated ? <UserList /> : <Navigate to="/login" />} />
              <Route path="/branches" element={isAuthenticated ? <BranchList /> : <Navigate to="/login" />} />
              <Route path="/newfile" element={isAuthenticated ? <NewFile /> : <Navigate to="/login" />} />
              <Route path="/completedfiles" element={isAuthenticated ? <CompletedFiles /> : <Navigate to="/login" />} />
              <Route path="/ongoingfiles" element={isAuthenticated ? <OngoingFiles /> : <Navigate to="/login" />} />
              <Route path="/report/:id" element={isAuthenticated ? <FileDetailsPage /> : <Navigate to="/login" />} />
              <Route path="/zamime" element={isAuthenticated ? <Zamime /> : <Navigate to="/login" />} />
              <Route path="/takhsis" element={isAuthenticated ? <Allocation /> : <Navigate to="/login" />} />
              <Route path="/checklist" element={isAuthenticated ? <Checklist /> : <Navigate to="/login" />} />
              <Route path="/checklistha" element={isAuthenticated ? <ChecklistHa /> : <Navigate to="/login" />} />
              <Route path="/comment" element={isAuthenticated ? <TarikhChe /> : <Navigate to="/login" />} />
              <Route path="/final-report" element={isAuthenticated ? <FinalReport /> : <Navigate to="/login" />} />
              <Route path="/yaft" element={isAuthenticated ? <Findings /> : <Navigate to="/login" />} />
              <Route path="/findingdetailpage" element={isAuthenticated ? <FindingDetailPage /> : <Navigate to="/login" />} />
              <Route path="/first-report/:reportType" element={isAuthenticated ? <FirstReport /> : <Navigate to="/login" />} />
              <Route path="/word" element={isAuthenticated ? <Word /> : <Navigate to="/login" />} />
              <Route path="/reporttable" element={isAuthenticated ? <ReportTable /> : <Navigate to="/login" />} />
              <Route path="/branchansr" element={isAuthenticated ? <BranchAnsr /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
        </LogoutContext.Provider>
    
      </PermissionsContext.Provider>
    </ReportProvider>
  );
}

export default App;
