import React, { useState, useEffect } from 'react';
import styles from '../styles/LogIn.module.css';
import NEXTGen from '../components/Assets/next-gen.png';
import UNO from '../components/Assets/uno.png';
import home from '../components/Assets/home.svg';
import { useNavigate } from 'react-router-dom';
import { Divide } from 'lucide-react';
import NEXTGEN from "./Assets/next-genM.png"
import UNO2 from "./Assets/unoM.png"
import "./MCSS/LogInM.css"


const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const goToCreateAccount = () => {
    navigate("/create-account");
  }

  const goToMain = () => {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    if (username === "" || password === "") {
      setError("ERROR: Please enter a username and password.");
      return;
    }

    e.preventDefault();
    try{
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/login.php",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
      });

      const data = await response.json();
      setError(data);

      if(data["message"] === "User verified"){
        localStorage.setItem("username", username);
        navigate("/");
        setError("Welcome Back!");
      }
      else{
        setError("ERROR: Invalid username or password.");
      }
    }
    catch(error){
      setError("ERROR: An error occurred. Please try again.");
    }

  
  }


return (
    <div className={styles.container}>
      <div className={styles.login_box}>
        <h1 className={styles.logo1}>NEXT GEN UNO</h1>

        <form onSubmit ={handleSubmit} className={styles.login_form}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}

          />

          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className={styles.login_button}>
            Log In
          </button>

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
          <p className = "text-red-500 font-bold" >{error}</p>
        </form>

        <p className={styles.signup_text}>
          Don't have an account?{" "}
          <button onClick={goToCreateAccount} className={styles.create_account}>
            Create Account
          </button>
        </p>
      </div>

      <div className={styles.background_elements}>
        <img className={styles.background_logo} alt="Next GEN" src={NEXTGen} />
        <img className={styles.background_uno} alt="Uno" src={UNO} />
      </div>
      <div onClick={goToMain}>
        <img className={styles.home_icon} alt="Home" src={home} />
      </div>
    </div>
  )

}

export default LogIn