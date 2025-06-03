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
        sx={{
          backgroundColor: 'background',
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'background.default',
            },
          },
        }}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.length === 0 ? (
          <MenuItem disabled>Sin datos en este momento.</MenuItem>
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
