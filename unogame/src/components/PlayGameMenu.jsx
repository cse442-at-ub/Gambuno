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
