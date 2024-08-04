import React, { useState, useEffect, useContext } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { PermissionsContext } from '../../App'; // Import the context

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null); // State for editing
  const [editingUserData, setEditingUserData] = useState({}); // State for edited data
  const permissions = useContext(PermissionsContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUsers(storedToken);
    }
  }, []);


  /*
  console.log("permissions",permissions)

  const localPermissions = { ...permissions };
  localPermissions.checklist_status_detail = { ...localPermissions.checklist_status_detail,list : false };
  console.log("localPermissions",localPermissions)
*/


  const fetchUsers = async (token, title) => {
    try {
      setIsLoading(true);

      let url = "http://188.121.99.245:8080/api/user/";
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
        console.log(data);
        setUsers(data.data || []);
        
      } else {
        setError('  لیست افراد دریافت نشد   ');
        setTimeout(() => {
          setError('');
      }, 3000);
        console.error('Failed to fetch users:', response.status, response.statusText);
      }
    } catch (error) {
      setError('  لیست افراد دریافت نشد   ');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error fetching users:', error.message);
    }
    setIsLoading(false);

  };

  const handleDeleteUser = async (username) => {
    setUserToDelete(username);
    setShowConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://188.121.99.245:8080/api/user/${userToDelete}/`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchUsers(token, selectedTitle);
      } else {
        setSuccessMessage(' با موفقیت حذف شد ');
        setTimeout(() => {
          setSuccessMessage('');
      }, 3000);
        console.error('Failed to delete user:', response.status, response.statusText);
      }
    } catch (error) {
      setError('  خطا در حذف ');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error deleting user:', error.message);
    }
    setShowConfirmation(false);
    setIsLoading(false);

  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
    fetchUsers(token, e.target.value);
  };

  const getTitleTranslation = (titleValue) => {
    const foundTitle = LIST_OF_TITLES.find((title) => title.value === titleValue);
    return foundTitle ? foundTitle.label : titleValue;
  };

  const startEditing = (user) => {
    console.log('user',user)
    setEditingUser(user._id);
    setEditingUserData({ ...user });
    setShowEditModal(true);
  };


  const cancelEditing = () => {
    setEditingUser(null);
    setEditingUserData({});
    setShowEditModal(false);
  };

  const saveEditing = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://188.121.99.245:8080/api/user/?username=${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingUserData)
      });
      if (response.ok) {
        fetchUsers(token, selectedTitle);
        cancelEditing();
        setSuccessMessage('  با موفقیت ویرایش شد     ');
        setTimeout(() => {
          setSuccessMessage('');
      }, 3000);
      } else {
        setError('  خطا در ویرایش');
        setTimeout(() => {
          setError('');
      }, 3000);
        console.error('Failed to update user:', response.status, response.statusText);
      }
    } catch (error) {
      setError('     خطا در ویرایش   ');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error updating user:', error.message);
    }
    setIsLoading(false);

  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUserData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("permissions", permissions);

  return (
    <div className="flex flex-col items-center w-full mt-10 mx-auto px-5 max-md:mt-10 max-md:max-w-full">
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟</h2>
            <div className="flex justify-center">
              <button onClick={confirmDeleteUser} className="bg-red-500 text-white py-2 px-4 rounded-md  hover:bg-red-600 mr-2 mr-2">حذف</button>
              <button onClick={() => setShowConfirmation(false)} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">انصراف</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full px-16 py-3 rounded-2xl max-md:px-5 mb-[-25px]">
        {permissions?.users_detail.add && (
          <button onClick={toggleModal} className="text-white bg-[color:var(--color-primary)] py-2 px-4 rounded-md">
            اضافه کردن کاربر
          </button>
        )}
        <div className="">افراد</div>

        {showModal && <AddUserForm onClose={toggleModal} token={token} fetchUsers={fetchUsers} selectedTitle={selectedTitle} />}
        {showEditModal && <EditUserForm onClose={toggleEditModal} token={token} fetchUsers={fetchUsers} selectedTitle={selectedTitle} userData={editingUserData} handleEditChange={handleEditChange} saveEditing={saveEditing} />}
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
      <div className="flex justify-end w-full px-16 py-3 max-md:px-5"></div>
      <div className="mt-2 max-w-full h-0.5 bg-black border border-black border-solid w-full" />
      <div className="bg-[color:var(--color-bg)] mt-3 w-[1100px] rounded-xl p-4" dir="rtl">
        {permissions?.users_detail.list && (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-center">
              <tr>
                <th className="px-4 py-2">نام</th>
                <th className="px-4 py-2">نام خانوادگی</th>
                <th className="px-4 py-2">نام خانوادگی</th>
                <th className="px-4 py-2">سمت</th>
                {permissions?.users_detail.edit && (
                  <th className="px-4 py-2"></th>
                )}
                {permissions?.users_detail.delete && (
                  <th className="px-4 py-2"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="px-4 py-2">{user.first_name}</td>
                  <td className="px-4 py-2">{user.last_name}</td>
                  <td className="px-4 py-2">{user.full_name}</td>
                  <td className="px-4 py-2">{getTitleTranslation(user.title)}</td>
                  {permissions?.users_detail.edit && (
                    <td className="px-4 py-2">
                      <button onClick={() => startEditing(user)} className="text-[color:var(--color-bg-variant)]">
                        <FaEdit />
                      </button>
                    </td>
                  )}
                  {permissions?.users_detail.delete && (
                    <td className="px-4 py-2">
                      <button className="text-red-500" onClick={() => handleDeleteUser(user.username)}>
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <br />
            {/* Error Pop-up */}
            {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}
    </div>
  );
}

function AddUserForm({ onClose, token, fetchUsers, selectedTitle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError("رمز عبور باید حداقل دارای 8 کاراکتر از جمله حروف بزرگ، کوچک، اعداد و کاراکترهای خاص باشد.");
      return;
    }
    try {
      setIsLoading(true);

      const response = await fetch("http://188.121.99.245:8080/api/user/", {
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
        fetchUsers(token, selectedTitle);
        setSuccessMessage('   با موفقیت اضافه شد    ');
        setTimeout(() => {
          setError('');
      }, 3000);
      } else {
        setError('  خطا در اضافه کردن      ');
        setTimeout(() => {
          setError('');
      }, 3000);
        console.error('Failed to add user:', response.status, response.statusText);
      }
    } catch (error) {
      setError('  خطا در اضافه کردن      ');
      setTimeout(() => {
        setError('');
    }, 3000);
      console.error('Error adding user:', error.message);
    }
    setIsLoading(false);

  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" dir="rtl">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <IoCloseSharp onClick={onClose} className="float-left cursor-pointer" />
        <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">اضافه کردن کاربر</h2>
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
            {/* Error Pop-up */}
            {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EditUserForm({ onClose, token, fetchUsers, selectedTitle , userData,error,successMessage, handleEditChange, saveEditing }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" dir="rtl">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <IoCloseSharp onClick={onClose} className="float-left cursor-pointer" />
        <h2 className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">ویرایش کاربر</h2>
        <form onSubmit={saveEditing} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="نام کاربری"
            value={userData.username}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="گذرواژه"
            value={userData.password}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <select
            name="title"
            value={userData.title}
            onChange={handleEditChange}
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
            name="first_name"
            placeholder="نام"
            value={userData.first_name}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="نام خانوادگی"
            value={userData.last_name}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <button type="button" onClick={saveEditing} className="bg-[color:var(--color-bg-variant)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] transition-all m-2">
            ذخیره
          </button>
        </form>
      </div>
            {/* Error Pop-up */}
            {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-red-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary-variant)]">{error}</p>
          </div>
        </div>
      )}
      {/* Popup for success message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full mx-auto shadow-lg border-e-green-50">
            <p className="text-2xl font-semibold mb-4 text-center text-[color:var(--color-primary)]">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
