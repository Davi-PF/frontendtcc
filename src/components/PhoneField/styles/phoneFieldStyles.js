import { COLORS, FONTS } from "../../../constants/styles";

export const getFieldStyles = (isValidPhone, width, height, shadow, fontSize) => ({
  padding: "10px 20px",
  borderRadius: "5px",
  border: `1px solid ${isValidPhone ? COLORS.GREEN_MAIN : COLORS.BLUE_MAIN}`,
  transition: "box-shadow 0.3s, border 0.3s",
  margin: "0 auto",
  fontFamily: FONTS.FAMILY,
  color: COLORS.BLACK,
  backgroundColor: COLORS.WHITE,
  width,
  height,
  boxShadow: shadow,
  fontSize,
});

export const legendStyle = {
  color: COLORS.BLUE_MAIN,
  fontSize: FONTS.LABEL_SIZE,
};

export const inputStyle = {
  width: "100%",
  margin: "0.1% 0.1% 1%",
  border: "none",
  fontSize: "17px",
  outline: 0,
  backgroundColor: COLORS.WHITE,
  fontFamily: FONTS.FAMILY,
  textAlign: "center",
  color: COLORS.BLUE_MAIN,
};
