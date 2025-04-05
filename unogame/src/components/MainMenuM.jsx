import React from 'react';
import styles from '../styles/MainMenu.module.css';
import { useNavigate } from 'react-router-dom';
import "./MCSS/MainMenu.css"
import {useState, useEffect} from 'react';
import { Section } from 'lucide-react';
import NEXTGen from "./Assets/next-genM.png"
import UNO from "./Assets/unoM.png"
import tutorialCircle from "./Assets/tutorial-circle.svg"
import SettingsPopup from "./SettingsPopup";
import MobilePopup from "../MobilePopup";
import Tutorial from './Tutorial';


function MainMenuMobile () {
    const navigate = useNavigate();
  
    const goToPlayPage = () => {
      navigate("/play");
  
    }
  
    const goToLogin = () => {
      navigate("/login");
    
  };
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
  
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [money, setMoney] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  
  const [isTutOpen, setIsTutOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  useEffect(() => {
    const fetchUserMoney = async () => {
      if (!username) {
        setIsLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/bet.php?username=${username}`);
        const data = await response.json();
  
        if (data.money !== undefined) {
          localStorage.setItem('money', parseFloat(data.money).toFixed(2));
          setMoney(parseFloat(data.money).toFixed(2));
          console.log(data.money);
        } else {
          setMoney('0.00');
        }
      } catch (error) {
        console.error("Failed to fetch money:", error);
        setMoney('0.00');
      } finally {
        setIsLoading(false);
      }
    };  
  
    fetchUserMoney();
    }, [username]);

    <span className={styles.money_display}>  ${!isLoading ? money : 'Loading...'} </span>

    return(
      <main className="p-main-screen">
      <section className="container">
      <header className="header">
      {username ? (
                       <>
                       <span className="username-display ">{username}</span>
                       <span className= "money-dis">  ${!isLoading ? money : 'Loading...'} </span>
                       </>
                    ) : (
                        <button className="login-button" onClick={() => navigate('/Login')}>Log In</button>
                    )}
          {/* <button className="login-button" onClick={() => navigate('/Login')}>Log In</button> */}
        </header>
        
        <div className="logo-container">
          <div className="logo-border">
            <img className="NEXT-GEN" alt="Next GEN" src={NEXTGen} />
            <img className="UNO" alt="Uno" src={UNO} />
          </div>
        </div>
        <nav className="menu">
          <button className= "menu-button" onClick={() => navigate('/uno-game')}>Play</button>
          <button className= "menu-button" onClick={toggleSettings} >Settings</button>
        </nav>

        <footer className="footer">
          <button className="icon-button">...</button>
          <img 
          className="help-icon" 
          src={tutorialCircle} 
          alt="Help tutorial circle"
          onClick={() => setShowPopup(true)}
           />
        </footer>
      </section>
      <SettingsPopup isOpen={isSettingsOpen} onClose={toggleSettings} />
      {showPopup && <MobilePopup onClose={() => setShowPopup(false)} />}
    </main>
    )

}
export default MainMenuMobile;