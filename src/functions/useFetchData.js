import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants/apiEndpoints";

export const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async (cpfDep, emergPhone) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/dependents/verifyDependentsCPFandEmergPhone/params?cpfDep=${cpfDep}&emergPhone=${emergPhone}`
      );

      if (response.data) {
        localStorage.setItem("dependentData", JSON.stringify(response.data));
      } else {
        throw new Error("Dados do dependente não encontrados.");
      }

      navigate("/emergencyPhone");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao buscar dados, tente novamente...");
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchData };
};
