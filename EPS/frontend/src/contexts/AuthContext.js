import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/DecodeToken";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken_] = useState(() =>
    localStorage.getItem("authToken") || ""
  );
  const [role, setRole] = useState("");
  const [subEmail, setSubEmail] = useState("");

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      decodeToken(authToken).then((decoded) => {
        if (decoded?.roles?.[0]) {
          setRole(decoded.roles[0]);
        }
        if (decoded?.sub) {
          setSubEmail(decoded.sub);
        }
      });
    } else {
      localStorage.removeItem("authToken");
      setRole("");
      setSubEmail("");
     // setRole("PACIENTE");
     // setSubEmail("paciente@fake.com");
      //setAuthToken_("dev-token");
    }
  }, [authToken]);

  const isLogged = () => !!authToken;

  const isTokenExpired = () => {
    return decodeToken(authToken).then((payload) => {
      if (!payload || !payload.exp) return true;
      return Date.now() >= payload.exp * 1000;
    });
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
        subEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};