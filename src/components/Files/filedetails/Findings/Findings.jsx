import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from '../NavList';
import Modal from '../Checklist/Modal';
import { Link } from 'react-router-dom';
import { useReport } from '../ReportContext'; // Import the useReport hook
import { MdModeEdit } from "react-icons/md";




const Findings = () => {
  const [findingsData, setFindingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fileId } = useReport(); // Retrieve fileId using useReport hook


  useEffect(() => {
    const fetchFindingsData = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('accessToken');
        const url = `http://188.121.99.245:8080/api/report/finding/?report_id=${fileId}`;
        console.log(`Fetching checklist data from: ${url}`);

        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        console.log('API response:', response);

        setFindingsData(response.data.data || []);
        setIsLoading(false);
      } catch (error) {
        setError('خطا در دریافت یافته ها');
        setTimeout(() => {
          setError('');
      }, 3000);
        setIsLoading(false);
        console.error(error);
      }
    };

    fetchFindingsData();
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <NavList />
      <Modal>
        {/* Your modal content */}
      </Modal>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
      <div className="  justify-center">
      <div className="  my-2 p-6 bg-white w-full " dir='rtl'>
      <h1 className="text-2xl font-semibold mb-10 text-[color:var(--color-primary-variant)]" dir='rtl'> یافته ها</h1>

        <div className="container  px-4 my-2">
          <table className="min-w-full  leading-3">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-right">نوع یافته</th>
                <th className="py-3 px-6 text-center">تعداد یافته‌ها</th>
                <th className="py-3 px-6 text-center">توضیحات دارد</th>
                <th className="py-3 px-6 text-center">تعداد ریسک‌ها</th>
                <th className="py-3 px-6 text-center">تعداد پیشنهادها</th>
                <th className="py-3 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {findingsData.map((finding, index) => (
                <tr key={index} className="bg-white border-b border-gray-200">
                  <td className="py-3 px-6 text-right">{finding.finding_group_fa}</td>
                  <td className={`py-3 px-6 text-center ${finding.number_of_findings === 0 ? 'bg-red-500' : ''}`}>{finding.number_of_findings}</td>
                  <td className={`py-3 px-6 text-center ${finding.has_description === 'خیر' ? 'bg-red-500' : ''}`}>{finding.has_description}</td>
                  <td className={`py-3 px-6 text-center ${finding.number_of_risks === 0 ? 'bg-red-500' : ''}`}>{finding.number_of_risks}</td>
                  <td className={`py-3 px-6 text-center ${finding.number_of_risks === 0 ? 'bg-red-500' : ''}`}>{finding.number_of_suggestions}</td>
                  <td className="py-3 px-6 text-center">
                    <Link
                      to={`/findingdetailpage?report_id=${fileId}&finding_group=${finding.finding_group}`}
                      className="text-[color:var(--color-primary)]  py-2 px-4 rounded-md"
                    >
                     <MdModeEdit/>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
           {/* Error Pop-up */}
           {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
  
    </>
  );
};

export default Findings;
