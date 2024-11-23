import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles/CodeInputStyle";

const CodeInput = ({ length, onComplete }) => {
  const [code, setCode] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);
  const keys = useRef([...Array(length)].map(() => uuidv4()));

  const handleChange = (value, index) => {
    if (isNaN(value)) return; // Only numbers are allowed

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div style={styles.container}>
      {code.map((digit, index) => (
        <input
          key={keys.current[index]}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          style={styles.input}
        />
      ))}
    </div>
  );
};

CodeInput.propTypes = {
  length: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default CodeInput;
