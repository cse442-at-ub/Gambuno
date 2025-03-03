import React from 'react';
import styles from '../styles/Card.module.css';

export default function Card({ color , num, id}) {
  if (`${id}` === "special"){ 
  return (
    <div className={styles.cardDesign} style={{background: `${color}`}} >
      <span className={styles.upperSpec}>{num}</span>
      <span className={styles.centerSpec}>{num}</span>
      <span className={styles.lowerSpec}>{num}</span>
    </div>
  );
  }
  if (`${id}` === "none"){ 
    return (
      <div className={styles.cardDesign} style={{background: `${color}`}} >
        <span className={styles.upper}>{num}</span>
        <span className={styles.center}>{num}</span>
        <span className={styles.lower}>{num}</span>
      </div>
    );
    }
}