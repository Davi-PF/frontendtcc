import { COLORS, FONTS } from "../../../constants/styles";

const styles = {
  bg: {
    fontSize: FONTS.TITLE_SIZE,
    height: "85vh",
    padding: "20px",
  },
  userName: {
    margin: "4vw 0 1vw",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    margin: "1vw 0vw 2vh 0vw",
    fontSize: "22px",
    color: COLORS.BLUE_MAIN,
    textAlign: "center",
  },
  divInputs: {
    display: "flex",
    height: "50vh",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downloadLink: {
    fontSize: FONTS.BUTTON_SIZE,
    color: COLORS.DARK_BLUE,
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "20px",
  },
};

export default styles;
