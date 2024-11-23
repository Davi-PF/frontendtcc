import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MaskedInput from "./MaskedPhoneField";
import { mapShadow, mapFontSize, validatePhone } from "../../utils/phoneFieldUtils";
import { getFieldStyles, legendStyle } from "../PhoneField/styles/phoneFieldStyles";

const PhoneField = ({
  width = "140px",
  height = "40px",
  label = "",
  fontSize = "title",
  shadow = "none",
  value = "",
  readOnly = false,
}) => {
  const [phoneValue, setPhoneValue] = useState(value);
  const [isValidPhone, setIsValidPhone] = useState(false);

  useEffect(() => {
    setPhoneValue(value);
    setIsValidPhone(validatePhone(value));
  }, [value]);

  const handleChange = (e) => {
    setPhoneValue(e.target.value);
    setIsValidPhone(validatePhone(e.target.value));
  };

  const fieldStyles = getFieldStyles(
    isValidPhone,
    width,
    height,
    mapShadow(shadow),
    mapFontSize(fontSize)
  );

  return (
    <fieldset style={fieldStyles}>
      <legend style={legendStyle}>{label}</legend>
      <MaskedInput
        value={phoneValue}
        onChange={!readOnly ? handleChange : undefined}
        readOnly={readOnly}
      />
    </fieldset>
  );
};

PhoneField.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.node,
  fontSize: PropTypes.oneOf(["title", "caption", "text", "label"]),
  shadow: PropTypes.oneOf(["none", "small", "large"]),
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default PhoneField;
