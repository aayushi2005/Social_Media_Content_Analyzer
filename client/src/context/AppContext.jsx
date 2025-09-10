import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const axiosInstance = axios.create({
    baseURL: "https://social-media-content-analyzer-w0ho.onrender.com", // your backend
  });

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, axios: axiosInstance }}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ This must exist
export const useAppContext = () => useContext(AppContext);
