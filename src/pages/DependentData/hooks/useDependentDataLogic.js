import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { decryptInfo } from "../../../utils/cryptoUtils";
import axios from "axios";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";
import { getItem } from "../../../utils/localStorageUtils";

export const useDependentDataLogic = () => {
  const [dependentName, setDependentName] = useState("");
  const [dependentAge, setDependentAge] = useState(0);
  const [dependentBloodType, setDependentBloodType] = useState("");
  const [dependentGender, setDependentGender] = useState("");
  const [dependentMedicalReport, setDependentMedicalReport] = useState("");
  const [emergPhone, setEmergPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const loadData = async () => {
      try {
        const encryptedCpfDep = getItem("encryptedCpfDep");
        const encryptedEmergPhone = getItem("encryptedEmergPhone");

        if (!encryptedCpfDep || !encryptedEmergPhone) {
          toast.error("Dados não encontrados, escaneie novamente a pulseira.");
          setIsLoading(false);
          return;
        }

        const decryptedCpf = await decryptInfo(encryptedCpfDep);
        const decryptedPhone = await decryptInfo(encryptedEmergPhone);

        if (!decryptedCpf) {
          throw new Error("Erro ao descriptografar CPF.");
        }

        setEmergPhone(
          decryptedPhone.contentResponse.decryptedUrl
            ? String(decryptedPhone.contentResponse.decryptedUrl)
            : ""
        );

        await fetchDependentData(decryptedCpf.contentResponse.decryptedUrl);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 2000)); 
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchDependentData = async (cpfDep) => {
    try {
      const authToken = getItem("authToken");

      if (!authToken) {
        throw new Error("Token JWT não encontrado. Faça login novamente.");
      }

      const response = await axios.get(`${API_DEPENDENT_FOUND_BY_ID}${cpfDep}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { nomeDep, idadeDep, tipoSanguineo, generoDep, laudo } =
        response.data.contentResponse;

      setDependentName(nomeDep);
      setDependentAge(idadeDep);
      setDependentBloodType(tipoSanguineo);
      setDependentGender(generoDep);
      setDependentMedicalReport(laudo);
    } catch (error) {
      console.error("Erro ao buscar dados do dependente:", error);
      toast.error("Erro ao realizar requisição.", {
        toastId: "fetch-error"
      });
    }
  };

  return {
    dependentName,
    dependentAge,
    dependentBloodType,
    dependentGender,
    emergPhone,
    dependentMedicalReport,
    isLoading, // Expondo o estado de carregamento
  };
};
