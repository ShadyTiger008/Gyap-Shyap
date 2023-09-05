import React, { useEffect, useState } from "react";
import { Logo } from "../assets";
import LoginInput from "../components/LoginInput";
import Background from "../assets/vids/background.mp4";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [pic, setPic] = useState("");
  const [ isSignUp, setIsSignUp ] = useState( false );
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      //   window.location.href = "/login";
      navigate("/");
    }
  }, [navigate]);
  return (
    <main className="h-screen w-screen overflow-hidden relative flex">
      <video
        loop
        muted
        autoPlay
        className="absolute inset-0 object-cover w-full h-full">
        <source src={Background} type="video/mp4" />
      </video>

      {/* Content Box */}
      <section className="absolute flex flex-col items-center w-full md:w-[508px] h-full backdrop-filter backdrop-blur-md bg-slate-400/10 p-10">
        {/* Top logo section */}
        <div className="flex items-center justify-start w-full">
          <img src={Logo} alt="Logo" className="w-20 h-20" />
          <p className="text-white font-semibold text-3xl sm:text-4xl">
            Gyap-Syap
          </p>
        </div>
        {/* Welcome text */}
        <div className="w-full flex flex-col mt-6 items-center mb-5">
          <p className="text-white text-3xl font-semibold">Welcome Back</p>
          <p className="text-xl text-slate-300">
            {isSignUp ? "Sign In" : "Sign Up"} with the following
          </p>
        </div>
        {/* Input section */}
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-6">
          <LoginInput
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            cpassword={cpassword}
            setCPassword={setCPassword}
            pic={pic}
            setPic={setPic}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
          />
        </div>
      </section>
    </main>
  );
};

export default Login;
