import { COLORS, FONTS } from "../../../constants/styles";

const styles = {
  mainContainer: {
    paddingTop: "3rem",
    paddingBottom: "2rem",
  },

  container: {
    position: "relative",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.GREY_MAIN,
  },
  content: {
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    marginBottom: "60px",
  },
  constantText: {
    lineHeight: 1.5,
    margin: "20px 0",
    
    fontSize: "1rem",
    fontFamily: FONTS.FAMILY,
    color: COLORS.BLACK,
  },
  constantText2: {
    lineHeight: 1.5,
    margin: "20px 0",
    paddingTop: "1rem",
    paddingBottom: "2rem",
    fontSize: "1rem",
    fontFamily: FONTS.FAMILY,
    color: COLORS.BLACK,
  },
  dependentName: {
    color: COLORS.BLUE_MAIN,
    fontSize: "1rem",
    fontWeight: "500",
  },
  constantImg: {
    marginTop: "30px",
    width: "100px",
    height: "auto",
    cursor: "pointer",
  },
  constantFooter: {
    textAlign: "center",
    position: "absolute",
    bottom: "25px",
    width: "100%",
    fontSize: "0.875rem",
    color: COLORS.BLACK,
  },
  moreInfo: {
    textDecoration: "none",
    color: COLORS.LIGHT_BLUE,
    fontWeight: "500",
    display: "block",
    marginTop: "5px",
    fontSize: "1rem"
  },
  needInfo: {
    margin: "0px",
    fontSize: "1rem",
  },
  // Media Queries para responsividade
  "@media (max-width: 768px)": {
    container: {
      padding: "10px",
    },
    constantText: {
      fontSize: "0.9rem",
    },
    dependentName: {
      fontSize: "1rem",
    },
    constantImg: {
      width: "80px",
    },
    constantFooter: {
      fontSize: "0.8rem",
    },
  },
};

export default styles;
