import { useEffect, useRef } from "react";
import { decryptData, encryptData } from "../../../utils/cryptoUtils";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";

// Função para descriptografar a URL original
const processDecryptedData = async (encryptedData) => {
  try {
    const decryptedString = await decryptData(encryptedData);

    if (!decryptedString) {
      toast.error("Erro ao descriptografar os dados, tente novamente.", {
        toastId: "decrypt-error",
      });
      return null;
    }

    // Remove aspas extras e separa os dados descriptografados
    const decryptedUrl = decryptedString.contentResponse.decryptedUrl.replace(
      /"/g,
      ""
    );

    const [cpfDepPart, emergPhonePart] = decryptedUrl.split("&");
    const cpfDep = cpfDepPart.split("=")[1];
    const emergPhone = emergPhonePart.split("=")[1];

    if (cpfDep && emergPhone) {
      return { cpfDep, emergPhone };
    } else {
      toast.error("Dados inválidos, tente novamente.", {
        toastId: "invalid-data",
      });
      return null;
    }
  } catch (error) {
    console.error("Erro ao descriptografar dados:", error);
    toast.error("Erro ao processar os dados, tente novamente.", {
      toastId: "process-error",
    });
    return null;
  }
};

// Função para criptografar os dados de CPF e Telefone
const processEncryption = async (cpfDep, emergPhone) => {
  try {
    const alreadyEncryptedCpf = getItem("encryptedCpfDep");
    const alreadyEncryptedPhone = getItem("encryptedEmergPhone");

    // Verifica se os dados já estão criptografados
    if (alreadyEncryptedCpf || alreadyEncryptedPhone) {
      toast.info("Dados já estão criptografados no localStorage.");
      return false;
    }

    // Criptografa os dados
    const encryptedCpf = await encryptData(cpfDep);
    const encryptedPhone = await encryptData(emergPhone);

    if (encryptedCpf && encryptedPhone) {
      // Armazena os valores criptografados no localStorage
      setItem("encryptedCpfDep", encryptedCpf.contentResponse.encryptedUrl);
      setItem("encryptedEmergPhone", encryptedPhone.contentResponse.encryptedUrl);
      toast.success("Dados processados com sucesso!");
      return true;
    } else {
      toast.error("Erro ao criptografar os dados, tente novamente.", {
        toastId: "encrypt-error",
      });
      return false;
    }
  } catch (error) {
    console.error("Erro ao criptografar os dados:", error);
    toast.error("Erro ao processar os dados, tente novamente.", {
      toastId: "encrypt-process-error",
    });
    return false;
  }
};

// Hook principal
export const useDecryptData = () => {
  const isMounted = useRef(false); // Garante que o hook seja executado uma vez

  useEffect(() => {
    if (isMounted.current) return; // Evita execução múltipla
    isMounted.current = true;

    const decryptAndEncryptData = async () => {
      const encryptedData = getItem("originalEncryptedData");

      if (!encryptedData) {
        toast.error("Nenhum dado encontrado. Por favor, tente novamente.", {
          toastId: "missing-data",
        });
        return;
      }

      // Processa a descriptografia
      const decryptedData = await processDecryptedData(encryptedData);

      if (decryptedData) {
        const { cpfDep, emergPhone } = decryptedData;

        // Processa a criptografia dos dados
        await processEncryption(cpfDep, emergPhone);
      }
    };

    decryptAndEncryptData();
  }, []);
};
