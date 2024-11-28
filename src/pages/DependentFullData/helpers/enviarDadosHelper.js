import axios from "axios";
import { toast } from "react-toastify";
import { API_SMS_SCANHISTORY } from "../../../constants/apiEndpoints";

export const enviarDadosHelper = async ({
  depCpf,
  scanName,
  scanEmail,
  scanPhone,
  navigate,
}) => {
  const enviarComLocalizacao = async (latitude, longitude) => {
    const dadosParaEnviar = {
      depCpf,
      scanName,
      scanEmail,
      scanPhone,
      latitude,
      longitude,
    };

    try {
      const response = await axios.post(
        `${API_SMS_SCANHISTORY}`,
        dadosParaEnviar
      );
      localStorage.setItem("scanPhone", response.data.scanPhone);
      toast.success("Dados enviados com sucesso!");
      navigate("/smsHandler");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao enviar os dados, tente novamente.");
    }
  };

  // Return a promise that resolves when geolocation and data sending are complete
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await enviarComLocalizacao(latitude, longitude);
        resolve(); // Resolve after successful operation
      },
      async () => {
        // Use default location if geolocation fails
        await enviarComLocalizacao(0, 0);
        resolve(); // Resolve even if geolocation fails
      },
      {
        timeout: 10000,
        maximumAge: 60000,
        enableHighAccuracy: true,
      }
  );
});
}