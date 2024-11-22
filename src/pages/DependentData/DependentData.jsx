import { useDependentDataLogic } from "./hooks/useDependentDataLogic"; // Custom hook
import Input from "../../components/Input/Input";
import PhoneField from "../../components/PhoneField/PhoneField";
import styles from "./styles/dependentDataStyles"; // Estilos organizados

const DependentData = () => {
  const {
    dependentName,
    dependentAge,
    dependentBloodType,
    dependentGender,
    emergPhone,
    dependentMedicalReport,
  } = useDependentDataLogic();

  return (
    <div style={styles.bg}>
      <h1 style={styles.userName}>Nome do usuário</h1>
      <h2 style={styles.title}>{dependentName}</h2>
      <div style={styles.divInputs}>
        <Input
          isEmail={false}
          isStatic={true}
          textContent={dependentAge}
          fieldLabel="Idade"
        />
        <Input
          isEmail={false}
          isStatic={true}
          textContent={dependentBloodType}
          fieldLabel="Tipo sanguíneo"
        />
        <Input
          isEmail={false}
          isStatic={true}
          textContent={dependentGender}
          fieldLabel="Gênero"
        />
        {emergPhone && (
          <PhoneField
            fontSize="title"
            shadow="large"
            height="60px"
            width="70%"
            label="Número do Responsável"
            value={emergPhone}
            readOnly={true}
          />
        )}
        {dependentMedicalReport && (
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
