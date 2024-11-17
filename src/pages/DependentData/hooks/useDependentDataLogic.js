import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSensitiveData } from "../../../context/SensitiveDataContext";
import { decryptData } from "../../../utils/cryptoUtils";
import axios from "axios";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";

export const useDependentDataLogic = () => {
  const [dependentName, setDependentName] = useState("");
  const [dependentAge, setDependentAge] = useState(0);
  const [dependentBloodType, setDependentBloodType] = useState("");
  const [dependentGender, setDependentGender] = useState("");
  const [dependentMedicalReport, setDependentMedicalReport] = useState("");
  const [emergPhone, setEmergPhone] = useState("");

  const { encryptedCpfDep, encryptedEmergPhone } = useSensitiveData();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!encryptedCpfDep || !encryptedEmergPhone) {
          toast.error("Dados não encontrados, escaneie novamente a pulseira.");
          return;
        }

        // Descriptografa os dados
        const decryptedCpf = await decryptData(encryptedCpfDep);
        const decryptedPhone = await decryptData(encryptedEmergPhone);

        if (!decryptedCpf) {
          throw new Error("Erro ao descriptografar CPF.");
        }

        setEmergPhone(decryptedPhone ? String(decryptedPhone) : "");
        await fetchDependentData(decryptedCpf);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      }
    };

    loadData();
  }, [encryptedCpfDep, encryptedEmergPhone]);

  const fetchDependentData = async (cpfDep) => {
    try {
      const response = await axios.get(`${API_DEPENDENT_FOUND_BY_ID}${cpfDep}`);
      const { nomeDep, idadeDep, tipoSanguineo, generoDep, laudo } =
        response.data.contentResponse;

      setDependentName(nomeDep);
      setDependentAge(idadeDep);
      setDependentBloodType(tipoSanguineo);
      setDependentGender(generoDep);
      setDependentMedicalReport(laudo);
    } catch (error) {
      console.error("Erro ao buscar dados do dependente:", error);
      toast.error("Erro ao realizar requisição.");
    }
  };

  return {
    dependentName,
    dependentAge,
    dependentBloodType,
    dependentGender,
    emergPhone,
    dependentMedicalReport,
  };
};
