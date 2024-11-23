import React from "react";
import { useDependentDataLogic } from "./hooks/useDependentDataLogic";
import Input from "../../components/Input/Input";
import PhoneField from "../../components/PhoneField/PhoneField";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder/LoadingPlaceholder"; // Importa o componente de loading
import styles from "./styles/dependentDataStyles";

const DependentData = () => {
  const {
    dependentName,
    dependentAge,
    dependentBloodType,
    dependentGender,
    emergPhone,
    dependentMedicalReport,
    isLoading, // Estado de carregamento
  } = useDependentDataLogic();

  return (
    <div style={styles.bg}>
      <h1 style={styles.userName}>Nome do usuário</h1>
      <h2 style={styles.title}>
        {isLoading ? <LoadingPlaceholder /> : dependentName}
      </h2>
      <div style={styles.divInputs}>
        <Input
          isEmail={false}
          isStatic={true}
          textContent={isLoading ? "Carregando..." : dependentAge} // Texto simples
          fieldLabel="Idade"
        />
        <Input
          isEmail={false}
          isStatic={true}
          textContent={isLoading ? "Carregando..." : dependentBloodType} // Texto simples
          fieldLabel="Tipo sanguíneo"
        />
        <Input
          isEmail={false}
          isStatic={true}
          textContent={isLoading ? "Carregando..." : dependentGender} // Texto simples
          fieldLabel="Gênero"
        />
        {isLoading ? (
          <LoadingPlaceholder />
        ) : (
          emergPhone && (
            <PhoneField
              fontSize="title"
              shadow="large"
              height="60px"
              width="100%"
              label="Número do Responsável"
              value={emergPhone}
              readOnly={true}
            />
          )
        )}
        {!isLoading && dependentMedicalReport && (
          <a
            style={styles.downloadLink}
            href={dependentMedicalReport}
            download={dependentMedicalReport}
          >
            Clique para baixar laudo médico do usuário.
          </a>
        )}
      </div>
    </div>
  );
};

export default DependentData;
