export const setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value)); // Converte para string
  };
  
  export const getItem = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : defaultValue; // Converte de string para objeto
    } catch {
      return defaultValue;
    }
  };
  
  export const removeItem = (key) => {
    localStorage.removeItem(key);
  };
  