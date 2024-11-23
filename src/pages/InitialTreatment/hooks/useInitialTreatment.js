import { useState } from "react";
import axios from "axios";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const useInitialTreatment = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Obtém a string criptografada da URL ou do localStorage
  let encryptedData = window.location.search.replace("?", "");
  if (!encryptedData) {
    encryptedData = getItem("originalEncryptedData", ""); // Busca do localStorage
  }

  setItem("originalEncryptedData", encryptedData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !phone) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      console.log("Email: " + email + " Phone:" + phone);
      const response = await axios.post(
        "http://zlo-login-microservice-env-2.eba-cm4nxyyj.us-east-1.elasticbeanstalk.com/auth/temp-user",
        { "email": email, "phoneNumber": phone },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data;
      if (token) {
        setItem("userEmail", email);
        setItem("userPhone", phone);
        setItem("authToken", token);
        toast.success("Obrigado por ajudar!");
        navigate("/loadingScreen");
      } else {
        toast.error("Erro ao obter o token. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, phone, setPhone, loading, handleSubmit };
};

export default useInitialTreatment;
