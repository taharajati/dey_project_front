import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Comments from './components/Files/filedetails/Comments';
import FinalReport from './components/Files/filedetails/FinalReport';
import Findings from './components/Files/filedetails/Findings/Findings';
import { ReportProvider } from './components/Files/filedetails/ReportContext';  // Ensure the import path is correct
import FindingDetailPage from './components/Files/filedetails/Findings/FindingDetailPage';
import FirstReport from './components/Files/filedetails/FirstReport';
import BranchAnsr from './components/Files/filedetails/BranchAnsr'

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const response = await fetch('http://188.121.99.245/api/auth/get_user', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (response.ok) {
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
      <Router>
        <div>
        {isAuthenticated && <Nav />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={isAuthenticated ? <UserList /> : <Navigate to="/login" />} />
            <Route path="/branches" element={isAuthenticated ? <BranchList /> : <Navigate to="/login" />} />
            <Route path="/newfile" element={isAuthenticated ?  <NewFile />  : <Navigate to="/login" />} />
            <Route path="/completedfiles" element={isAuthenticated ? <CompletedFiles /> : <Navigate to="/login" />} />
            <Route path="/ongoingfiles" element={isAuthenticated ? <OngoingFiles /> : <Navigate to="/login" />} />
            <Route path="/report/:id"  element={isAuthenticated ? <FileDetailsPage /> : <Navigate to="/login" />} />
            <Route path="/takhsis"  element={isAuthenticated ? <Allocation /> : <Navigate to="/login" />} />
            <Route path="/checklist" element={isAuthenticated ? <Checklist /> : <Navigate to="/login" />} />
            <Route path="/comment"  element={isAuthenticated ? <Comments /> : <Navigate to="/login" />}/>
            <Route path="/final-report" element={<FinalReport />} />
            <Route path="/yaft" element={<Findings />} />
            <Route path="/findingdetailpage" element={<FindingDetailPage />} />
            <Route path="/first-report" element={<FirstReport />} />
            <Route path="//branchansr" element={<BranchAnsr/>} />


            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ReportProvider>
  );
}

export default App;
