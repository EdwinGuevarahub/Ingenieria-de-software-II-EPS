import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2rem' },
  },
  spacing: 8,
});

export default theme;