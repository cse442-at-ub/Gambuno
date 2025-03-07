import React from 'react';
import Card from './Card'
import styles from "../styles/Card.module.css";

export default function TempPath() {
    return (
        <div>
            <div className = {styles.layout}> 
                <Card color="yellow" num= "0" id = "none"/>
                <Card color="yellow" num= "1" id = "none"/>
                <Card color="yellow" num= "2"id = "none"/>
                <Card color="yellow" num= "3"id = "none"/>
                <Card color="yellow" num= "4"id = "none"/>
                <Card color="yellow" num= "5"id = "none"/>
                <Card color="yellow" num= "6"id = "none"/>
                <Card color="yellow" num= "7" id = "none"/>
                <Card color="yellow" num= "8"id = "none"/>
                <Card color="yellow" num= "9"id = "none"/>
                <Card color="yellow" num = "+2"id = "special"/>
            </div>
            
            <div className = {styles.layout}> 
                <Card color="red" num = "0"id = "none"/>
                <Card color="red" num = "1"id = "none"/>
                <Card color="red" num = "2"id = "none"/>
                <Card color="red" num = "3"id = "none"/>
                <Card color="red" num = "4"id = "none"/>
                <Card color="red" num = "5"id = "none"/>
                <Card color="red" num = "6"id = "none"/>
                <Card color="red" num = "7"id = "none"/>
                <Card color="red" num = "8"id = "none"/>
                <Card color="red" num = "9"id = "none"/>
                <Card color="red" num = "+2"id = "special"/>
            </div>
            
            <div className = {styles.layout}> 
                <Card color="#454ad9" num = "0"id = "none"/>
                <Card color="#454ad9" num = "1"id = "none"/>
                <Card color="#454ad9" num = "2"id = "none"/>
                <Card color="#454ad9" num = "3"id = "none"/>
                <Card color="#454ad9" num = "4"id = "none"/>
                <Card color="#454ad9" num = "5"id = "none"/>
                <Card color="#454ad9" num = "6"id = "none"/>
                <Card color="#454ad9" num = "7"id = "none"/>
                <Card color="#454ad9" num = "8"id = "none"/>
                <Card color="#454ad9" num = "9"id = "none"/>
                <Card color="#454ad9" num = "+2"id = "special"/>
            </div>

            <div className = {styles.layout}> 
                <Card color="green" num = "0"id = "none"/>
                <Card color="green" num = "1"id = "none"/>
                <Card color="green" num = "2"id = "none"/>
                <Card color="green" num = "3"id = "none"/>
                <Card color="green" num = "4"id = "none"/>
                <Card color="green" num = "5"id = "none"/>
                <Card color="green" num = "6"id = "none"/>
                <Card color="green" num = "7"id = "none"/>
                <Card color="green" num = "8"id = "none"/>
                <Card color="green" num = "9"id = "none"/>
                <Card color="green" num = "+2"id = "special"/>
                <Card color= "tan" num = "3" id ="none" />
            </div>
   
        </div>
    )
}