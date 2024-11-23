import { COLORS, FONTS } from "../../../constants/styles";

const styles = {
  bg: {
    fontSize: FONTS.BUTTON_SIZE,
    height: "85vh",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    margin: "0vh 2vw 2vh 2vw",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: "1.2rem", // Unidade relativa para ser responsivo
  },
  subtitle: {
    margin: "2vh 2vw",
    textAlign: "center",
    fontSize: "1rem",
    lineHeight: "1.5em",
  },
  divInputs: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "15px", // Espaçamento consistente entre elementos
    width: "100%", // Para inputs ocuparem o espaço disponível
    maxWidth: "400px", // Máximo para manter um layout agradável em telas maiores
    marginTop: "10px",
  },
  button: {
    width: "100%", // Botão ocupa todo o espaço do container
    maxWidth: "300px", // Limita o tamanho em telas maiores
    fontSize: "1rem",
  },
  paragraph: {
    fontSize: "0.9rem", // Um pouco menor para dispositivos móveis
    textAlign: "center",
    marginTop: "15px",
    lineHeight: "1.4em",
  },
  span: {
    color: COLORS.BLUE_MAIN,
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
    width: "100%",
  },
  input: {
    width: "45px",
    height: "45px",
    fontSize: "1.2rem",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s ease",
  },
  giphyEmbed: {
    marginBottom: "20px", // Adiciona espaço entre o GIF e os textos
    width: "150px",
    height: "150px",
  },
  "@media (max-width: 768px)": {
    bg: {
      padding: "5px",
    },
    title: {
      fontSize: "1rem",
    },
    subtitle: {
      fontSize: "0.9rem",
    },
    divInputs: {
      gap: "10px",
      maxWidth: "90%", // Inputs ocupam quase toda a largura da tela
    },
    button: {
      maxWidth: "250px", // Botão um pouco menor
    },
    input: {
      width: "40px",
      height: "40px",
      fontSize: "1rem",
    },
    giphyEmbed: {
      width: "120px",
      height: "120px",
    },
  }
};


export default styles;
