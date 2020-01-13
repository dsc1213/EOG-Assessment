import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Dropdown = ({ onChange, data = [], value }) => {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={data}
      disableCloseOnSelect
      onChange={(_, value) => onChange(value)}
      getOptionLabel={val => val}
      renderOption={(value, { selected }) => (
        <React.Fragment>
          <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
          {value}
        </React.Fragment>
      )}
      style={{ width: 500 }}
      renderInput={params => <TextField {...params} variant="outlined" label="Select Metrics" fullWidth />}
    />
  );
};

export default Dropdown;
