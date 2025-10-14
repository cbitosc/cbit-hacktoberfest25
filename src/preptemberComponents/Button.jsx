import React from 'react';
import './button.css';
import styles from './Preptember.module.css';

export default function Button({ text, style, func, disabled }) {
  return (
    <div className="relative">
      <button
        onClick={func}
        disabled={disabled}
        className={`${styles.textLink} three-d-button rounded-xs2 uppercase tracking-wider transition-all duration-150
          ${style || ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {text}
      </button>
    </div>
  );
}