import React from 'react';
import styles from '../styles/MainMenu.module.css';
import { useNavigate } from 'react-router-dom';


function MainMenu() {
    const navigate = useNavigate();

    const goToPlayPage = () => {
      navigate("/play");
    }

    const goToCard = () => {
      navigate("/card");
    
  };

  const goToLogin = () => {
    navigate("/login");
  
};

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
      <div className={styles.CreditsButton_14_7}></div><span className={styles.Credits_26_17}><button className={styles.Credits_26_17} onClick={goToCard}>Credits</button></span>
      <div className={styles.LoginButton_14_8}></div><span><button className={styles.LogIn_26_10} onClick={goToLogin}> Log In </button></span><span><button className={styles.Play_80_74} onClick={goToPlayPage}>Play</button></span><span className={styles.Settings_80_79}>Settings</span>
    </div>
  );
}

export default MainMenu;
