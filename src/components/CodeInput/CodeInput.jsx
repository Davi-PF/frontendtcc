import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./styles/CodeInputStyle";

const CodeInput = ({ length, onComplete }) => {
  const [code, setCode] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return; // Apenas números são permitidos

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Foca no próximo input automaticamente, se disponível
    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Verifica se o código está completo
    if (newCode.every((digit) => digit !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      // Apaga o valor anterior e foca no input anterior
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div style={styles.container}>
      {code.map((digit, index) => (
        <input
          key={index}
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
  length: PropTypes.number.isRequired, // Quantidade de inputs
  onComplete: PropTypes.func.isRequired, // Callback quando o código está completo
};

export default CodeInput;
