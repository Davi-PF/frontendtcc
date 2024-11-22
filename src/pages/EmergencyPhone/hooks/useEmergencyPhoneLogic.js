import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";
import { decryptData } from "../../../utils/cryptoUtils";
import axios from "axios";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";

export const useEmergencyPhoneLogic = () => {
  const { encryptedCpfDep, encryptedEmergPhone } = useSensitiveData();
  const [emergPhone, setEmergPhone] = useState("");
  const [dependentName, setDependentName] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarDadosDependente = async (cpf) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_DEPENDENT_FOUND_BY_ID}${cpf}`);
      setDependentName(response.data.contentResponse.nomeDep);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar dados, tente novamente...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!encryptedCpfDep || !encryptedEmergPhone) {
        toast.error("Dados não encontrados, escaneie novamente a pulseira.");
        return;
      }

      try {
        const decryptedCpf = await decryptData(encryptedCpfDep);
        const decryptedPhone = await decryptData(encryptedEmergPhone);

        if (decryptedCpf && decryptedPhone) {
          setEmergPhone(String(decryptedPhone));
          await buscarDadosDependente(decryptedCpf);
        } else {
          toast.error("Erro ao descriptografar os dados, tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        toast.error("Erro inesperado, tente novamente.");
      }
    };

    loadData();
  }, [encryptedCpfDep, encryptedEmergPhone]);

  return { loading, emergPhone, dependentName };
};