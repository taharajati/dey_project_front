import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const LIST_OF_TITLES = [
  { value: "manager", label: "مدیر" },
  { value: "audit_chief", label: "رئیس حسابرسی" },
  { value: "expert", label: "کارشناس" },
  { value: "branch_manager", label: "مدیر شعبه" },
  { value: "user_admin", label: "مدیر کاربران" }
];

function UserList() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(""); // New state for selected title
  const [userToDelete, setUserToDelete] = useState(null); // State to store user to delete
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control confirmation box


  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUsers(storedToken, "branch_manager"); // Fetch users with the "branch_manager" title
    }
  }, []);

  const fetchUsers = async (token, title) => {
    try {
      let url = "http://188.121.99.245/api/user/";
      if (title) {
        url += `?title=${title}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUsers(data.data || []);
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };  

console.log(users)

const handleDeleteUser = async (username) => {
  setUserToDelete(username); // Set the user to delete
  setShowConfirmation(true); // Show confirmation box
};

const confirmDeleteUser = async () => {
  try {
    const response = await fetch(`http://188.121.99.245/api/user/${userToDelete}/`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      fetchUsers(token, selectedTitle);
    } else {
      console.error('Failed to delete user:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
  setShowConfirmation(false); // Hide confirmation box after deletion
};

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
    fetchUsers(token, e.target.value);
  };
  function getTitleTranslation(titleValue) {
    const foundTitle = LIST_OF_TITLES.find(title => title.value === titleValue);
    return foundTitle ? foundTitle.label : titleValue;
  }
  return (
    <div className="flex flex-col items-center w-full mt-10  mx-auto px-5 max-md:mt-10 max-md:max-w-full">
          {/* Confirmation box */}
          {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full ">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)] ">آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟</h2>
            <div className="flex justify-center">
              <button onClick={ confirmDeleteUser} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2">حذف</button>
              <button onClick={() => setShowConfirmation(false)} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">انصراف</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full px-16 py-3 rounded-2xl max-md:px-5  mb-[-25px]">
        <button onClick={toggleModal} className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md">
          اضافه کردن کاربر
        </button>      
        <div className="">افراد</div>

        {showModal && <AddUserForm onClose={toggleModal} token={token} fetchUsers={fetchUsers} selectedTitle={selectedTitle} />}
        <div>
    

          <select
            value={selectedTitle}
            onChange={handleTitleChange}
            className="border border-gray-300 rounded-md px-4 py-2" 
          >
            <option value="">عنوان را انتخاب کنید</option>
            {LIST_OF_TITLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

        </div>
      </div>
      <div className="flex justify-end w-full px-16 py-3 max-md:px-5 ">
      </div>
      <div className="mt-2 max-w-full h-0.5 bg-black border border-black border-solid w-full " />
      <div className="bg-[color:var(--color-bg)] mt-3 w-[1100px] rounded-xl p-4 " dir="rtl">
        <table className="w-full border-collapse  ">
          <thead className="bg-gray-200 text-center"> 
            <tr >
              <th className="px-4 py-2 "> نام</th>
              <th className="px-4 py-2">نام خانوادگی</th>
              <th className="px-4 py-2">نام خانوادگی</th>
              <th className="px-4 py-2">سمت</th>
              <th className="px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td>{user.full_name}</td>
                <td className="px-4 py-2">{getTitleTranslation(user.title)}</td>
                <td className="px-4 py-2">
                <button className="text-red-500" onClick={() => handleDeleteUser(user.username)}>
              <IoCloseSharp />
            </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br/>
    </div>
  );
}

function AddUserForm({ onClose, token, fetchUsers, selectedTitle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError("رمز عبور باید حداقل دارای 8 کاراکتر از جمله حروف بزرگ، کوچک، اعداد و کاراکترهای خاص باشد.");
      return;
    }
    try {
      const response = await fetch("http://188.121.99.245/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          password,
          title,
          first_name: firstName,
          last_name: lastName
        })
      });

      if (response.ok) {
        onClose();
        // Update the user list after successful addition
        fetchUsers(token, selectedTitle);
      } else {
        console.error('Failed to add user:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  const validatePassword = (password) => {
    // Regular expressions for password complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
    const hasMinLength = password.length >= 8;
    // Check if all conditions are met
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center " dir="rtl">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full ">
        <IoCloseSharp onClick={onClose} className="float-left cursor-pointer" />
        <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)] ">اضافه کردن کاربر</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="نام کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="گذرواژه"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          >
            <option value="">عنوان را انتخاب کنید</option>
            {LIST_OF_TITLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="نام"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <button type="submit" className="bg-[color:var(--color-bg-variant)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] transition-all m-2">
            اضافه کردن کاربر
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserList;
