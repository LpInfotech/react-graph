import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

function FormSelect({ value, name, handleChange,title, children }) {
	return (
		<FormControl fullWidth>
			<Box id={name} fontWeight={600} textTransform="capitalize">
				{title}
			</Box>
			<Select labelId={name} id={name} value={value} name={name} onChange={(e) => handleChange(e)} displayEmpty>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				{children}
			</Select>
		</FormControl>
	);
}

FormSelect.propTypes = {
value: PropTypes.string.isRequired,
name: PropTypes.string.isRequired,
handleChange:PropTypes.func.isRequired,
title:PropTypes.string,
}

export default FormSelect;
