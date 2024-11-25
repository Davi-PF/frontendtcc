import { COLORS, FONTS, SHADOWS } from "../../constants/styles";

export const baseStyle = (borderColor, width) => ({
    width: width,
    maxWidth: "36vh",
    borderRadius: "5px",
    border: `1px solid ${borderColor}`,
    boxShadow: SHADOWS.LARGE_BOX,
    fontFamily: FONTS.FAMILY,
    fontSize: FONTS.INPUT_SIZE,
    transition: "box-shadow 0.3s, border 0.3s",
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
    marginTop: "1vh",
});

export const baseStyleLegend = {
    color: COLORS.BLUE_MAIN,
    margin: "0.003vh",
    fontSize: "2vh"
};

export const inputStyles = {
    default: {
        width: "100%",
        outline: 0,
        border: "none",
        fontFamily: FONTS.FAMILY,
        fontSize: "2vh",
        textAlign: "center",
        margin: "auto"
    },
    sms: {
        width: "100%",
        margin: "0.1% 0.1% 1%",
        fontSize: "24px",
        outline: 0,
        border: "none",
        textAlign: "center",
    },
};
