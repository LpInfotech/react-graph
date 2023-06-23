import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';
import BarChart from '../../components/Chart/Chart';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

function TestSelection() {
	const routeData = useLoaderData();
	const navigate = useNavigate();
	const { state } = useLocation();
  const chartRef = useRef(null)
	const [value, setValue] = useState({
		xAxis: 'razi',
		yAxis: 'performance',
		profile: '',
		norm: '',
		candidate: '',
		low: 25,
		average: 25,
		high: 50,
		view: 'y'
	});

	const [isValid, setValid] = useState({
		profile: false,
		norm: false,
		chartError: false
	});

	const [data, setData] = useState([]);

	// when component load
	useEffect(() => {
		async function getSelectedCandidates() {
			if (state)
				await fetch('/get/candidates?id=' + state.join(','))
					.then((response) => response.json())
					.then((data) => setData(data));
		}
		getSelectedCandidates();
	}, [state]);

	// #region

	// if state is null
	if (!state) {
		navigate('/');
	}

	// set validation
	if (isValid.profile && value.profile !== '') setValid({ ...isValid, profile: false });
	else if (isValid.norm && value.norm !== '') setValid({ ...isValid, norm: false });
	else {
		if (isValid.profile && isValid.norm && value.xAxis !== 'apl' && value.yAxis !== 'apl')
			setValid({ profile: false, norm: false });
	}

	// #end region

	//#region events

	const handleErrors = () => {
		if (value.profile === '' && value.norm === '') {
			setValid({ profile: true, norm: true });
		} else if (value.profile === '') {
			setValid({ ...isValid, profile: true });
		} else if (value.norm === '') {
			setValid({ ...isValid, norm: true });
		}
	};

	const getPosition = async (xAxis, yAxis) => {
		if (parseInt(value.low) + parseInt(value.high) + parseInt(value.average) !== 100) {
			setValid({ ...isValid, chartError: true });
		} else {
			setValid({ ...isValid, chartError: false });
			// if same position
			if (xAxis === yAxis) {
				if (xAxis === 'apl' && (value.profile === '' || value.norm === '')) {
					handleErrors();
				} else if (xAxis === 'apl&razi') {
					await fetch('/get/apl-razi?id=' + data[0].can_id);
				} else await fetch('/get/' + xAxis + '?id=' + data[0].can_id);
			} else if ((xAxis === 'apl' || yAxis === 'apl') && (value.profile === '' || value.norm === '')) {
				handleErrors();
			} else {
				let xPosition, yPosition;
				// check if test include the apl+razi
				if (xAxis === 'apl&razi' || yAxis === 'apl&razi') {
					xPosition =
						xAxis === 'apl&razi'
							? await fetch('/get/apl-razi?id=' + data[0].can_id)
							: await fetch('/get/' + xAxis + '?id=' + data[0].can_id);
					yPosition =
						yAxis === 'apl&razi'
							? await fetch('/get/apl-razi?id=' + data[0].can_id)
							: await fetch('/get/' + yAxis + '?id=' + data[0].can_id);
				} else {
					// if another test selected
					xPosition = await fetch('/get/' + xAxis + '?id=' + data[0].can_id);
					yPosition = await fetch('/get/' + yAxis + '?id=' + data[0].can_id);
				}
				Promise.all([xPosition, yPosition]).then((data) => console.log(data));
			}
    chartRef.current.update();
		}
	};

	// on change input
	const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });
	// #end region

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
							<Typography variant="h4" fontWeight={600} marginBottom={3}>
								Test Selection
							</Typography>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="candidate" fontWeight={600} textTransform="capitalize">
									Selected List
								</Box>
								<Select
									labelId="candidate"
									id="candidate"
									value={value.candidate}
									name="candidate"
									onChange={(e) => handleChange(e)}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
									{data.map((el) => (
										<MenuItem key={el.can_id} value={el.can_id}>
											{el.can_nombre + ' ' + el.can_apellido}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="xAxis" fontWeight={600} textTransform="capitalize">
									X Axis
								</Box>
								<Select
									labelId="xAxis"
									id="xAxis"
									value={value.xAxis}
									name="xAxis"
									onChange={(e) => handleChange(e)}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
									<MenuItem value="apl">Last APL</MenuItem>
									<MenuItem value="razi">Last RAZI</MenuItem>
									<MenuItem value="apl&razi">Last APL + RAZI</MenuItem>
									<MenuItem value="performance">Last Performance Evaluation</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="yAxis" fontWeight={600} textTransform="capitalize">
									Y Axis
								</Box>
								<Select
									labelId="yAxis"
									id="yAxis"
									value={value.yAxis}
									name="yAxis"
									onChange={(e) => handleChange(e)}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
									<MenuItem value="apl">Last APL</MenuItem>
									<MenuItem value="razi">Last RAZI</MenuItem>
									<MenuItem value="apl&razi">Last APL + RAZI</MenuItem>
									<MenuItem value="performance">Last Performance Evaluation</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="profile" fontWeight={600} textTransform="capitalize">
									Profile
								</Box>
								<Select
									labelId="profile"
									id="profile"
									value={value.profile}
									name="profile"
									onChange={(e) => handleChange(e)}
									displayEmpty
									error={isValid.profile}
								>
									<MenuItem value="">None</MenuItem>
									{routeData[0][0].response.map((el) => (
										<MenuItem key={el.pl_id} value={el.nombreNivelOrg}>
											{el.nombreNivelOrg}
										</MenuItem>
									))}
								</Select>
								<FormHelperText error sx={{ visibility: isValid.profile ? 'visible' : 'hidden' }}>
									Profile is required with APL test.
								</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="norm" fontWeight={600} textTransform="capitalize">
									norm
								</Box>
								<Select
									labelId="norm"
									id="norm"
									value={value.norm}
									name="norm"
									onChange={(e) => handleChange(e)}
									displayEmpty
									error={isValid.norm}
								>
									<MenuItem value="">None</MenuItem>
									{routeData[1][0].response[0].map((el) => (
										<MenuItem key={el.na_id} value={el.na_nombre}>
											{el.na_nombre}
										</MenuItem>
									))}
									{routeData[1][0].response[1].map((el) => (
										<MenuItem key={el.nt_id} value={el.nt_Nombre}>
											{el.nt_Nombre}
										</MenuItem>
									))}
								</Select>
								<FormHelperText error sx={{ visibility: isValid.norm ? 'visible' : 'hidden' }}>
									Norm is required with APL test.
								</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5" fontWeight={600}>
								Chart Config
							</Typography>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box component={'label'} fontWeight={600} textTransform="capitalize" display={'block'} htmlFor="low">
									Low
								</Box>
								<TextField id="low" type="number" name="low" value={value.low} onChange={(e) => handleChange(e)} />
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									fontWeight={600}
									textTransform="capitalize"
									display={'block'}
									htmlFor="average"
								>
									Average
								</Box>
								<TextField
									id="average"
									type="number"
									name="average"
									value={value.average}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="high">
									High
								</Box>
								<TextField id="high" type="number" name="high" value={value.high} onChange={(e) => handleChange(e)} />
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="chartView" fontWeight={600} textTransform="capitalize">
									Chart View
								</Box>
								<Select
									labelId="chartView"
									id="chartView"
									displayEmpty
									name="view"
									value={value.view}
									onChange={(e) => handleChange(e)}
								>
									<MenuItem value="x">Horizontally</MenuItem>
									<MenuItem value="y">Vertically</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						{isValid.chartError && (
							<Grid item xs={12}>
								<Alert variant="outlined" severity="warning">
									The total of low, average, high should be equal to 100. Current total is{' '}
									{parseInt(value.low) + parseInt(value.high) + parseInt(value.average)}.
								</Alert>
							</Grid>
						)}
						<Grid item xs={12} textAlign="right">
							<Button
								variant="contained"
								disabled={isValid.profile || isValid.norm}
								onClick={() => getPosition(value.xAxis, value.yAxis)}
							>
								Generate
							</Button>
						</Grid>
					</Grid>
					<BarChart value={value} ref={chartRef}/>
					{/* grid */}
				</Container>
			</Box>
			{/* filter section */}
		</>
	);
}

export default TestSelection;
