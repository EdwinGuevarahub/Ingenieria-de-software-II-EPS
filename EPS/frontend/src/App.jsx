import AppRouter from './routes/AppRouter';
import { AuthContextProvider } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <AuthContextProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppRouter />
      </LocalizationProvider>
    </AuthContextProvider>
  );
}

export default App;

