import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import { COLORS, FONTS, SHADOWS } from "../constants/styles";

// Mapeia sombras para estilos
const mapShadow = (shadowType) => {
  const shadowMapping = {
    large: SHADOWS.LARGE_BOX,
    small: SHADOWS.SMALL_BOX,
  };
  return shadowMapping[shadowType] || shadowType;
};

// Mapeia tamanhos de fonte para estilos
const mapFontSize = (size) => {
  const fontSizeMapping = {
    title: FONTS.TITLE_SIZE,
    caption: FONTS.CAPTION_SIZE,
    text: FONTS.TEXT_SIZE,
    label: FONTS.LABEL_SIZE,
  };
  return fontSizeMapping[size] || size;
};

// Componente principal
function PhoneField({
  width,
  height,
  label,
  fontSize,
  shadow,
  value,
  readOnly = false,
}) {
  const [phoneValue, setPhoneValue] = useState(value || "");
  const [isValidPhone, setIsValidPhone] = useState(false);

  // Valida o telefone sempre que phoneValue mudar
  useEffect(() => {
    const regex = /^\(\d{2}\) 9 \d{4}-\d{4}$/; // Regex para formato de telefone
    setIsValidPhone(regex.test(phoneValue));
  }, [phoneValue]);

  // Manipula mudanças no campo
  const handleChange = (e) => {
    setPhoneValue(e.target.value);
  };

  // Estilos combinados para o campo
  const fieldStyles = {
    padding: "10px 20px",
    borderRadius: "5px",
    border: `1px solid ${isValidPhone ? COLORS.GREEN_MAIN : COLORS.BLUE_MAIN}`,
    transition: "box-shadow 0.3s, border 0.3s",
    margin: "0 auto",
    fontFamily: FONTS.FAMILY,
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
    width: width,
    height: height,
    boxShadow: mapShadow(shadow),
    fontSize: mapFontSize(fontSize),
  };

  const legendStyle = {
    color: COLORS.BLUE_MAIN,
    fontSize: FONTS.LABEL_SIZE,
  };

  const inputStyle = {
    width: "100%",
    margin: "0.1% 0.1% 2%",
    border: "none",
    fontSize: "17px",
    outline: 0,
    backgroundColor: COLORS.WHITE,
    fontFamily: FONTS.FAMILY,
    textAlign: "center",
    color: COLORS.BLUE_MAIN,
  };

  return (
    <fieldset style={fieldStyles}>
      <legend style={legendStyle}>{label}</legend>
      <InputMask
        mask="(99) 9 9999-9999"
        value={phoneValue}
        onChange={handleChange}
        readOnly={readOnly}
      >
        {(inputProps) => (
          <input {...inputProps} style={inputStyle} readOnly={readOnly} />
        )}
      </InputMask>
    </fieldset>
  );
}

// Definição de tipos de propriedade
PhoneField.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.node.isRequired,
  fontSize: PropTypes.oneOf(["title", "caption", "text", "label"]),
  shadow: PropTypes.oneOf(["none", "small", "large"]),
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

// Valores padrão das propriedades
PhoneField.defaultProps = {
  width: "140px",
  height: "40px",
  label: "",
  fontSize: "title",
  shadow: "none",
  value: "",
  readOnly: false,
};

export default PhoneField;