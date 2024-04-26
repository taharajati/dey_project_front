import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const logo1Ref = useRef(null);
  const [logo2Position, setLogo2Position] = useState({ top: 0, left: 0 });

  const calculateLogo2Position = () => {
    const logo1Width = logo1Ref.current.clientWidth;
    const logo2Width = logo1Width * 0.2; // Adjust the percentage as needed
    const logo2Height = (logo2Width * logo2.height) / logo2.width;
    const logo1LeftOffset = (logo1Width - logo2Width) / 2;
    const logo1TopOffset = (logo1Ref.current.clientHeight - logo2Height) / 2;
    setLogo2Position({ left: logo1LeftOffset, top: logo1TopOffset });
  };

  useEffect(() => {
    calculateLogo2Position();
    window.addEventListener("resize", calculateLogo2Position);
    return () => {
      window.removeEventListener("resize", calculateLogo2Position);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://188.121.99.245/api/auth/login", {
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
        // Use window.location to force a full page refresh and redirect
        window.location = "/ongoingfiles";
      } else {
        alert("!ورود ناموفق");
      }
    } catch (error) {
      alert("خطای شبکه!");
    }
  };

  return (
    <div className="flex items-center justify-center h-[80%] mt-[-36px] bg-[color:var(--color-bg)]">
      {/* Left side: Picture */}
      <div className="relative w-full h-full" ref={logo1Ref}>
        {/** Conditionally render logo1 based on screen size */}
        {window.innerWidth >= 768 && (
          <img src={logo1} alt="Logo 1" className="h-full w-[900px]" />
        )}
        {/** Conditionally render logo2 based on screen size */}
        {window.innerWidth >= 768 && (
          <img
            src={logo2}
            alt="Logo 2"
            className="absolute top-[50%] left-[42%] transform -translate-x-1/2 -translate-y-1/2"
            style={{ width: "20%" }}
          />
        )}
      </div>

   {/* Right side: Login box */}
   <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-1/2 mr-[5%] sm:w-full md:w-full">
    
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            type="submit"
            className="bg-[color:var(--color-bg-variant)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--color-primary)] transition-all w-full"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
