import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from '../NavList';
import Modal from '../Checklist/Modal';
import { Link } from 'react-router-dom';
import { useReport } from '../ReportContext'; // Import the useReport hook


const Findings = () => {
  const [findingsData, setFindingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { reportId } = useReport(); // Retrieve reportId using useReport hook


  useEffect(() => {
    const fetchFindingsData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const url = `http://188.121.99.245/api/report/finding/?report_id=${reportId}`;
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setFindingsData(response.data.data || []);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch findings data');
        setLoading(false);
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
      <div className="container  px-4 my-8" dir="rtl">
      <h1 className="text-2xl   font-semibold  mb-10 mx-[60px]   text-[color:var(--color-primary-variant)]" dir='rtl'> یافته ها</h1>

        <div className="container mx-auto px-4 my-2">
          <table className="min-w-full leading-3">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-right">نوع یافته</th>
                <th className="py-3 px-6 text-center">تعداد یافته‌ها</th>
                <th className="py-3 px-6 text-center">توضیحات دارد</th>
                <th className="py-3 px-6 text-center">تعداد ریسک‌ها</th>
                <th className="py-3 px-6 text-center">تعداد پیشنهادها</th>
                <th className="py-3 px-6 text-center">عملیات</th>
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
                      to={`/findingdetailpage?report_id=6628290587158293b9883e82&finding_group=${finding.finding_group}`}
                      className="text-[11px] mb-2 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)]  text-white font-bold py-2 px-4 rounded"
                    >
                      ویرایش
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Findings;
