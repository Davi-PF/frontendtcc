import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";

// Contexts
import { SensitiveDataProvider } from "./contexts/SensitiveDataContext/SensitiveDataContext";

// Components
import Header from "./components/Header/Header";

// Styles
import "./styles/app.css"; // Estilos globais (opcional)

import { routes } from "./routes/routes";

const App = () => {
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);

  // Atualiza o estilo do header com base na rota
  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  return (
    <SensitiveDataProvider>
      <div className="app-container">
        {/* Header */}
        <Header homeStyle={isHomePage} />

        {/* Rotas */}
        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </SensitiveDataProvider>
  );
};

export default App;
