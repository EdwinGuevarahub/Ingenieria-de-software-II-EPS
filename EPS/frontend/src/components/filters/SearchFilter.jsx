import { TextField } from '@mui/material';

const SearchFilter = ({ label, value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputLabelProps={{ shrink: false }}
  />
);

export default SearchFilter;
