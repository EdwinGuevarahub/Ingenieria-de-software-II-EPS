import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { getIpsByAdmIpsEmail } from '../services/ipsService';

const IpsContext = createContext();

export const IpsContextProvider = ({ children }) => {
  const { subEmail } = useAuthContext();
  const [ips, setIps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIps = async () => {
      try {
        const result = await getIpsByAdmIpsEmail(subEmail);
        setIps(result);
      } catch (error) {
        console.error('Error cargando IPS:', error);
      } finally {
        setLoading(false);
      }
    };

    if (subEmail) fetchIps();
  }, [subEmail]);

  return (
    <IpsContext.Provider value={{ ips, loading }}>
      {!loading && children}
    </IpsContext.Provider>
  );
};

export const useIpsContext = () => useContext(IpsContext);