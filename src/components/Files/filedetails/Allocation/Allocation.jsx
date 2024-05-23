import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavList from '../NavList';
import { useReport } from '../ReportContext'; // Import the useReport hook

const Allocation = () => {
    const [experts, setExperts] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { fileId } = useReport(); // Retrieve fileId from ReportContext

    const translations = {
        "fire_expert": "آتش سوزی",
        "cargo_expert": "باربری",
        "car_expert": "خودرو",
        "liability_expert": "مسئولیت",
        "engineering_expert": "مهندسی",
        "health_expert": "درمان",
        "life_expert": "زندگی",
        "life_and_ga_expert": "عمر و حوادث گروهی"
    };

    useEffect(() => {
        if (fileId) {
            fetchExperts(fileId);
            fetchAssignments(fileId);
        }
    }, [fileId]); // Ensure useEffect runs whenever fileId changes

    const fetchExperts = async (fileId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://188.121.99.245:8080/api/report/assign/report_experts?report_id=${fileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExperts(response.data.data);
        } catch (err) {
            setError('Failed to fetch experts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async (fileId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://188.121.99.245:8080/api/report/assign/?report_id=${fileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignments(response.data.data|| {}); // Set assignments to fetched data or empty object if no data
        } catch (err) {
            setError('Failed to fetch assignments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignmentChange = (field, value) => {
        setAssignments(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const {
            fire_expert,
            cargo_expert,
            car_expert,
            liability_expert,
            engineering_expert,
            health_expert,
            life_expert,
            life_and_ga_expert
        } = assignments;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://188.121.99.245:8080/api/report/assign/', {
                report_id: fileId,
                fire: fire_expert,
                cargo: cargo_expert,
                car: car_expert,
                liability: liability_expert,
                engineering: engineering_expert,
                health: health_expert,
                life: life_expert,
                life_and_ga: life_and_ga_expert
            }, {
                headers: { Authorization: `Bearer ${token}` }
              });
        setSuccess('با موفقیت بروزرسانی شد');
        console.log(response.data);

        // Remove success message after 3 seconds
        setTimeout(() => {
            setSuccess('');
        }, 3000);
    } catch (err) {
        setError('بروزرسانی موفق نبود');
        console.error(err);
        setTimeout(() => {
            setError('');
        }, 3000);
    }
};

    return (
        <>
            <NavList />
            <div className=" ml-[700px] justify-center">
           
           <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>
           <h1 className="text-2xl   font-semibold  mb-10    text-[color:var(--color-primary-variant)]" dir='rtl'>تخصیص</h1>
                    {loading && <p className="bg-yellow-100 text-yellow-800 text-center p-2 rounded">Loading...</p>}
                    {error && <p className="bg-red-100 text-red-800 text-center p-2 rounded">{error}</p>}
                    {success && <p className="bg-green-100 text-green-800 text-center p-2 rounded">{success}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        {Object.keys(translations).map((key) => (
                            <div key={key} className="mb-4 flex flex-col">
                                <label className="block text-xl font-medium mb-1">{translations[key]}:</label>
                                <select
                                    className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-[color:var(--color-bg)]"
                                    value={assignments[key] || ''}
                                    onChange={(e) => handleAssignmentChange(key, e.target.value)}
                                >
                                    <option value="">
                                        {assignments[`${key}_name`] || 'انتخاب کارشناس'}
                                    </option>
                                    {experts.map(expert => (
                                        <option key={expert._id} value={expert._id}>{expert.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button className="mt-6 py-2 px-4 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold rounded-md" type="submit">
                            بروزرسانی تخصیص
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Allocation;
