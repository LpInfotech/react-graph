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
import { flushSync } from 'react-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import {axis} from '../../config';



function TestSelection() {
	const routeData = useLoaderData();
	const navigate = useNavigate();
	const { state } = useLocation();
	const chartRef = useRef(null);

	const [value, setValue] = useState({
		xAxis: 'razi',
		yAxis: 'performance',
		profile: '',
		norm: '',
		candidates: [],
		low: 25,
		average: 25,
		high: 50,
		view: 'y'
	});

	const [position, setPosition] = useState([]);

	const [isValid, setValid] = useState({
		profile: false,
		norm: false,
		chartError: false
	});

	const [candidates, setCandidates] = useState([]);
	const [testData, setTestData] = useState([]);

	// when component load
	useEffect(() => {
		async function getSelectedCandidates() {
			if (state) {
				try{
				await fetch('/get/candidates?id=' + state.join(','))
					.then((response) => response.json())
					.then((data) => {
						setCandidates(data);
						let selected = data.map((el) => el.can_nombre +" "+el.can_apellido);
						setValue((prev) => {
							return { ...prev, candidates: selected };
						});
					});

				await fetch('/get/test?id=' + state.join(','))
					.then((response) => response.json())
					.then((data) => setTestData(data));
				}catch(e) {
					console.log(e)
				}
			}
		}
		getSelectedCandidates();
	}, [state]);
	// #region

	if(state === null){
		return navigate('home')
	}


	const aplList = [
		...new Set(
			testData
				.filter((el) => (el.pr_estructura === 1 || el.pr_estructura === 2) && el.pr_status === 1)
				.map((el) => el.pr_idCandidato)
		)
	].join(',');

	const raziList = [
		...new Set(testData.filter((el) => el.pr_estructura === 7 && el.pr_status === 1).map((el) => el.pr_idCandidato))
	].join(',');

	const performanceList = [
		...new Set(
			testData.filter(
				(el) => el.pr_estructura !== 1 && el.pr_estructura !== 2 && el.pr_estructura !== 7 && el.pr_status === 1
			).map((el) => el.pr_idCandidato)
		)
	].join(',');

  const total = (parseInt(value.low) + parseInt(value.high) + parseInt(value.average));
	// set validation
	if (isValid.profile && value.profile !== '') setValid({ ...isValid, profile: false });
	else if (isValid.norm && value.norm !== '') setValid({ ...isValid, norm: false });
	else {
		if (isValid.profile && isValid.norm && value.xAxis !== 'apl' && value.yAxis !== 'apl')
			setValid({ profile: false, norm: false });
	}

	// #end region

	//#region events

	// handle if axis values are same
	const handleEqualAxis = (xAxis, data) => {
		if (xAxis === 'razi') {
			data
				.flat()
				.filter((el) => el._resultadofinal)
				.forEach((el, i) =>
					flushSync(() => {
						setPosition({ ...position, x: el._resultadofinal, y: el._resultadofinal, label: i + 1, r: 10,name:candidates.map(elm=>{
							return elm.can_id === el._idCandidato ? {can_nombre:elm.can_nombre} : '';
						})});
					})
				);
		} else if (xAxis === 'performance') {
			let array = [];
			let currentPosition = data.flat().find((el) => el.porcentaje);
			array.push(currentPosition);
			array.forEach((el, i) => {
				flushSync(() => {
					setPosition({ ...position, x: el.porcentaje, y: el.porcentaje, label: i + 1, r: 10,name:candidates.map(elm=>{
						return data.flat().find(el=>el._NombreCandidato)._NombreCandidato.includes(elm.can_nombre) ? {can_nombre:elm.can_nombre} : '';
					}) });
				});
			});
		} else {
			data
				.flat()
				.filter((el) => el.calceranking)
				.forEach((el, i) => {
					flushSync(() => {
						setPosition({ ...position, x: el.calceranking, y: el.calceranking, label: i + 1, r: 10,name:candidates.map(elm=>{
							return elm.can_id === data.flat().find(el=>el._idCandidato)._idCandidato ? {can_nombre:elm.can_nombre} : '';
						})
				});
					});
				});
		}
		chartRef.current.update();
	};

	const handlePositionData = (data, xAxis, yAxis) => {
		let array = [];
		let positionX, positionY;
		if (xAxis === 'razi' && yAxis === 'apl') {
			positionX = data[0].flat().filter((el) => el._resultadofinal);
			positionY = data[1].flat().filter((el) => el.calceranking);
			let obj = { ...positionX, ...positionY };
			array.push(obj);
			console.log(array);
			// positionX.concat(positionY).forEach((el,i)=>flushSync(() => {
			// 	setPosition({ ...position, x: el, y: el, label: i + 1, r: 10 });
			// }))
		}
		// chartRef.current.update();
	};

	// handle if axis values are different
	const handleNotEqualAxis = async (xAxis, yAxis) => {
		const id = xAxis === 'apl' ? aplList : xAxis === 'performance' ? performanceList : xAxis === 'razi' ? raziList : '';
		let xPosition, yPosition;
		// check if test include the apl+razi
		if (xAxis === 'apl&razi' || yAxis === 'apl&razi') {
			xPosition =
				xAxis === 'apl&razi'
					? await fetch('/get/apl-razi?id=' + id)
					: await fetch('/get/' + xAxis + '?id=' + id).then((response) => response.json());
			yPosition =
				yAxis === 'apl&razi'
					? await fetch('/get/apl-razi?id=' + id)
					: await fetch('/get/' + yAxis + '?id=' + id).then((response) => response.json());
		} else {
			// if another test selected
			xPosition = await fetch('/get/' + xAxis + '?id=' + id).then((response) => response.json());
			yPosition = await fetch('/get/' + yAxis + '?id=' + id).then((response) => response.json());
		}
		id !== '' &&
			Promise.all([xPosition, yPosition]).then((data) => {
				handlePositionData(data, xAxis, yAxis);
			});
	};

	const handleAplAndRazi = (data)=>{
		data.then(response=>{
		let razi=	response[1].flat().filter((el) => el._resultadofinal);
    let apl = response[0].flat().filter((el) => el.calceranking);

		let obj = [{...apl[0],...razi[0]}];
    
		obj.forEach((el,i)=>{
		flushSync(() => {
			setPosition({ ...position, x: (el.calceranking  *(el.calceranking / 100)), y: (el._resultadofinal *(el.calceranking / 100)), label: i+1, r: 10,name:candidates.map(elm=>{
				return elm.can_id === response[1].flat().find(el=>el._idCandidato)._idCandidato ? {can_nombre:elm.can_nombre} : '';
			})

		});
		});
		chartRef.current.update();
	})
		});
	}

	// handle position
	const handlePosition = async (xAxis, yAxis) => {
		const id = xAxis === 'apl' ? aplList : xAxis === 'performance' ? performanceList : xAxis === 'razi' ? raziList : xAxis === 'apl&razi' ? aplList:'' ;
		const url = '/get/' + xAxis + '?id=' + id;
		// if same position
		if (xAxis === yAxis) {
			if (xAxis === 'apl' && (value.profile === '' || value.norm === '')) {
				handleErrors();
			} else if (xAxis === 'apl&razi') {
			let apl =	await fetch('/get/apl?id=' + id).then(response => response.json());
			let razi=	await fetch('/get/razi?id=' + id).then(response=> response.json());
			Promise.all([apl,razi]);
			 handleAplAndRazi(Promise.all([apl,razi]))
			} else {
				id !== '' &&
					(await fetch(url)
						.then((response) => response.json())
						.then((data) => {
							handleEqualAxis(xAxis, data);
						}));
			}
		} else if ((xAxis === 'apl' || yAxis === 'apl') && (value.profile === '' || value.norm === '')) {
			handleErrors();
		} else {
			await handleNotEqualAxis(xAxis, yAxis);
		}
	};

	// handle errors
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
			await handlePosition(xAxis, yAxis);
		}
	};

	// on change input
	const handleChange = (e) => setValue(prev=>{
		let value = e.target.value;
    value = value.slice(0, 3);
    // Convert the value to a number
    const numberValue = Number(value);
    // Restrict the maximum value to 100
    if (!isNaN(numberValue) && numberValue >= 100) {
      value = '100';
			return{ ...prev, [e.target.name]: value }
    }else{
		return{ ...prev, [e.target.name]: e.target.value }
		}
	
	});
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
								<Box id="xAxisLabel" fontWeight={600} textTransform="capitalize">
									X Axis
								</Box>
								<Select
									labelId="xAxisLabel"
									id="xAxis"
									value={value.xAxis}
									name="xAxis"
									onChange={(e) => handleChange(e)}
									sx={{textTransform:"capitalize"}}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
	                 {
										axis.map(el=>	<MenuItem key={el.id} value={el.value} 	sx={{textTransform:"capitalize"}}>{el.axis}</MenuItem>)
									 }
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="yAxisLabel" fontWeight={600} textTransform="capitalize">
									Y Axis
								</Box>
								<Select
									labelId="yAxisLabel"
									id="yAxis"
									value={value.yAxis}
									name="yAxis"
									sx={{textTransform:"capitalize"}}
									onChange={(e) => handleChange(e)}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
	                 {
										axis.map(el=>	<MenuItem key={el.id} value={el.value} sx={{textTransform:"capitalize"}}>{el.axis}</MenuItem>)
									 }
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="profileLabel" fontWeight={600} textTransform="capitalize">
									Profile
								</Box>
								<Select
									labelId="profileLabel"
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
								<Box id="normLabel" fontWeight={600} textTransform="capitalize">
									norm
								</Box>
								<Select
									labelId="normLabel"
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
						<Grid item xs={12} marginBottom={3}>
							<FormControl fullWidth>
								<Box id="candidatesLabel" fontWeight={600} textTransform="capitalize">
									Selected List
								</Box>
								<Select
									multiple={true}
									labelId="candidatesLabel"
									onChange={(e) => setValue({ ...value, candidates: e.target.value.split(',') })}
									id="candidate"
									value={value.candidates}
									name="candidate"
									displayEmpty
									input={<OutlinedInput />}
									inputProps={{ 'aria-label': 'Without label' }}
									renderValue={(selected) => {
										if (selected.length === 0) {
											return <em>None</em>;
										}

										return selected.join(', ');
									}}
								>
									{candidates.map((el) => (
										<MenuItem disabled={true} key={el.can_id} value={el.can_id}>
											{el.can_nombre + ' ' + el.can_apellido}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h5" fontWeight={600}>
								Chart Settings
							</Typography>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box component={'label'} fontWeight={600} textTransform="capitalize" display={'block'} htmlFor="low">
									Low
								</Box>
								<TextField
									id="low"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="low"
									value={value.low}
									onChange={(e) => handleChange(e)}
								/>
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
									inputProps={{ min: 0, max: 100, step: 5 }}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="high">
									High
								</Box>
								<TextField
									id="high"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="high"
									value={value.high}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3} sm={6}>
							<FormControl fullWidth>
								<Box id="chartView" fontWeight={600} textTransform="capitalize">
									bars
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
							<Grid item xs={12} sx={{ mt: 4 }}>
								<Alert variant="outlined" severity={total !== 100 ?"warning":"success"}>
									The total of low, average, high should be equal to 100. Current total is 
									  <Box component={"span"} fontWeight={"600"}> {total}</Box>.
								</Alert>
							</Grid>
						)}
						<Grid item xs={12} textAlign="right" sx={{ my: 4 }}>
							<Button
								variant="contained"
								disabled={isValid.profile || isValid.norm}
								onClick={(e) => getPosition(value.xAxis, value.yAxis)}
							>
								Generate
							</Button>
						</Grid>
					</Grid>
					<BarChart value={value} ref={chartRef} bubblePosition={position} />
					{/* grid */}
				</Container>
			</Box>
			{/* filter section */}
		</>
	);
}

export default TestSelection;
