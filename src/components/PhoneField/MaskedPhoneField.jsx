import React from "react";
import PropTypes from "prop-types";
import { inputStyle } from "./styles/phoneFieldStyles";

const applyPhoneMask = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d)(\d{4})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }
  return value;
};

const MaskedPhoneField = ({ value, onChange, readOnly }) => {
  const handleChange = (e) => {
    const maskedValue = applyPhoneMask(e.target.value);
    onChange(maskedValue);
  };

  return (
    <input
      type="text"
      value={applyPhoneMask(value)}
      onChange={!readOnly ? handleChange : undefined}
      readOnly={readOnly}
      style={inputStyle}
    />
  );
};

MaskedPhoneField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

MaskedPhoneField.defaultProps = {
  onChange: () => {},
  readOnly: false,
};

export default MaskedPhoneField;
