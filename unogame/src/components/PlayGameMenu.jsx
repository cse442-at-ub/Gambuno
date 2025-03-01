import React from 'react';
import styles from '../styles/PlayGameMenu.module.css';
import { useNavigate } from 'react-router-dom';

export default function PlayGameMenu() {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/");
  };

  const goToTutorial = () => {
    navigate("/tutorial");
  };

  return (
    <div className={styles.PlayGameMenu}>
      {/* Back Button */}
      <div className={styles.BackButton} onClick={goToMainPage}>
        <svg width="40" height="40" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.5 21.667L21.667 32.5M21.667 32.5L32.5 43.333M21.667 32.5H43.333M59.583 32.5C59.583 47.458 47.458 59.583 32.5 59.583C17.542 59.583 5.417 47.458 5.417 32.5C5.417 17.542 17.542 5.417 32.5 5.417C47.458 5.417 59.583 17.542 59.583 32.5Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Title */}
      <div className={styles.TitleContainer}>
        <span className={styles.SelectGameType}>Select Game Type</span>
      </div>

      {/* Buttons Container */}
      <div className={styles.ButtonContainer}>
        <div className={styles.JoinButton}>
          <span className={styles.ButtonText}>Join Game</span>
        </div>
        <div className={styles.HostButton}>
          <span className={styles.ButtonText}>Host Game</span>
        </div>
      </div>
    </div>
  );
}


function PlayGameMenu() {
  const navigate = useNavigate();

    const goToMainPage = () => {
      navigate("/");
    };

  return (
    <div className={styles.PlayGameMenu_73_9}>
      <div className={styles.HelpTutorialCircle_154_45}><svg width="65" height="66" viewBox="0 0 65 66" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.6186 24.75C25.2553 22.9121 26.5121 21.3623 28.1664 20.3751C29.8206 19.3879 31.7656 19.0271 33.6568 19.3565C35.548 19.6858 37.2633 20.6842 38.499 22.1747C39.7347 23.6652 40.411 25.5517 40.4082 27.5C40.4082 33 32.2832 35.75 32.2832 35.75M32.4998 46.75H32.5269M59.5832 33C59.5832 48.1878 47.4575 60.5 32.4998 60.5C17.5421 60.5 5.4165 48.1878 5.4165 33C5.4165 17.8122 17.5421 5.5 32.4998 5.5C47.4575 5.5 59.5832 17.8122 59.5832 33Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={styles.JoinButton_73_14}></div><span className={styles.JoinGame_283_142}>Join Game</span>
      <div className={styles.HostButton_73_27}></div>
      <div className={styles.ArrowLeftCircle_194_673}><button className = {styles.arrowbutton} onClick = {goToMainPage}></button><svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.4998 21.6667L21.6665 32.5M21.6665 32.5L32.4998 43.3333M21.6665 32.5H43.3332M59.5832 32.5C59.5832 47.4577 47.4575 59.5833 32.4998 59.5833C17.5421 59.5833 5.4165 47.4577 5.4165 32.5C5.4165 17.5423 17.5421 5.41667 32.4998 5.41667C47.4575 5.41667 59.5832 17.5423 59.5832 32.5Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div><span className={styles.HostGame_283_144}>Host Game</span><span className={styles.SelectGameType_283_146}>Select Game Type</span>
    </div>
  );
}

export default PlayGameMenu;

