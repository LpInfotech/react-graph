import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import DataTable from '../../components/Table/Table';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormSelect from '../../components/Select/FormSelect';


function Home() {
	const candidatesData = useLoaderData();
	const [value, setValue] = useState({
		department: '',
		hierarchy: '',
		position: '',
		workBranch: ''
	});

	const [selected,setSelected] = useState([]);

	// handle on change
	const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

	return (
		<>
			{/* filter section */}
			<Box component={'section'}>
				<Container
					maxWidth="xxl"
					sx={{
						py: 3
					}}
				>
					{/* grid */}
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						<Grid item xs={12}>
							<Typography variant="h4" fontWeight={600} marginBottom={3}>Candidate Details</Typography>
							<Typography variant="h6" fontWeight={500} marginBottom={2}>Select Filter</Typography>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
								<FormSelect name="department" value={value.department} handleChange={handleChange} title="department">
									{candidatesData.data.colaboradores.filter((elm, index) => index === candidatesData.data.colaboradores.findIndex(element => element._NombreDepartamento === elm._NombreDepartamento)).map((el) => (
										<MenuItem key={el.can_id} value={el._NombreDepartamento}>
											{el._NombreDepartamento}
										</MenuItem>
									))}
								</FormSelect>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
						<FormSelect name="hierarchy" value={value.hierarchy} handleChange={handleChange} title="hierarchy">
						{candidatesData.data.colaboradores.filter((elm, index) => index === candidatesData.data.colaboradores.findIndex(element => element._NombreJerarquia === elm._NombreJerarquia)).map((el) => (
										<MenuItem key={el.can_id} value={el._NombreJerarquia}>
											{el._NombreJerarquia}
										</MenuItem>
									))}
								</FormSelect>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
						<FormSelect name="position" value={value.position} handleChange={handleChange} title="position">
						{candidatesData.data.colaboradores.filter((elm, index) => index === candidatesData.data.colaboradores.findIndex(element => element._CodigoCargo === elm._CodigoCargo)).map((el) => (
										<MenuItem key={el.can_id} value={el._CodigoCargo}>
											{el._CodigoCargo}
										</MenuItem>
									))}
								</FormSelect>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
						<FormSelect name="workBranch" value={value.workBranch} handleChange={handleChange} title="work branch">
						{candidatesData.data.colaboradores.filter((elm, index) => index === candidatesData.data.colaboradores.findIndex(element => element._NombreSucursal === elm._NombreSucursal)).map((el) => (
										<MenuItem key={el.can_id} value={el._NombreSucursal}>
											{el._NombreSucursal}
										</MenuItem>
									))}
								</FormSelect>
						</Grid>
					</Grid>
					{/* grid */}
				</Container>
			</Box>
			{/* filter section */}
			{/* table */}
			<Box component={'section'}>
				<Container
					maxWidth="xxl"
					sx={{
						py: 3
					}}
				>
					<DataTable data={candidatesData} selectValue={value} setSelected={setSelected} />
					<Box textAlign="right" sx={{my:3}}>
					<Button variant="contained" component={Link} to={"test-selection"} disabled={selected.length === 0 ? true:false }>
						Select List
					</Button>
					</Box>
				</Container>
			</Box>
			{/* table */}
		</>
	);
}

export default Home;
