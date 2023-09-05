import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { BiSolidUser, BiSolidUserBadge } from "react-icons/bi";
import { HiMiniUserGroup } from "react-icons/hi2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginInput = ({
  name,
  setName,
  email,
  setEmail,
  type,
  isSignUp,
  setIsSignUp,
  password,
  setPassword,
  cpassword,
  setCPassword,
  pic,
  setPic
}) => {
  const [isFocus, setIsFocus] = useState({
    name: false,
    email: false,
    password: false,
    cpassword: false,
    pic: false
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleFocus = (field) => {
    setIsFocus((previousState) => ({
      ...previousState,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    setIsFocus((previousState) => ({
      ...previousState,
      [field]: false
    }));
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pic === undefined) {
      alert("Give valid picture");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "gyap-syap");
      data.append("cloud_name", "ddcpocb6l");
      fetch("https://api.cloudinary.com/v1_1/ddcpocb6l/image/upload", {
        method: "POST",
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
          setLoading(false);
        });
    } else {
      alert("Please upload a jpeg or png file");
      return;
    }
  };

  const submitSignUpHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !cpassword) {
      alert("All fields are mandatory");
      setLoading(false);
      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check if pic is defined and not empty
    if (!pic) {
      alert("Please upload a profile picture");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      // Make sure pic is properly set in the request payload
      const requestData = {
        name,
        email,
        password,
        pic
      };

      const { data } = await axios.post(
        "api/user/",
        requestData,
        config
      );
      alert("Registration is successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log("Error:", error); // Log the error for debugging
      alert("An error occurred during registration");
      setLoading(false);
    }

    console.log(name, email, password, cpassword, pic);
  };

  const submitSignInHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      alert("All fields are mandatory");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      // Make sure pic is properly set in the request payload
      const requestData = {
        email,
        password
      };

      const { data } = await axios.post(
        "api/user/login",
        requestData,
        config
      );
      alert("Login is successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log("Error:", error); // Log the error for debugging
      alert("An error occurred during registration");
      setLoading(false);
    }

    console.log(email, password);
  };

  return (
    <main className="flex flex-col space-y-6 w-full justify-center">
      {!isSignUp && (
        <div
          className={`bg-white flex flex-row space-x-3 px-2 py-1 items-center rounded-md ${
            isFocus.name &&
            "border-b-4 border-red-500 transition-all duration-300"
          }`}>
          <BiSolidUser />
          <input
            type="text"
            placeholder="Your Name Here"
            className="outline-none w-full"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onFocus={() => {
              handleFocus("name");
            }}
            onBlur={() => handleBlur("name")}
          />
        </div>
      )}
      <div
        className={`bg-white flex flex-row space-x-3 px-2 py-1 items-center rounded-md ${
          isFocus.email &&
          "border-b-4 border-red-500 transition-all duration-300"
        }`}>
        <MdEmail />
        <input
          type="email"
          placeholder="Email Here"
          className="outline-none w-full"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onFocus={() => {
            handleFocus("email");
          }}
          onBlur={() => handleBlur("email")}
        />
      </div>
      <div
        className={`bg-white flex flex-row space-x-3 px-2 py-1 items-center rounded-md ${
          isFocus.password &&
          "border-b-4 border-red-500 transition-all duration-300"
        }`}>
        <RiLockPasswordFill />
        <input
          type="password"
          placeholder="Password Here"
          className="outline-none"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onFocus={() => {
            handleFocus("password");
          }}
          onBlur={() => handleBlur("password")}
        />
      </div>
      {!isSignUp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`bg-white flex flex-row space-x-3 px-2 py-1 items-center rounded-md ${
              isFocus.cpassword &&
              "border-b-4 border-red-500 transition-all duration-300"
            }`}>
            <RiLockPasswordFill />
            <input
              type="password"
              placeholder="Confirm Password Here"
              className="outline-none"
              value={cpassword}
              onChange={(e) => {
                setCPassword(e.target.value);
              }}
              onFocus={() => {
                handleFocus("cpassword");
              }}
              onBlur={() => handleBlur("cpassword")}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`bg-white flex flex-row space-x-3 px-2 py-1 items-center rounded-md ${
              isFocus.pic &&
              "border-b-4 border-red-500 transition-all duration-300"
            }`}>
            <BiSolidUserBadge />
            <input
              type="file"
              placeholder="Profile Picture"
              className="outline-none"
              accept="image/*"
              onChange={(e) => {
                postDetails(e.target.files[0]);
              }}
              onFocus={() => {
                handleFocus("pic");
              }}
              onBlur={() => handleBlur("pic")}
            />
          </motion.div>
        </>
      )}
      {isSignUp ? (
        <p className="text-center text-white space-x-2">
          Don't have an account?
          <span
            className="text-red-500 underline underline-offset-2 font-semibold cursor-pointer pl-2"
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}>
            Create Here
          </span>
        </p>
      ) : (
        <p className="text-center text-white">
          Already have an account?
          <span
            className="text-red-500 underline underline-offset-2 font-semibold cursor-pointer pl-2"
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}>
            Sign in Here
          </span>
        </p>
      )}
      {/* Button Section  */}
      {isSignUp ? (
        <button
          className="cursor-pointer w-full bg-red-400 py-1 rounded-md text-sm font-semibold text-white hover:scale-95 transition-all duration-200"
          onClick={submitSignInHandler}>
          Sign In
        </button>
      ) : (
        <button
          className="cursor-pointer w-full bg-red-400 py-1 rounded-md text-sm font-semibold text-white hover:scale-95 transition-all duration-200"
          onClick={submitSignUpHandler}>
          Sign Up
        </button>
      )}
      {isSignUp && (
        <button
          className="flex flex-row px-10 py-1 text-white space-x-4 bg-red-600 items-center rounded-3xl justify-center hover:scale-95 transition-all duration-200"
          onClick={() => {
            setemail("guest@example.com");
            setPassword("123456");
          }}>
          <HiMiniUserGroup fontSize={25} color="white" />
          <p className="text-sm font-semibold">Get Guest User Credentials</p>
        </button>
      )}

      <div className="flex flex-row text-white items-center space-x-6">
        <div className="w-36 h-px bg-white"></div>
        <span>or</span>
        <div className="w-36 h-px bg-white"></div>
      </div>
      <button className="flex flex-row px-10 py-1 space-x-4 bg-white items-center rounded-3xl justify-center hover:scale-95 transition-all duration-200">
        <FcGoogle fontSize={25} />
        <p className="text-sm font-semibold">Sign in with Google</p>
      </button>
    </main>
  );
};

export default LoginInput;
