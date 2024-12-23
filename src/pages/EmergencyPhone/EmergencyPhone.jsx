import React from "react";
import { Link } from "react-router-dom";
import PhoneField from "../../components/PhoneField/PhoneField";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen"; // Componente de carregamento
import { useEmergencyPhoneLogic } from "./hooks/useEmergencyPhoneLogic"; // Custom hook
import styles from "./styles/emergencyPhoneStyles";
import emergencyCallImage from "../../images/EmergencyCall.png"

const EmergencyPhone = () => {
  const { loading, dependentName, emergPhone } = useEmergencyPhoneLogic();

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="teste" style={styles.mainContainer}>
          <p style={styles.constantText}>
            Bem-vindo a ZLO Trackband. A pessoa que você encontrou se chama{" "}
            <span style={styles.dependentName}>{dependentName}</span>, e o seu
            responsável atende pelo número abaixo.
          </p>
          <p style={styles.constantText2}>
            Por favor, informe-o pelo bem do indivíduo em questão.
          </p>

          <PhoneField
            fontSize="title"
            shadow="large"
            height="100%"
            width="80%"
            label="Número de Emergência"
            value={emergPhone}
            readOnly={true}
          />

          <a href={`tel:+55${emergPhone}`}>
            <img
              style={styles.constantImg}
              src={`${emergencyCallImage}`}
              alt="Chamada de Emergência"
            />
          </a>

          <footer style={styles.constantFooter}>
            <p style={styles.needInfo}>
              Precisa de mais informações sobre o usuário?
            </p>
            <Link to="/dependentFullData" style={styles.moreInfo}>
              Clique aqui!
            </Link>
          </footer>
        </div>
      )}
    </>
  );
};

export default EmergencyPhone;
