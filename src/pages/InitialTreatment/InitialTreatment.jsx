// InitialTreatment.jsx
import React from "react";
import useInitialTreatment from "./hooks/useInitialTreatment";
import {
  outerContainerStyle,
  containerStyle,
  titleStyle,
  descriptionStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
} from "./styles/styles";

const InitialTreatment = () => {
  const { email, setEmail, phone, setPhone, loading, handleSubmit } = useInitialTreatment();

  return (
    <div style={outerContainerStyle}>
      {/* Messages moved outside the card */}
      <h1 style={titleStyle}>Obrigado por escanear a pulseira NFC!</h1>
      <p style={descriptionStyle}>
        Para prosseguir, precisamos que você informe seu e-mail e número de telefone.
      </p>
      <div style={containerStyle}>
        {/* Only the form is inside the card now */}
        <form onSubmit={(e)=> handleSubmit(e)}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={labelStyle}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="phone" style={labelStyle}>
              Número de Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Digite seu telefone"
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={buttonStyle(loading)}>
            {loading ? "Enviando..." : "Prosseguir"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialTreatment;
