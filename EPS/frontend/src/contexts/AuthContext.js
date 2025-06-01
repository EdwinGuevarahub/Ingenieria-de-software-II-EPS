// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken_] = useState(() =>
    localStorage.getItem("authToken") || ""
  );
  const [role, setRole] = useState("");

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      const decoded = parseToken(authToken);
      if (decoded?.role) {
        setRole(decoded.role);
      }
    } else {
      localStorage.removeItem("authToken");
      setRole("");
    }
  }, [authToken]);

  const parseToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (e) {
      return null;
    }
  };

  const isLogged = () => !!authToken;

  const isTokenExpired = () => {
    const payload = parseToken(authToken);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  };

  const clearToken = () => {
    setAuthToken_("");
    setRole("");
    localStorage.removeItem("authToken");
  };

  const logOut = () => {
    clearToken();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken: setAuthToken_,
        isLogged,
        isTokenExpired,
        clearToken,
        logOut,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};