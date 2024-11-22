import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";
import { decryptData } from "../../../utils/cryptoUtils";

export const useDependentFullDataLogic = () => {
  const [cpfDep, setCpfDep] = useState(null); // Estado para o CPF descriptografado
  const [scanName, setScanName] = useState("");
  const [scanEmail, setScanEmail] = useState("");
  const [scanPhone, setScanPhone] = useState("");
  const [enviandoDados, setEnviandoDados] = useState(false);

  const { encryptedCpfDep } = useSensitiveData();

  useEffect(() => {
    const loadCpf = async () => {
      if (!encryptedCpfDep) {
        toast.error("CPF criptografado não encontrado. Tente novamente.");
        return;
      }

      try {
        const decryptedCpf = await decryptData(encryptedCpfDep);
        setCpfDep(decryptedCpf); // Seta o CPF descriptografado no estado
      } catch (error) {
        console.error("Erro ao descriptografar CPF:", error);
        toast.error("Erro ao descriptografar os dados. Tente novamente.");
      }
    };

    loadCpf();
  }, [encryptedCpfDep]);

  const enviarDados = async (enviarDadosHelper, navigate) => {
    setEnviandoDados(true);
    const numeroTelefone = scanPhone.replace(/\D/g, ""); // Remove caracteres não numéricos

    try {
      await enviarDadosHelper({
        cpfDep,
        scanName,
        scanEmail,
        scanPhone: numeroTelefone,
        navigate,
      });
      toast.success("Dados enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao enviar os dados. Tente novamente.");
    } finally {
      setEnviandoDados(false);
    }
  };

  return {
    cpfDep,
    scanName,
    setScanName,
    scanEmail,
    setScanEmail,
    scanPhone,
    setScanPhone,
    enviandoDados,
    enviarDados,
  };
};
