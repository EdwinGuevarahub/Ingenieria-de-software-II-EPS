import { Select, MenuItem, FormControl } from '@mui/material';

const SelectFilter = ({ placeholder, value, options, onChange }) => {

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <FormControl fullWidth variant="outlined">
      <Select
        displayEmpty
        value={value}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => (selectedOption ? selectedOption.label : placeholder)}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.length === 0 ? (
          <MenuItem disabled>Oh no! La politzia.</MenuItem>
        ) : (
          options.map((opt, i) => (
            <MenuItem key={i} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
