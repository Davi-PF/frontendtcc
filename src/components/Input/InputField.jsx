import React from "react";
import PropTypes from "prop-types";
import { inputStyles } from "./inputStyles";

function InputField({
    type = "text",
    value,
    onChange,
    onBlur,
    onKeyUp,
    isSms,
    disabled,
    styleOverrides = {},
}) {
    const style = isSms ? inputStyles.sms : inputStyles.default;

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            disabled={disabled}
            style={{ ...style, ...styleOverrides }}
        />
    );
}

InputField.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyUp: PropTypes.func,
    isSms: PropTypes.bool,
    disabled: PropTypes.bool,
    styleOverrides: PropTypes.object,
};

export default InputField;
