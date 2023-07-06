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
import { axis } from '../../config';

function TestSelection() {
	const routeData = useLoaderData();
	const navigate = useNavigate();
	const { state } = useLocation();
	const horizontalChartRef = useRef(null);
	const verticalChartRef = useRef(null);
	const [isPrint, setPrint] = useState(false);

	const [value, setValue] = useState({
		xAxis: 'razi',
		yAxis: 'razi',
		profile: '',
		norm: '',
		candidates: [],
		horizontalLow: 25,
		horizontalAverage: 25,
		horizontalHigh: 50,
		verticalLow: 25,
		verticalAverage: 25,
		verticalHigh: 50
	});

	const [position, setPosition] = useState([]);

	const [isValid, setValid] = useState({
		profile: false,
		norm: false,
		chartError: false,
		horizontalChartError: false,
		verticalChartError: false
	});

	const [candidates, setCandidates] = useState([]);
	const [testData, setTestData] = useState([]);

	// when component load
	useEffect(() => {
		async function getSelectedCandidates() {
			if (state) {
				try {
					await fetch('/get/candidates?id=' + state.join(','))
						.then((response) => response.json())
						.then((data) => {
							setCandidates(data);
							let selected = data.map((el) => el.can_nombre + ' ' + el.can_apellido);
							setValue((prev) => {
								return { ...prev, candidates: selected };
							});
						});

					await fetch('/get/test?id=' + state.join(','))
						.then((response) => response.json())
						.then((data) => setTestData(data));
				} catch (e) {
					console.log(e);
				}
			}
		}
		getSelectedCandidates();
	}, [state]);
	// #region

	if (state === null) {
		return navigate('/');
	}

	const aplList = [
		...new Set(
			testData
				.flat()
				.filter((el) => (el.pr_estructura === 1 || el.pr_estructura === 2) && el.pr_status === 1)
				.map((el) => el.pr_idCandidato)
		)
	].join(',');

	const raziList = [
		...new Set(
			testData
				.flat()
				.filter((el) => el.pr_estructura === 7 && el.pr_status === 1)
				.map((el) => el.pr_idCandidato)
		)
	].join(',');

	const performanceList = [
		...new Set(
			testData
				.flat()
				.filter(
					(el) => el.pr_estructura !== 1 && el.pr_estructura !== 2 && el.pr_estructura !== 7 && el.pr_status === 1
				)
				.map((el) => el.pr_idCandidato)
		)
	].join(',');

	const horizontalTotal =
		parseInt(value.horizontalLow) + parseInt(value.horizontalAverage) + parseInt(value.horizontalHigh);
	const verticalTotal = parseInt(value.verticalLow) + parseInt(value.verticalAverage) + parseInt(value.verticalHigh);

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
			let raziData;
			if (raziList.split(',').length > 1) {
				raziData = data
					.flat()
					.filter((el) => el[0]._resultadofinal)
					.flat()
					.map((el, i) => {
						return {
							x: el._resultadofinal,
							y: el._resultadofinal,
							label: i + 1,
							r: 10,
							name: candidates.find((elm) => elm.can_id === el._idCandidato)
						};
					});
			} else {
				raziData = data
					.flat()
					.filter((el) => el._resultadofinal)
					.map((el, i) => {
						return {
							x: el._resultadofinal,
							y: el._resultadofinal,
							label: i + 1,
							r: 10,
							name: candidates.find((elm) => elm.can_id === el._idCandidato)
						};
					});
			}

			flushSync(() => {
				setPosition(raziData);
			});
			setPrint(true);
			horizontalChartRef.current.update();
			verticalChartRef.current.update();
		} else if (xAxis === 'performance') {
			let array = [];
			let currentPosition = data.flat().find((el) => el.porcentaje);
			array.push(currentPosition);
			array.forEach((el, i) => {
				flushSync(() => {
					setPosition({
						...position,
						x: el.porcentaje,
						y: el.porcentaje,
						label: i + 1,
						r: 10,
						name: candidates.map((elm) => {
							return data
								.flat()
								.find((el) => el._NombreCandidato)
								._NombreCandidato.includes(elm.can_nombre)
								? { can_nombre: elm.can_nombre }
								: '';
						})
					});
				});
			});
		} else {
			let aplData;
			if (aplList.split(',').length > 1) {
				aplData = data
					.flat()
					.flat()
					.filter((el) => el.calceranking)
					.map((el, i) => {
						let name = data
							.flat()
							.flat()
							.filter((el) => el._idCandidato)
							.map((el) => el);
						return {
							x: el.calceranking,
							y: el.calceranking,
							label: i + 1,
							r: 10,
							name: candidates.find((el) => el.can_id === name[i]._idCandidato)
						};
					});
			} else {
				aplData = data
					.flat()
					.filter((el) => el.calceranking)
					.map((el, i) => {
						return {
							x: el.calceranking,
							y: el.calceranking,
							label: i + 1,
							r: 10,
							name: candidates.find((elm) => {
								return elm.can_id === data.flat().find((el) => el._idCandidato)._idCandidato;
							})
						};
					});
			}

			flushSync(() => {
				setPosition(aplData);
			});

			setPrint(true);
			horizontalChartRef.current.update();
			verticalChartRef.current.update();
		}
	};

	const handlePositionData = (data, xAxis, yAxis) => {
		let positionX, positionY;

		if ((xAxis === 'razi' || xAxis === 'apl&razi') && (yAxis === 'apl' || yAxis === 'apl&razi')) {
			if (aplList.split(',').length > 1 && raziList.split(',').length > 1) {
				positionX = data[0]
					.flat()
					.flat()
					.filter((el) => el._resultadofinal);
				positionY = data[1]
					.flat()
					.flat()
					.filter((el) => el.calceranking);
				let array = positionX.map((el, i) => {
					return {
						x: positionY[i].calceranking * (positionY[i].calceranking / 100),
						y: el._resultadofinal * (el._resultadofinal / 100),
						label: i + 1,
						r: 10,
						name: candidates.find((elm) => elm.can_id === el._idCandidato)
					};
				});

				flushSync(() => {
					setPosition(array);
				});

				setPrint(true);
			} else {
				positionX = data[0].flat().filter((el) => el._resultadofinal);
				positionY = data[1].flat().filter((el) => el.calceranking);
				let obj = [{ ...positionX[0], ...positionY[0] }];

				obj.forEach((el, i) =>
					flushSync(() => {
						setPosition({
							...position,
							x: el._resultadofinal,
							y: el.calceranking,
							label: i + 1,
							r: 10,
							name: candidates.map((elm) => {
								return elm.can_id === data[1].flat().find((el) => el._idCandidato)._idCandidato
									? { can_nombre: elm.can_nombre }
									: '';
							})
						});
					})
				);
			}
		} else if ((xAxis === 'apl' || xAxis === 'apl&razi') && (yAxis === 'razi' || yAxis === 'apl&razi')) {
			if (aplList.split(',').length > 1 && raziList.split(',').length > 1) {
				positionY = data[1]
					.flat()
					.flat()
					.filter((el) => el._resultadofinal);
				positionX = data[0]
					.flat()
					.flat()
					.filter((el) => el.calceranking);

				let array = positionY.map((el, i) => {
					return {
						x: positionX[i].calceranking * (positionX[i].calceranking / 100),
						y: el._resultadofinal * (el._resultadofinal / 100),
						label: i + 1,
						r: 10,
						name: candidates.find((elm) => elm.can_id === el._idCandidato)
					};
				});

				flushSync(() => {
					setPosition(array);
				});

				setPrint(true);
			} else {
				positionY = data[1].flat().filter((el) => el._resultadofinal);
				positionX = data[0].flat().filter((el) => el.calceranking);
				let obj = [{ ...positionX[0], ...positionY[0] }];

				obj.forEach((el, i) =>
					flushSync(() => {
						setPosition({
							...position,
							x: el.calceranking,
							y: el._resultadofinal,
							label: i + 1,
							r: 10,
							name: candidates.map((elm) => {
								return elm.can_id === data[1].flat().find((el) => el._idCandidato)._idCandidato
									? { can_nombre: elm.can_nombre }
									: '';
							})
						});
					})
				);
			}
		}
		horizontalChartRef.current.update();
		verticalChartRef.current.update();
	};

	// handle if axis values are different
	const handleNotEqualAxis = async (xAxis, yAxis) => {
		const id =
			(xAxis || yAxis) === 'apl'
				? aplList
				: (xAxis || yAxis) === 'performance'
				? performanceList
				: xAxis === 'razi'
				? raziList
				: (xAxis || yAxis) === 'apl&razi'
				? aplList
				: '';
		let xPosition, yPosition;
		// check if test include the apl+razi
		if (xAxis === 'apl&razi' || yAxis === 'apl&razi') {
			xPosition =
				xAxis === 'apl'
					? await fetch('/get/apl?id=' + id).then((response) => response.json())
					: xAxis === 'razi'
					? await fetch('/get/razi?id=' + id).then((response) => response.json())
					: xAxis === 'apl&razi' && yAxis === 'razi'
					? await fetch('/get/apl?id=' + id).then((response) => response.json())
					: xAxis === 'apl&razi' && yAxis === 'apl'
					? await fetch('/get/razi?id=' + id).then((response) => response.json())
					: '';

			yPosition =
				yAxis === 'razi'
					? await fetch('/get/razi?id=' + id).then((response) => response.json())
					: yAxis === 'apl'
					? await fetch('/get/apl?id=' + id).then((response) => response.json())
					: yAxis === 'apl&razi' && xAxis === 'apl'
					? await fetch('/get/razi?id=' + id).then((response) => response.json())
					: yAxis === 'apl&razi' && xAxis === 'razi'
					? await fetch('/get/apl?id=' + id).then((response) => response.json())
					: '';
		} else {
			// if another test selected
			xPosition = await fetch('/get/' + xAxis + '?id=' + id).then((response) => response.json());
			yPosition = await fetch('/get/' + yAxis + '?id=' + id).then((response) => response.json());
		}
		id !== '' &&
			Promise.all([xPosition, yPosition])
				.then((data) => {
					handlePositionData(data, xAxis, yAxis);
				})
				.catch((e) => setPrint(false));
	};

	// handle apl and razi
	const handleAplAndRazi = (data) => {
		data
			.then((response) => {
				let razi, apl, array;
				if (aplList.split(',').length > 1) {
					razi = response[1]
						.flat()
						.flat()
						.filter((el) => el._resultadofinal);

					apl = response[0]
						.flat()
						.flat()
						.filter((el) => el.calceranking);

					array = razi.map((el, i) => {
						return {
							x: apl[i].calceranking * (apl[i].calceranking / 100),
							y: el._resultadofinal * (el._resultadofinal / 100),
							label: i + 1,
							r: 10,
							name: candidates.find((elm) => elm.can_id === el._idCandidato)
						};
					});
				} else {
					razi = response[1].flat().filter((el) => el._resultadofinal);
					apl = response[0].flat().filter((el) => el.calceranking);
					let obj = [{ ...apl[0], ...razi[0] }];
					array = obj.map((el, i) => {
						return {
							x: el.calceranking * (el.calceranking / 100),
							y: el._resultadofinal * (el._resultadofinal / 100),
							label: i + 1,
							r: 10,
							name: candidates.find(
								(elm) => elm.can_id === response[1].flat().find((el) => el._idCandidato)._idCandidato
							)
						};
					});
				}

				flushSync(() => {
					setPosition(array);
				});
				setPrint(true);
				horizontalChartRef.current.update();
				verticalChartRef.current.update();
			})
			.catch((e) => setPrint(false));
	};

	// handle position
	const handlePosition = async (xAxis, yAxis) => {
		const id =
			xAxis === 'apl'
				? aplList
				: xAxis === 'performance'
				? performanceList
				: xAxis === 'razi'
				? raziList
				: xAxis === 'apl&razi'
				? aplList
				: '';
		const url = '/get/' + xAxis + '?id=' + id;
		// if same position
		if (xAxis === yAxis) {
			if (xAxis === 'apl' && (value.profile === '' || value.norm === '')) {
				handleErrors();
			} else if (xAxis === 'apl&razi') {
				let apl = await fetch('/get/apl?id=' + id).then((response) => response.json());
				let razi = await fetch('/get/razi?id=' + id).then((response) => response.json());
				Promise.all([apl, razi]);
				handleAplAndRazi(Promise.all([apl, razi]));
			} else {
				try {
					id !== '' &&
						(await fetch(url)
							.then((response) => response.json())
							.then((data) => {
								handleEqualAxis(xAxis, data);
							}));
				} catch (e) {
					console.log(e);
					setPrint(false);
				}
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
		const horizontalTotal =
			parseInt(value.horizontalLow) + parseInt(value.horizontalAverage) + parseInt(value.horizontalHigh) !== 100;
		const verticalTotal =
			parseInt(value.verticalLow) + parseInt(value.verticalAverage) + parseInt(value.verticalHigh) !== 100;
		if (horizontalTotal) {
			setValid({ ...isValid, horizontalChartError: true });
		} else if (verticalTotal) {
			setValid({ ...isValid, verticalChartError: true });
		} else {
			setValid({ ...isValid, horizontalChartError: false, verticalChartError: false });
			await handlePosition(xAxis, yAxis);
		}
	};

	let colors = position.map((el, i) => {
		return `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
			Math.random() * 256
		)},0.69)`;
	});

	// on change input
	const handleChange = (e) =>
		setValue((prev) => {
			let value = e.target.value;
			value = value.slice(0, 3);
			// Convert the value to a number
			const numberValue = Number(value);
			// Restrict the maximum value to 100
			if (!isNaN(numberValue) && numberValue >= 100) {
				value = '100';
				return { ...prev, [e.target.name]: value };
			} else {
				return { ...prev, [e.target.name]: e.target.value };
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
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 5 }}>
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
									sx={{ textTransform: 'capitalize' }}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
									{axis.map((el) => (
										<MenuItem key={el.id} value={el.value} sx={{ textTransform: 'capitalize' }}>
											{el.axis}
										</MenuItem>
									))}
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
									sx={{ textTransform: 'capitalize' }}
									onChange={(e) => handleChange(e)}
									displayEmpty
								>
									<MenuItem value="">None</MenuItem>
									{axis.map((el) => (
										<MenuItem key={el.id} value={el.value} sx={{ textTransform: 'capitalize' }}>
											{el.axis}
										</MenuItem>
									))}
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
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									fontWeight={600}
									textTransform="capitalize"
									display={'block'}
									htmlFor="horizontalLow"
								>
									Horizontal Low
								</Box>
								<TextField
									id="horizontalLow"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="horizontalLow"
									value={value.horizontalLow}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									fontWeight={600}
									textTransform="capitalize"
									display={'block'}
									htmlFor="horizontalAverage"
								>
									Horizontal Average
								</Box>
								<TextField
									id="horizontalAverage"
									type="number"
									name="horizontalAverage"
									value={value.horizontalAverage}
									inputProps={{ min: 0, max: 100, step: 5 }}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									display={'block'}
									fontWeight={600}
									textTransform="capitalize"
									htmlFor="horizontalHigh"
								>
									Horizontal High
								</Box>
								<TextField
									id="horizontalHigh"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="horizontalHigh"
									value={value.horizontalHigh}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									fontWeight={600}
									textTransform="capitalize"
									display={'block'}
									htmlFor="verticalLow"
								>
									Vertical Low
								</Box>
								<TextField
									id="verticalLow"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="verticalLow"
									value={value.verticalLow}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									fontWeight={600}
									textTransform="capitalize"
									display={'block'}
									htmlFor="verticalAverage"
								>
									Vertical Average
								</Box>
								<TextField
									id="verticalAverage"
									type="number"
									name="verticalAverage"
									value={value.verticalAverage}
									inputProps={{ min: 0, max: 100, step: 5 }}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box
									component={'label'}
									display={'block'}
									fontWeight={600}
									textTransform="capitalize"
									htmlFor="verticalHigh"
								>
									Vertical High
								</Box>
								<TextField
									id="verticalHigh"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="verticalHigh"
									value={value.verticalHigh}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						{(isValid.horizontalChartError || isValid.verticalChartError) && (
							<Grid item xs={12} sx={{ mt: 4 }}>
								<Alert
									variant="outlined"
									severity={horizontalTotal !== 100 || verticalTotal !== 100 ? 'warning' : 'success'}
								>
									The total of low, average, high should be equal to 100.
									<br />
									Current total for the horizontal chart is:-
									<Box component={'span'} fontWeight={'600'}>
										{horizontalTotal}
									</Box>
									<br />
									Current total for the vertical chart is :-
									<Box component={'span'} fontWeight={'600'}>
										{verticalTotal}
									</Box>
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
							{isPrint && (
								<Button
									variant="contained"
									sx={{ ml: 5 }}
									onClick={() => {
										horizontalChartRef.current.print();
										verticalChartRef.current.print();
										setTimeout(() => window.print(), 200);
									}}
								>
									Print
								</Button>
							)}
						</Grid>
						<Grid item xl={6}>
							<BarChart value={value} colors={colors} ref={horizontalChartRef} view="x" bubblePosition={position} />
						</Grid>
						<Grid item xl={6}>
							<BarChart value={value} colors={colors} ref={verticalChartRef} view="y" bubblePosition={position} />
						</Grid>
					</Grid>

					{/* grid */}
				</Container>
			</Box>
			{/* filter section */}
		</>
	);
}

export default TestSelection;
