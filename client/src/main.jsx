import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";  // ✅ import provider
import "./index.css";
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider> 
      <AuthProvider> {/* ✅ wrap your App here */}
      <App />
      </AuthProvider>
    </AppProvider>

  </StrictMode>
);
