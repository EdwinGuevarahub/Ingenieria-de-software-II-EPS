import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { getIpsByAdmIpsEmail } from '../services/ipsService';
import { Box, Typography } from '@mui/material';

const IpsContext = createContext();

export const IpsContextProvider = ({ children }) => {

  const { isLogged, subEmail, role } = useAuthContext();
  const logged = isLogged();

  const [ isAuthLoading, setIsAuthLoading ] = useState(true);
  const [ willRedirect, setWillRedirect ] = useState(true);
  const [ ips, setIps ] = useState({});

  // Redirigir si el usuario no está logueado o no es un administrador de IPS.
  useEffect(() => {
    if (logged === false || role)
      setIsAuthLoading(false);
    else
      return;

    if (logged && role === 'ADM_IPS')
      setWillRedirect(false);
    else
      window.location.href = '/';

  }, [logged, role]);

  useEffect(() => {
    if (willRedirect)
      return;

    const fetchIps = async () => {
      try {
        const result = await getIpsByAdmIpsEmail(subEmail);
        setIps(result);
      } catch(error) {
        console.error('Error al cargar la ips del médico: ', error);
      }
    };

    fetchIps();
  }, [willRedirect, subEmail]);

  if (isAuthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  if (willRedirect)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Redirigiendo...</Typography>
      </Box>
    )

  return (
    <IpsContext.Provider value={{ ips, isAuthLoading }}>
      {!isAuthLoading && children}
    </IpsContext.Provider>
  );
};

export const useIpsContext = () => useContext(IpsContext);
