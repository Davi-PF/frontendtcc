import { useNavigate } from "react-router-dom";
import GiphyEmbed from "../../components/GiphyEmbed/GiphyEmbed";
import CodeInput from "../../components/CodeInput/CodeInput";
import Button from "../../components/Button/Button";
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
            if (!smsValue || smsValue.length <= 6) {
              toast.error(
                "O código deve ter exatamente 6. Verifique e tente novamente.",
                {
                  toastId: "sms-missing-pattern",
                  autoClose: 2000,
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
            <button style={styles.span} onClick={handleResend}>
              clicando aqui!
            </button>
          </p>
      </div>
    </div>
  );
};

export default SmsHandler;
