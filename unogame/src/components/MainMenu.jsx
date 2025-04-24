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


function MainMenu() {
  const navigate = useNavigate();

  const goToPlayPage = () => {
    navigate("/select-game");

  }

  const goToLeaderboard = () => {
    navigate("/leaderboard");

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

const [isTutOpen, setIsTutOpen] = useState(false)


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


  return (
    <div className={styles.MainMenu_1_2}>
      <div className={styles.Ellipse_2_76_55}></div><span className={styles.NextGen_14_4}>NEXT GEN </span><span className={styles.Uno_76_50}>UNO </span>
      <div className={styles.Button_76_52}><svg width="220" height="100" viewBox="0 0 356 124" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_76_52)">
            <rect width="355.27" height="124" rx="60" fill="#F42C04" fillOpacity="0.95" />
            <rect x="2.5" y="2.5" width="350.27" height="119" rx="57.5" stroke="#FFB30F" stroke-opacity="0.5" strokeWidth="5" />
          </g>
          <defs>
            <filter id="filter0_d_76_52" x="-4" y="0" width="363.27" height="132" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.46 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_76_52" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_76_52" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <div className={styles.PlayButton_80_77}><svg width="220" height="100" viewBox="0 0 356 124" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_80_77)">
            <rect width="355.27" height="124" rx="60" fill="#F42C04" fillOpacity="0.95" />
            <rect x="2.5" y="2.5" width="350.27" height="119" rx="57.5" stroke="#FFB30F" stroke-opacity="0.5" strokeWidth="5" />
          </g>
          <defs>
            <filter id="filter0_d_80_77" x="-4" y="0" width="363.27" height="132" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.46 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_80_77" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_80_77" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      
      <div className={styles.HelpTutorialCircle_154_45} onClick={()=> setIsTutOpen(true)}><svg width="40" height="40" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.6186 24.75C25.2553 22.9121 26.5121 21.3623 28.1664 20.3751C29.8206 19.3879 31.7656 19.0271 33.6568 19.3565C35.548 19.6858 37.2633 20.6842 38.499 22.1747C39.7347 23.6652 40.411 25.5517 40.4082 27.5C40.4082 33 32.2832 35.75 32.2832 35.75M32.4998 46.75H32.5269M59.5832 33C59.5832 48.1878 47.4575 60.5 32.4998 60.5C17.5421 60.5 5.4165 48.1878 5.4165 33C5.4165 17.8122 17.5421 5.5 32.4998 5.5C47.4575 5.5 59.5832 17.8122 59.5832 33Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>


      
      <div className={styles.LoginButton_14_8}>
        </div><span>
        {username ? (
          <>
            <span className={`${styles.username_display} ${styles.LogIn_26_10}`}>{username}</span>
            <span className={styles.money_display}>
              ${!isLoading ? money : 'Loading...'}
            </span>
          </>
        ) : (
          <button className={styles.LogIn_26_10} onClick={goToLogin}> Log In </button>
        )}
          {/* <button className={styles.LogIn_26_10} onClick={goToLogin}> Log In </button> */}
          </span><span><button className={styles.Play_80_74} onClick={goToPlayPage}>Play</button></span><span className={styles.Settings_80_79} onClick={toggleSettings}>Settings</span>

      <Tutorial isOpen ={isTutOpen} onClose={()=> setIsTutOpen(false)}/>
      <div className={styles.CreditsButton_14_7}></div><span className={styles.Credits_26_17}><button className={styles.Credits_26_17} onClick={goToLeaderboard}>Leaderboard</button></span>
    
      <SettingsPopup isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  );
}

export default MainMenu;
