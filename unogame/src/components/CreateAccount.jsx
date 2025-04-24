import React, {useState,useEffect} from 'react';
import NEXTGen from '../components/Assets/next-gen.png';
import UNO from '../components/Assets/uno.png';
import home from '../components/Assets/home.svg';
import styles from "../styles/CreateAccount.module.css";
import { useNavigate } from 'react-router-dom';
import { isValidPassword } from './validate_password';
import NEXTGEN from "./Assets/next-genL.png"
import UNO2 from "./Assets/unoL.png"
import "./MCSS/LogInM.css"



const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [valid, setValid] = useState({valid: false, message: ""});   
    const navigate = useNavigate();
  
    const goToLogin = () => {
      navigate("/login");
    }

    const goToMain = () => {
      navigate("/");
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if(password !== password2){
        setValid({valid: false, message :"Passwords do not match"});
        return;
      }
      const result = isValidPassword(username, password);
      if (result["valid"] === false) {
        setValid(result);
        return;
      }
      else{
        
        try{
        
          const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/index.php",
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({username, password}),
            }  
            );
            
            const data = await response.json();

            if (data.status === "success") {
              localStorage.setItem("username", username); 
              navigate("/");
              setValid({valid: true, message:"Account Created"});
            } 
          
          }
          catch (error) {
            console.error("Error creating account:", error);
            setValid({valid: false, message: "An error occurred. Please try again."});
          }
          
            
      }
    }

    
  return (
     <div className= {styles.container2}>
          <div className={styles.CA_box}>
            <h1 className={styles.logo}>NEXT GEN UNO</h1>
            <form onSubmit = {handleSubmit}className={styles.CA_form}>
              <label htmlFor="username">Create Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
    
              <label htmlFor="password"> Create Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <label htmlFor="password"> Confirm Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword2(e.target.value)}
              />
              <div className="whitespace-pre-line">
              <p className = "text-red-500 font-bold">{valid.message}</p>
              </div>
              <button type="submit" className={styles.Signup_button}>
                Sign Up
              </button>

            </form>
    
            <p className="signup-text">
              Already have an account?{" "}
              {/* <button onClick={goToLogin} className={styles.Signup_button}>
                  Sign Up
              </button> */}
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
    
  );
}

export default CreateAccount;
