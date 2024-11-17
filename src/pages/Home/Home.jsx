import { useEffect } from "react";
import { useHomeLogic } from "./hooks/useHomeLogic";
import LoadingScreen from "../../components/LoadingScreen";

export default function Home() {
  const { loading, encryptedCpfDep, encryptedEmergPhone, fetchData } =
    useHomeLogic();

  // Chama fetchData apenas se os dados criptografados estiverem disponíveis
  useEffect(() => {
    if (encryptedCpfDep && encryptedEmergPhone) {
      fetchData();
    }
  }, [encryptedCpfDep, encryptedEmergPhone, fetchData]);

  return (
    <div>
      {loading ? <LoadingScreen /> : <p>Dados carregados com sucesso!</p>}
    </div>
  );
}
