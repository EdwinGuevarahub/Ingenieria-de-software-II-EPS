import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const SelectFilter = ({ label, value, options, onChange }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
      <MenuItem value="">Todos</MenuItem>
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectFilter;
