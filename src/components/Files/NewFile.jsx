import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewFile = () => {
  // State variables
  const [branches, setBranches] = useState([]);
  const [auditChiefs, setAuditChiefs] = useState([]);
  const [formError, setFormError] = useState('');

  const [experts, setExperts] = useState([]);
  const [formData, setFormData] = useState({
    branch_id: '',
    period: '',
    date_title: '',
    audit_chief_username: '',
    experts: [],
    financial_year:''
  });
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Get navigate function from useNavigate hook

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchBranches(storedToken);
      fetchAuditChiefs(storedToken);
      fetchExperts(storedToken);
    }
  }, []);

  // Fetch branches with authorization
  const fetchBranches = async (token) => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch("http://188.121.99.245:8080/api/branch/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setBranches(data.data);
        } else {
          console.error('قالب داده نامعتبر دریافت شده برای شعب:', data);
        }
      } else {
        console.error('دریافت شعب ناموفق بود:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('خطا در دریافت شعب :', error.message);
    }
    setIsLoading(false); // Reset loading state
  };
  
  // Fetch audit chiefs with authorization
  const fetchAuditChiefs = async (token) => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch("http://188.121.99.245:8080/api/user/?title=audit_chief", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setAuditChiefs(data.data);
        } else {
          console.error('فرمت داده نامعتبر دریافت شده برای سرپرست حسابرسی:', data);
        }
      } else {
        console.error('دریافت مدیران حسابرسی انجام نشد:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('خطا در دریافت مدیران حسابرسی:', error.message);
    }
    setIsLoading(false); // Reset loading state
  };
  
  // Fetch experts with authorization
  const fetchExperts = async (token) => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch("http://188.121.99.245:8080/api/user/?title=expert", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setExperts(data.data);
        } else {
          console.error('فرمت داده نامعتبر دریافت شده برای کارشناسان:', data);
        }
      } else {
        console.error('دریافت کارشناسان انجام نشد:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('خطا در دریافت کارشناسان:', error.message);
    }
    setIsLoading(false); // Reset loading state
  };

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  // Check if any required field is empty
  if (
    formData.branch_id === '' ||
    formData.period === '' ||
    formData.date_title === '' ||
    formData.audit_chief_username === '' ||
    formData.financial_year === ''
  ) {
    setFormError('لطفا تمامی فیلدهای موردنیاز را پر کنید');
    return; // Exit the function early if any field is empty
  }

  // Clear previous form error if any
  setFormError('');

  try {
    const selectedBranch = branches.find(branch => branch._id?.$oid === formData.branch_id);
    const response = await fetch('http://188.121.99.245:8080/api/report/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        branch_id: selectedBranch?._id?.$oid,
        period: formData.period,
        date_title: formData.date_title,
        audit_chief_username: formData.audit_chief_username,
        experts: formData.experts,
        financial_year: formData.financial_year
      })
    });
    if (response.ok) {
      // Navigate to the OngoingFiles component
      navigate('/ongoingfiles');
    } else {
      console.error('خطا در ایجاد فایل:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('خطا در ایجاد فایل:', error.message);
  }
};


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

// Handle checkbox change for experts
const handleExpertCheckboxChange = (e, expertId) => {
  const isChecked = e.target.checked;
  if (isChecked) {
    // If the expert is checked, add it to the list
    setFormData((prevData) => ({
      ...prevData,
      experts: [...prevData.experts, expertId]
    }));
  } else {
    // If the expert is unchecked, remove it from the list
    setFormData((prevData) => ({
      ...prevData,
      experts: prevData.experts.filter((id) => id !== expertId)
    }));
  }
};

  return (
    <div className="flex flex-col  w-full items-center justify-center mt-8 mx-auto px-5 max-md:mt-10 max-md:max-w-full text-center">
    <h2 className=" mb-4 font-semibold mx-20 text-[color:var(--color-primary-variant)] text-2xl " dir="rtl">ایجاد پرونده جدید</h2>
    <div className="mt-2 max-w-full h-0.5 bg-black border  opacity-50 border-black border-solid w-full" />
    
    <div className="  min-h-screen p-4 w-[700px]  " dir="rtl">
      <div className="  rounded-lg shadow-lg p-10 ">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex">
  <label htmlFor="branchId" className="mb-1 mx-3 flex items-center">
    انتخاب شعبه:
  </label>
  <select
    id="branchId"
    name="branch_id"
    onChange={handleInputChange}
    value={formData.branch_id}
    className="border rounded-md px-2 py-1 flex-auto w-64" 
  >
    <option value="">لطفا انتخاب کنید</option>
    {branches.map((branch) => (
      <option key={branch._id} value={branch._id.$oid}>
        {branch.name}
      </option>
    ))}
  </select>
</div>
<div className="flex">
  <label htmlFor="period" className="mb-1 mx-3 flex items-center">
    تاریخ گزارش:
  </label>
  <input
    type="text"
    id="period"
    name="period"
    onChange={handleInputChange}
    value={formData.period}
    placeholder="مثال: 1400/01/01"
    className="border rounded-md px-2 py-1 flex-auto w-64" 
  />
</div>
<div className="flex">
  <label htmlFor="dateTitle" className="mb-1 mx-3 flex items-center">
    تاریخ تهیه:
  </label>
  <input
    type="text"
    id="dateTitle"
    name="date_title"
    onChange={handleInputChange}
    value={formData.date_title}
    placeholder="مثال: مهر 1400"
    className="border rounded-md px-2 py-1 flex-auto w-64" 
  />
</div>
<div className="flex">
              <label htmlFor="financialYear" className="mb-1 mx-3 flex items-center">
                سال مالی:
              </label>
              <input
                type="number"
                id="financialYear"
                name="financial_year"
                onChange={handleInputChange}
                value={formData.financial_year}
                className="border rounded-md px-2 py-1 flex-auto w-64" 
              />
            </div>
<div className="flex">
  <label htmlFor="auditChiefUsername" className="mb-1 mx-3 flex items-center">
    سرپرست حسابرسی:
  </label>
  <select
    id="auditChiefUsername"
    name="audit_chief_username"
    onChange={handleInputChange}
    value={formData.audit_chief_username}
    className="border rounded-md px-2 py-1 flex-auto w-64">
    <option value="">لطفا انتخاب کنید</option>
    {auditChiefs.map((auditChief) => (
      <option key={auditChief._id} value={auditChief._id}>
        {auditChief.full_name}
      </option>
    ))}
  </select>
</div>
<div className="flex ">
  <label htmlFor="selectedExperts" className="mb-1 mx-3 flex items-center">
    کارشناسان:
  </label>
  <div className="border rounded-md px-2 py-1 w-64">
    {experts.map((expert) => (
      <div key={expert._id} className="flex items-center">
        <input
          type="checkbox"
          id={`expert_${expert._id}`}
          value={expert._id}
          onChange={(e) => handleExpertCheckboxChange(e, expert._id)}
          className="mr-2"
        />
        <label htmlFor={`expert_${expert._id}`}>{expert.full_name}</label>
      </div>
      
    ))}
   
  </div>
</div>

          <button type="submit" className="bg-[color:var(--color-bg-variant)] text-[color:var(--color-light)] py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">ارسال</button>
          {formError && <div className="text-red-600">{formError}</div>}
        </form>
      </div>
    </div>
    
    </div>
  );
}

export default NewFile;
