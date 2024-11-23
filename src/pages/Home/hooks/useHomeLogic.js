import { useCallback, useState, useEffect, useRef } from "react";
import { useFetchData } from "../../../functions/dataRelated/useFetchData/useFetchData";
import { decryptData, encryptInfo } from "../../../utils/cryptoUtils";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useHomeLogic() {
  const navigate = useNavigate();
  const { loading, fetchData: originalFetchData } = useFetchData();

  const [encryptedCpfDep, setEncryptedCpfDep] = useState("");
  const [encryptedEmergPhone, setEncryptedEmergPhone] = useState("");
  const hasProcessedData = useRef(false); // Flag para controlar execução única

  // Verifica token JWT na inicialização
  useEffect(() => {
    const authToken = getItem("authToken");
    if (!authToken) {
      console.warn("Token JWT ausente. Redirecionando para login.");
      navigate("/");
    }
  }, [navigate]);

  // Carrega os dados do localStorage e processa descriptografia
  useEffect(() => {
    const processDecryption = async () => {
      // Impede execução múltipla
      if (hasProcessedData.current) return;
      hasProcessedData.current = true;

      const encryptedData = getItem("originalEncryptedData");

      if (!encryptedData) {
        toast.error("Nenhum dado encontrado. Por favor, tente novamente.", {
          toastId: "missing-data",
        });
        return;
      }

      try {
        // Descriptografa a URL
        const decryptedString = await decryptData(encryptedData);
        if (!decryptedString) {
          toast.error("Erro ao descriptografar os dados, tente novamente.", {
            toastId: "decrypt-error",
          });
          return;
        }

        // Processa a URL descriptografada
        let decryptedUrl = decryptedString.contentResponse.decryptedUrl.replace(
          /"/g,
          ""
        );

        const [cpfDepPart, emergPhonePart] = decryptedUrl.split("&");
        const cpfDep = cpfDepPart.split("=")[1];
        const emergPhone = emergPhonePart.split("=")[1];

        // Criptografa os dados apenas se ainda não estiverem criptografados
        const alreadyEncryptedCpf = getItem("encryptedCpfDep");
        const alreadyEncryptedPhone = getItem("encryptedEmergPhone");

        if (!alreadyEncryptedCpf && !alreadyEncryptedPhone) {
          const encryptedCpf = await encryptInfo(cpfDep);
          const encryptedPhone = await encryptInfo(emergPhone);

          if (encryptedCpf && encryptedPhone) {
            setItem("encryptedCpfDep", encryptedCpf.contentResponse.encryptedUrl);
            setItem(
              "encryptedEmergPhone",
              encryptedPhone.contentResponse.encryptedUrl
            );
            setEncryptedCpfDep(encryptedCpf.contentResponse.encryptedUrl);
            setEncryptedEmergPhone(encryptedPhone.contentResponse.encryptedUrl);
            toast.success("Dados processados com sucesso!");
          } else {
            toast.error("Erro ao criptografar os dados, tente novamente.", {
              toastId: "encrypt-error",
            });
          }
        } else {
          setEncryptedCpfDep(alreadyEncryptedCpf);
          setEncryptedEmergPhone(alreadyEncryptedPhone);
        }
      } catch (error) {
        console.error("Erro no processo de descriptografia/recriptografia:", error);
        toast.error("Erro ao processar os dados, tente novamente.", {
          toastId: "process-error",
        });
      }
    };

    processDecryption();
  }, []); // Sem dependências para garantir que execute apenas na montagem

  const fetchData = useCallback(() => {
    originalFetchData();
  }, [originalFetchData]);

  return { loading, encryptedCpfDep, encryptedEmergPhone, fetchData };
}
