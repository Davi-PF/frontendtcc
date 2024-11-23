import { COLORS, FONTS, SHADOWS } from "../../../constants/styles";

export const containerStyle = {
  padding: "20px",
  maxWidth: "500px",
  margin: "0 auto",
  fontFamily: FONTS.FAMILY,
  backgroundColor: COLORS.WHITE,
  boxShadow: SHADOWS.LARGE_BOX,
  borderRadius: "10px",
};

export const titleStyle = {
  color: COLORS.DARK_BLUE,
  fontSize: "18px",
  fontFamily: FONTS.FAMILY,
  textAlign: "center",
  paddingTop: "7vh",
  marginBottom: "15px",
};

export const descriptionStyle = {
  color: COLORS.BLACK,
  fontSize: FONTS.TITLE_SIZE,
  textAlign: "center",
  marginBottom: "20px",
};

export const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: COLORS.DARK_BLUE,
  fontSize: FONTS.LABEL_SIZE,
};

export const inputStyle = {
  width: "100%",
  padding: "1.5vh 0vh 1.5vh 0.35vh",
  borderRadius: "5px",
  border: `1px solid ${COLORS.GREY_MAIN}`,
  fontFamily: FONTS.FAMILY,
  fontSize: FONTS.INPUT_SIZE,
  boxShadow: SHADOWS.SMALL_BOX,
  outline: "none",
};

export const buttonStyle = (loading) => ({
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: loading ? COLORS.GREY_MAIN : COLORS.BLUE_MAIN,
  color: COLORS.WHITE,
  fontFamily: FONTS.FAMILY,
  fontSize: FONTS.BUTTON_SIZE,
  cursor: loading ? "not-allowed" : "pointer",
  transition: "background-color 0.3s ease",
});
