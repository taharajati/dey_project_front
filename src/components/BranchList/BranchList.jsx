import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

function BranchList() {
  const [branches, setBranches] = useState([]);
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchBranches(storedToken); // Call fetchBranches with the stored token
    }
  }, []);

  const fetchBranches = async (token) => {
    try {
      const response = await fetch("http://188.121.99.245/api/branch/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBranches(data.data || []);
      } else {
        console.error('Failed to fetch branches:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching branches:', error.message);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    try {
      const response = await fetch(`http://188.121.99.245/api/branch/${branchId}/`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        // Update the branch list after successful deletion
        fetchBranches(token);
      } else {
        console.error('Failed to delete branch:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting branch:', error.message);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="flex flex-col items-center w-full  mt-10 mx-auto px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex justify-between items-center w-full px-16 py-3 rounded-2xl max-md:px-5">
        <button onClick={toggleModal} className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md">
          اضافه کردن شعبه
        </button>
        {showModal && <AddBranchForm onClose={toggleModal} token={token} fetchBranches={fetchBranches} />}
        <div>شعب</div>
      </div>
      <div className="mt-2 max-w-full h-0.5 bg-black border border-black border-solid w-full" />
      <div className="bg-[color:var(--color-bg)] mt-3 max-w-full rounded-xl p-4"  dir="rtl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="px-4 py-2">نام</th>
              <th className="px-4 py-2">شهر</th>
              <th className="px-4 py-2">تاریخ تاسیس</th>
              <th className="px-4 py-2">سطح</th>
              <th className="px-4 py-2">توضیحات</th>
              <th className="px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch._id} className="text-center">
                <td className="px-4 py-2">{branch.name}</td>
                <td className="px-4 py-2">{branch.city}</td>
                <td className="px-4 py-2">{branch.establishment_date_jalali}</td>
                <td className="px-4 py-2">{branch.level}</td>
                <td className="px-4 py-2">{branch.description}</td>
                <td className="px-4 py-2">
                  <button className="text-red-500" onClick={() => handleDeleteBranch(branch._id)}>
                    <IoCloseSharp />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddBranchForm({ onClose, token, fetchBranches }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [establishmentDate, setEstablishmentDate] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://188.121.99.245/api/branch/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          city,
          establishment_date: establishmentDate,
          description,
          level
        })
      });

      if (response.ok) {
        // Reload the branch list after successful addition
        fetchBranches(token);
        onClose();
      } else {
        console.error('Failed to add branch:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding branch:', error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center " dir="rtl" >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full ">
        <IoCloseSharp onClick={onClose} className="float-left  cursor-pointer" />
        <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">اضافه کردن شعبه</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="نام شعبه"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="شهر"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="تاریخ تاسیس"
            value={establishmentDate}
            onChange={(e) => setEstablishmentDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <textarea
            placeholder="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          ></textarea>
          <input
            type="number"
            placeholder="سطح شعبه"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <button type="submit" className="bg-[color:var(--color-bg-variant)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] transition-all m-2">
            اضافه کردن شعبه
          </button>
        </form>
      </div>
    </div>
  );
}

export default BranchList;
