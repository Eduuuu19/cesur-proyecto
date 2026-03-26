import React from "react";
import styles from "./Button.module.css";

export default function Button({ text, type, onClick}) {

  return (
    <button type={type} onClick={onClick} className={styles.primaryButton}>
      {text}
    </button>
  );
}