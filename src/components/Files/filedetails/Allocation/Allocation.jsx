    import React, { useState, useEffect,useContext } from 'react';
    import axios from 'axios';
    import NavList from '../NavList';
    import { useReport } from '../ReportContext'; // Import the useReport hook
    import { PermissionsContext } from '../../../../App'; // Import the context


    const Allocation = () => {
        const [experts, setExperts] = useState([]);
        const [assignments, setAssignments] = useState({});
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
        const { fileId } = useReport(); // Retrieve fileId from ReportContext
        const permissions = useContext(PermissionsContext); // Use the context



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
                setError('دریافت کارشناسان موفق نبود');
                setTimeout(() => {
                    setError('');
                }, 3000);
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
                setAssignments(response.data.data || {}); // Set assignments to fetched data or empty object if no data
            } catch (err) {
                setError('خطا در دریافت');
                setTimeout(() => {
                    setError('');
                }, 3000);
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
                setLoading(true);
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
                setSuccessMessage('با موفقیت بروزرسانی شد');
                // Remove success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } catch (err) {
                setError('بروزرسانی موفق نبود');
                // Remove error message after 3 seconds
                setTimeout(() => {
                    setError('');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        return (
            <>
                <NavList />
                {loading && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
                    </div>
                )}
                <div className=" ml-[700px] justify-center">
                    <div className=" mx-[-100px] my-2 p-6 bg-white w-full" dir='rtl'>
                        <h1 className="text-2xl   font-semibold  mb-10    text-[color:var(--color-primary-variant)]" dir='rtl'>تخصیص</h1>
                    
                        {permissions?.assign_detail.list&& (

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
                            {permissions?.assign_detail.add&& (

                            <button className="mt-6 py-2 px-4 bg-[color:var(--color-bg-variant)] hover:bg-[color:var(--color-primary)] text-white font-bold rounded-md" type="submit">
                                بروزرسانی تخصیص
                            </button>
                            )}
                        </form>
                        )}
                    </div>
                </div>
                {/* Popup for error message */}
                {error && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
                            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
                        </div>
                    </div>
                )}
                {/* Popup for successMessage message */}
                {successMessage && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
                            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
                        </div>
                    </div>
                )}
            </>
        );
    };

    export default Allocation;
