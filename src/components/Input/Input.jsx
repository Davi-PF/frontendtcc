import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { validateEmail, handlePhoneMask } from "./inputUtils";
import { baseStyle, baseStyleLegend } from "./inputStyles";
import InputField from "./InputField";

function Input({
  isEmail = false,
  fieldLabel = "Label",
  isStatic = false,
  textContent = "",
  isSms = false,
  mask = null,
  value,
  onChange,
  smsVerifyFunction,
}) {
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [widthIsSms, setWidthIsSms] = useState("100%");

  useEffect(() => {
    setWidthIsSms(isSms ? "60%" : "100%");
  }, [isSms]);

  // Function to determine the color of the border
  const getBorderColor = (isValidEmail) => {
    if (isValidEmail === true) return "green";
    if (isValidEmail === false) return "red";
    return "blue";
  };

  const borderColor = getBorderColor(isValidEmail);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (mask === "phone") newValue = handlePhoneMask(newValue);
    if (isEmail) setIsValidEmail(validateEmail(newValue));
    onChange?.(newValue);
  };

  const handleSmsKeyUp = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        toast.error("Digite o código enviado por SMS.");
      } else if (e.target.value.length >= 7 && e.target.value.length <= 8) {
        smsVerifyFunction(e.target.value);
      } else {
        toast.error("Código deve ter entre 7 e 8 dígitos.");
      }
    }
  };

  // Apply phone mask to textContent when isStatic is true
  let displayedText = textContent;
  if (isStatic && mask === "phone") {
    displayedText = handlePhoneMask(textContent);
  }

  return (
    <fieldset style={baseStyle(borderColor, widthIsSms)}>
      <legend style={baseStyleLegend}>{fieldLabel}</legend>
      {isStatic ? (
        <InputField value={displayedText} disabled />
      ) : (
        <InputField
          type={isSms ? "number" : "text"}
          value={value}
          onChange={handleChange}
          onKeyUp={isSms ? handleSmsKeyUp : undefined}
        />
      )}
    </fieldset>
  );
}

Input.propTypes = {
  isEmail: PropTypes.bool,
  fieldLabel: PropTypes.string,
  isStatic: PropTypes.bool,
  textContent: PropTypes.string,
  isSms: PropTypes.bool,
  mask: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  smsVerifyFunction: PropTypes.func,
};

export default Input;
