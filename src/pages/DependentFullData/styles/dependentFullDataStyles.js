import { FONTS } from "../../../constants/styles";

const styles = {
  bg: {
    fontSize: FONTS.INPUT_SIZE,
    height: "85vh",
    marginTop: "15px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "2.7vh",
    fontWeight: "bold",
    marginTop: "0.2vh",
    marginBottom: "20px",
  },
  constantText: {
    textAlign: "center",
    fontSize: "2vh",
    lineHeight: 1.5,
    maxWidth: "600px",
    margin: "0 auto",
    padding: "5px",
  },
  divInputs: {
    display: "flex",
    height: "47vh",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  input: {
    fontFamily: FONTS.FAMILY,
  },
};

export default styles;
