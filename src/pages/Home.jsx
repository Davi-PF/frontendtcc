import { useState, useEffect } from "react";
import { useFetchData } from "../functions/useFetchData";
import { useDecryptData } from "../functions/useDecryptData";
import "../constants/toastConfig";

export default function Home() {
  const [cpfDep, setCpfDep] = useState("");
  const [emergPhone, setEmergPhone] = useState("");
  const { loading, fetchData } = useFetchData();

  useDecryptData(setCpfDep, setEmergPhone);

  useEffect(() => {
    if (cpfDep && emergPhone) {
      fetchData(cpfDep, emergPhone);
    }
  }, [cpfDep, emergPhone, fetchData]);

  const loadingStyles = {
    container: {
      display: "flex",
      height: "80vh",
      flexDirection: "column",
      justifyContent: "center",
    },
    text: {
      fontWeight: "600",
    },
  };

  return (
    <div>
      {loading ? (
        <div style={loadingStyles.container}>
          <p style={loadingStyles.text}>Carregando...</p>
        </div>
      ) : (
        <div style={loadingStyles.container}></div>
      )}
    </div>
  );
}