import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
  palette,
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2rem' },
  },
  spacing: 8,
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'red' },
          style: {
            backgroundColor: '#CC5C52',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#B84D44',
            },
          },
        },
      ],
    },
  },
});

export default theme;