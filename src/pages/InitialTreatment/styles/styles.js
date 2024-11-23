import { COLORS, FONTS, SHADOWS } from "../../../constants/styles";

export const outerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  backgroundColor: COLORS.WHITE,
  padding: "1.5rem",
  boxSizing: "border-box",
};

export const containerStyle = {
  padding: "1.25rem",
  maxWidth: "90%",
  margin: "0 auto",
  fontFamily: FONTS.FAMILY,
  backgroundColor: COLORS.WHITE,
  boxShadow: SHADOWS.LARGE_BOX,
  borderRadius: "0.625rem",
  boxSizing: "border-box",
  // Media query for larger screens
  '@media (min-width: 768px)': {
    maxWidth: "500px",
  },
};

export const titleStyle = {
  color: COLORS.DARK_BLUE,
  fontSize: "clamp(1.5rem, 4vw, 2rem)",
  fontFamily: FONTS.FAMILY,
  textAlign: "center",
  marginBottom: "1rem",
};

export const descriptionStyle = {
  color: COLORS.BLACK,
  fontSize: "1rem",
  textAlign: "center",
  marginBottom: "1.5rem",
};

export const labelStyle = {
  display: "block",
  marginBottom: "0.3125rem",
  color: COLORS.DARK_BLUE,
  fontSize: "1rem",
};

export const inputStyle = {
  width: "100%",
  padding: "1rem",
  borderRadius: "0.3125rem",
  border: `1px solid ${COLORS.GREY_MAIN}`,
  fontFamily: FONTS.FAMILY,
  fontSize: "1rem",
  boxShadow: SHADOWS.SMALL_BOX,
  outline: "none",
  boxSizing: "border-box",
};

export const buttonStyle = (loading) => ({
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.3125rem",
  border: "none",
  backgroundColor: loading ? COLORS.GREY_MAIN : COLORS.BLUE_MAIN,
  color: COLORS.WHITE,
  fontFamily: FONTS.FAMILY,
  fontSize: "1rem",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "background-color 0.3s ease",
});

