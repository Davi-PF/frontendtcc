import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";
import axios from "axios";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";
import { useNavigate } from "react-router-dom";

export const useEmergencyPhoneLogic = () => {
  const [emergPhone, setEmergPhone] = useState("");
  const [dependentName, setDependentName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const buscarDadosDependente = useCallback(
    async (cpf) => {
      const authToken = getItem("authToken");

      if (!authToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        return navigate("/");
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_DEPENDENT_FOUND_BY_ID}${cpf}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDependentName(response.data.contentResponse.nomeDep);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados, tente novamente...");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const loadData = async () => {
      const encryptedCpfDep = getItem("encryptedCpfDep");
      const encryptedEmergPhone = getItem("encryptedEmergPhone");

      if (!encryptedCpfDep || !encryptedEmergPhone) {
        toast.error("Dados não encontrados, escaneie novamente a pulseira.");
        return;
      }

      try {
        const decryptedCpf = await decryptInfo(encryptedCpfDep);
        const decryptedPhone = await decryptInfo(encryptedEmergPhone);

        if (decryptedCpf && decryptedPhone) {
          setEmergPhone(decryptedPhone.contentResponse.decryptedUrl);
          await buscarDadosDependente(
            decryptedCpf.contentResponse.decryptedUrl
          );
          console.log(
            "Teste: ",
            decryptedCpf.contentResponse.decryptedUrl
          );
        } else {
          toast.error(
            "Erro ao descriptografar os dados, tente novamente."
          );
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        toast.error("Erro inesperado, tente novamente.");
      }
    };

    loadData();
  }, [buscarDadosDependente]);

  return { loading, emergPhone, dependentName };
};
