import { Select, MenuItem, FormControl } from '@mui/material';

const SelectFilter = ({ placeholder, value, options, onChange }) => (
  <FormControl fullWidth variant="outlined">
    <Select
      displayEmpty
      value={value}
      onChange={(e) => onChange(e.target.value)}
      renderValue={(selected) => (selected ? selected : placeholder)}
    >
      <MenuItem value="">{placeholder || 'Todos'}</MenuItem>
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectFilter;

