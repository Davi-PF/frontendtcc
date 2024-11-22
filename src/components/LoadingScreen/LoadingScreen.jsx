export default function LoadingScreen() {
  const loadingStyles = {
    container: {
      display: "flex",
      height: "80vh",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontWeight: "600",
    },
  };

  return (
    <div style={loadingStyles.container}>
      <p style={loadingStyles.text}>Carregando...</p>
    </div>
  );
}
