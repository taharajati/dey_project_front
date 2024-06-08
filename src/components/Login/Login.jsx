import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const logo1Ref = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch("http://188.121.99.245:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        window.location = "/ongoingfiles";
      } else {
        alert("!ورود ناموفق");
      }
    } catch (error) {
      alert("خطای شبکه!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-[color:var(--color-bg)]">
      {/* Left side: Picture */}
      <div className="relative w-full h-full hidden md:flex items-center justify-center" ref={logo1Ref}>
        <img src={logo1} alt="Logo 1" className="h-full w-full object-cover" />
        <img
          src={logo2}
          alt="Logo 2"
          className="absolute"
          style={{ width: "20%" }}
        />
      </div>

      {/* Right side: Login box */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-4 md:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-[color:var(--color-primary-variant)] text-2xl mb-8">ورود به سامانه</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-gray-500" dir="rtl">نام کاربری</label>
            <input
              type="text"
              placeholder="نام کاربری را وارد کنید"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
              dir="rtl"
            />
            <label className="text-gray-500" dir="rtl">رمز ورود</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز ورود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                style={{ paddingRight: '1rem' }}
                dir="rtl"
              />
              <button
                type="button"
                className="absolute top-1/2 left-3 transform -translate-y-1/2 focus:outline-none text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-[color:var(--color-bg-variant)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] transition-all w-full mt-4 shadow-lg"
            >
              ورود
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
