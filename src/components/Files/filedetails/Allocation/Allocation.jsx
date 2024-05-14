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
    const { reportId } = useReport(); // Retrieve reportId using useReport hook
    const translations = {
        "fire_name": "آتش سوزی",
        "cargo_name": "باربری",
        "car_name": "خودرو",
        "liability_name": "مسئولیت",
        "engineering_name": "مهندسی",
        "health_name": "درمان",
        "life_name": "زندگی",
        "life_and_ga_name":"عمر و حوادث گروهی",
    };

    useEffect(() => {
        if (reportId) {
            fetchExperts(reportId);
            fetchAssignments(reportId);
        }
    }, [reportId]); // Ensure useEffect runs whenever reportId changes

    const fetchExperts = async (reportId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://188.121.99.245/api/report/assign/report_experts?report_id=${reportId}`, {
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

    const fetchAssignments = async (reportId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://188.121.99.245/api/report/assign/?report_id=${reportId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignments(response.data.data[0] || {}); // Set assignments to fetched data or empty object if no data
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
    
        // Extract only the desired fields from the assignments state
        const {
            fire_expert_name,
            cargo_expert_name,
            car_expert_name,
            liability_expert_name,
            engineering_expert_name,
            health_expert_name,
            life_expert_name,
            life_and_ga_expert_name
        } = assignments;
    
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://188.121.99.245/api/report/assign/', {
                report_id: reportId,
                fire: fire_expert_name,
                cargo: cargo_expert_name,
                car: car_expert_name,
                liability: liability_expert_name,
                engineering: engineering_expert_name,
                health: health_expert_name,
                life: life_expert_name,
                life_and_ga: life_and_ga_expert_name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('با موفقیت بروزرسانی شد');
            console.log(response.data);
        } catch (err) {
            setError('بروزرسانی موفق نبود');
            console.error(err);
        }
    };
    
    console.log("Assignments State:", assignments);

    return (
       <>
            <NavList />
            
            <div className=" ml-[700px] justify-center">
           
            <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>
            <h1 className="text-2xl   font-semibold  mb-10    text-[color:var(--color-primary-variant)]" dir='rtl'>تخصیص</h1>
                {loading && <p className="bg-yellow-100 text-yellow-800 text-center p-2 rounded">Loading...</p>}
                {error && <p className="bg-red-100 text-red-800 text-center p-2 rounded">{error}</p>}
                {success && <p className="bg-green-100 text-green-800 text-center p-2 rounded">{success}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col justify-end">
                {Object.keys(assignments)
    .filter(key => !key.endsWith('_expert') && translations[key.replace('_expert', '')])
    .map((key) => (
        <div key={key} className="mb-4 flex">
            <label className="block text-xl font-medium mb-1">{translations[key.replace('_expert', '')]}:</label>
            <select
                className="form-select block  flex-auto w-64 mx-5  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-[color:var(--color-bg)]"
                value={assignments[key] || ''}
                onChange={(e) => handleAssignmentChange(key, e.target.value)}
            >
                <option value="">
                    {assignments[`${key}_expert`] ? assignments[`${key}_expert_name`] : 'انتخاب کارشناس'}
                </option>
                {experts.map(expert => (
                    <option key={expert._id} value={expert._id}>{expert.full_name}</option>
                ))}
            </select>
        </div>
    ))}



                       <button className="w-[160px] mt-6     text-center py-2 px-4 bg-[color:var(--color-bg-variant)]  hover:bg-[color:var(--color-primary)] text-white font-bold rounded-md" type="submit">
                            بروزرسانی تخصیص
                        </button>
                </form>
                
            </div>
            
            </div>
        </>
    );
};

export default Allocation;