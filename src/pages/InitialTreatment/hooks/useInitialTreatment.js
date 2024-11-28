import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { decryptInfo} from "../../../utils/cryptoUtils"
import { API_FIND_BY_TELEFONE, API_SEND_NOTIFICATION_RESPONSIBLE, API_FIND_NOME_DEP } from "../../../constants/apiEndpoints";

const useInitialTreatment = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notificationSentRef = useRef(false);

  // Obtém a string criptografada da URL ou do localStorage
  let encryptedData = window.location.search.replace("?", "");
  if (!encryptedData) {
    encryptedData = getItem("originalEncryptedData", "");
  }

  setItem("originalEncryptedData", encryptedData);

  useEffect(() => {
    if (!notificationSentRef.current) {
      sendNotification(encryptedData);
      notificationSentRef.current = true;
    }
  }, [encryptedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !phone) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://zlo-login-microservice-env-2.eba-cm4nxyyj.us-east-1.elasticbeanstalk.com/auth/temp-user",
        { email: email, phoneNumber: phone },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data;
      if (token) {
        setItem("userEmail", email);
        setItem("userPhone", phone);
        setItem("authToken", token);
        toast.success("Obrigado por ajudar!");
        console.log("Chamando navegação"); // 👈 Adicionado para verificar
        navigate("/loadingScreen", { replace: true });
      } else {
        toast.error("Erro ao obter o token. Tente novamente.", {
          toastId: "failed-to-get-token",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao conectar ao servidor. Tente novamente.", {
        toastId: "failed-to-connect-server",
      });
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, phone, setPhone, loading, handleSubmit };
};

const sendNotification = async (encryptedData) => {
  let decodedEncryptedData = decodeURIComponent(encryptedData);

  if (!decodedEncryptedData) {
    toast.error("Nenhum dado encontrado. Por favor, tente novamente.", {
      toastId: "missing-data",
    });
    return;
  }

  // Verifica se o formato esperado é válido
  if (!decodedEncryptedData.includes("&") || !decodedEncryptedData.includes("=")) {
    toast.error("Dados criptografados inválidos.", {
      toastId: "invalid-data",
    });
    return;
  }

  const [cpfDepPart, emergPhonePart] = decodedEncryptedData.split("&");
  const encryptedCpfDep = cpfDepPart.split("=")[1];
  const encryptedEmergPhone = emergPhonePart.split("=")[1];

  let decryptedEmergPhone = await decryptInfo(encryptedEmergPhone)
  decryptedEmergPhone = decryptedEmergPhone.contentResponse.decryptedUrl

  const getResCpf = await axios.get(`${API_FIND_BY_TELEFONE}${decryptedEmergPhone}`, { headers: { 'Content-Type': 'application/json'}});

  let cpf_responsavel = getResCpf.data.contentResponse.cpfRes;

  let decryptedCpfDep = await decryptInfo(encryptedCpfDep);

  decryptedCpfDep = decryptedCpfDep.contentResponse.decryptedUrl;

  let getDepNome = await axios.get(`${API_FIND_NOME_DEP}${decryptedCpfDep}`, { headers: { 'Content-Type': 'application/json' } })

  getDepNome = getDepNome.data.contentResponse.nomeDep

  let notification_model = {
    "title": "ZLO Trackband",
    "body": `A pulseira do seu dependente ${getDepNome?.nomeDep} foi escaneada.`,
    "cpfResponsavel": cpf_responsavel,
    "cpfDependente": decryptedCpfDep
  }

  await axios.post(`${API_SEND_NOTIFICATION_RESPONSIBLE}`, notification_model, { headers: { 'Content-Type': 'application/json'}})

};

export default useInitialTreatment;
