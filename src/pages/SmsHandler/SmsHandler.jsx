  import { useNavigate } from "react-router-dom";
  import GiphyEmbed from "../../components/GiphyEmbed";
  import CodeInput from "../../components/CodeInput/CodeInput";
  import Button from "../../components/Button";
  import { toast } from "react-toastify";
  import { useSmsHandlerLogic } from "./hooks/useSmsHandlerLogic"; // Custom hook
  import styles from "./styles/smsHandlerStyles"; // Estilos organizados

  const SmsHandler = () => {
    const navigate = useNavigate();
    const { smsValue, smsVerifyFunction, handleResend } =
      useSmsHandlerLogic(navigate);

    return (
      <div style={styles.bg}>
        <GiphyEmbed
          src="https://giphy.com/embed/2wWBH0vXsVUmKtRJOe"
          width="200"
          height="200"
        />
        <h1 style={styles.title}>Código enviado!</h1>
        <h2 style={styles.subtitle}>
          Um código foi enviado ao seu celular. Insira ele no campo abaixo para
          prosseguir.
        </h2>
        <div style={styles.divInputs}>
        <CodeInput
            length={6} // Número de dígitos do código
            onComplete={(code) => smsVerifyFunction(code)} // Chama a função ao finalizar o código
          />
          <Button
            onClick={() => {
              if (!smsValue || smsValue.length < 7 || smsValue.length > 8) {
                toast.error(
                  "O código deve ter exatamente 7 ou 8 números. Verifique e tente novamente.",
                  {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                  }
                );
                return;
              }
              smsVerifyFunction(smsValue);
            }}
          >
            Confirmar
          </Button>
          <p style={styles.paragraph}>
            Não recebeu? Reenvie o código{" "}
            <span style={styles.span} onClick={handleResend}>
              clicando aqui!
            </span>
          </p>
        </div>
      </div>
    );
  };

  export default SmsHandler;