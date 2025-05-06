import { TextField } from '@mui/material';

const SearchFilter = ({ label, value, onChange }) => (
  <TextField
    fullWidth
    label={label}
    variant="outlined"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchFilter;
