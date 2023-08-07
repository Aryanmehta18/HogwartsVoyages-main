import React, { useState } from "react";
import "./styles.css";
import "./buttonStyles.css";


import { auth, provider } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import config from "./config";
const url = config.apiUrl;




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogin, setisLogin] = useState(true);
  const navigate = useNavigate();

  const credentials = {
    email,
    password,
    username,
  };

  // to verify the login details
  const verifyData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url + "/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      var data = await response.json();
      // checking for errors and showing relevant info to user
      if (data.error === "user error") {
        setErrorMessage("User not found");
      } else if (data.error === "password error") {
        setErrorMessage("Incorrect Password!");
      } else {
        setErrorMessage("Welcome " + data.verified + "!");
        navigate(`/home/${data.verified}`);
      }

    } catch (error) {
      console.error("Login error line 42");
    }
  };

  // to signup a new user
  const SingUpuser = async (e) => {
    // e.preventDefault();
    try {
      const response = await fetch(url + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      var data = await response.json();
      // checking that signup was successful or not
      if (data.error === "username already exists") {
        setErrorMessage("Username already exsits");
      } else {
        setErrorMessage("Welcome " + data.verified + "!");
        navigate(`/home/${data.verified}`);
      }

    } catch (error) {
      console.log("Login error line 79");
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      const email = user.email;
      credentials.email = email;
      credentials.username = user.displayName;
      credentials.password = "#4284902"
      SingUpuser();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Something went wrong!");
    }
  };

  // to change the state of dialogue boxes
  const toggleForm = () => {
    setisLogin(!isLogin);
    setErrorMessage("");
  };

  return (
    
    
    <div className="login-container">
      <div className="header-text">
        Welcome to HogwartsVoyages!
      </div>
      
      
      <div className="login-box">
       
        <h2 className="login-text">
          
          
          
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {isLogin ? (
          <form className="login-form" onSubmit={verifyData}>
            <input
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button-primary" type="submit">
              Login
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={SingUpuser}>
            <input
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button-primary" type="submit">
              Sign Up
            </button>
          </form>
        )}
        <button className="button-google" type="button" onClick={handleGoogleSignIn}>
          Login with Google
        </button>


        <button className="button-secondary" type="button" onClick={toggleForm}>
          {!isLogin ? "Already a User? Login now!" : "New User? Sign Up now!"}
        </button>

        

        { // to display if there way any error
          // TODO: create a class for error messages
          errorMessage && <p className="error-text">
            {errorMessage}
          </p>
        }
        <div  style={{ width: "100%", height: 0, paddingBottom: "35%", position: "relative" }}>
          <a href="https://giphy.com/gifs/harry-51sDmvdwnr8qY" target="_blank" rel="noopener noreferrer">
            <iframe src="https://giphy.com/embed/51sDmvdwnr8qY" width="100%" height="100%" style={{ position: "absolute", objectFit: "cover" }} frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
          </a>
        </div>

      </div>
    </div>
   
  );
};

export default Login;