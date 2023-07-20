import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import Table from '../../components/ListTable/ListTable';
import { axis } from '../../config';


function TestSelection() {
	const routeData = useLoaderData();
	const navigate = useNavigate();
	const { state } = useLocation();
	const chartRef = useRef(null);
	const [isPrint, setPrint] = useState(false);
	const [value, setValue] = useState({
		xAxis: 'razi',
		yAxis: 'razi',
		profile: '',
		norm: '',
		candidates: [],
		xLow: 25,
		xAverage: 25,
		xHigh: 50,
		yLow: 25,
		yAverage: 25,
		yHigh: 50,
		aplWeight: 50,
		raziWeight: 50
	});

	const [position, setPosition] = useState([]);

	const [isValid, setValid] = useState({
		profile: false,
		norm: false,
		chartError: false,
		horizontalChartError: false,
		verticalChartError: false
	});

	const [isGenerated, setGenerated] = useState(false);
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
							setCandidates(data.map((el, i) => { return { ...el, index: i + 1 } }));
						});

					await fetch('/get/test?id=' + state.join(','))
						.then((response) => response.json())
						.then((data) => setTestData(data));
				} catch (e) {
					console.log(e);
				}
			} else {
				return navigate('/');
			}
		}
		getSelectedCandidates();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);
	// #region

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const Chart = useCallback(
		() => <BarChart value={value} colors={colors} ref={chartRef} bubblePosition={position} />,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isGenerated]
	);



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

	const horizontalTotal = Number(value.xLow) + Number(value.xAverage) + Number(value.xHigh);
	const verticalTotal = Number(value.yLow) + Number(value.yAverage) + Number(value.yHigh);

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
							label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
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
			chartRef.current.update();
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
							label: candidates.find((elm) => elm.can_id === name[i]._idCandidato).index,
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
			chartRef.current.update();
		}
		setGenerated((prev) => !prev);
	};

	const handlePositionData = (data, xAxis, yAxis) => {
		let positionX, positionY;

		if (((xAxis === 'apl&razi') || (yAxis === 'apl&razi')) && ((yAxis === 'apl') || (xAxis === 'apl'))) {

			let aplRaziIndex = xAxis === 'apl&razi' ? 0 : 1;
			positionX = data[1]
				.flat()
				.flat()
				.filter((el) => el._resultadofinal);

			positionY = data[0].map((el, i, array) => {
				return { _idCandidato: array[i].flat().flat().find(el => el._idCandidato)._idCandidato, calceranking: array[i].flat().flat().find(el => el.calceranking).calceranking }
			});

			let array;

			if (aplRaziIndex === 0) {
				array = positionY.map((el, i) => {
					let raziValue = positionX.find(elm => elm._idCandidato === el._idCandidato)._resultadofinal;
					let razi = (el.calceranking * (value.aplWeight / 100)) + (raziValue * (value.raziWeight / 100));
					return {
						x: el.calceranking,
						y: razi,
						label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
						r: 10,
						name: candidates.find((elm) => elm.can_id === el._idCandidato)
					};
				})
			}
			else {
				array = positionY.map((el, i) => {
					let raziValue = positionX.find(elm => elm._idCandidato === el._idCandidato)._resultadofinal;
					let razi = (el.calceranking * (value.aplWeight / 100)) + (raziValue * (value.raziWeight / 100));

					return {
						y: el.calceranking,
						x: razi,
						label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
						r: 10,
						name: candidates.find((elm) => elm.can_id === el._idCandidato)
					};
				})
			}

			flushSync(() => {
				setPosition(array);
			});

			setPrint(true);
		} else if (((xAxis === 'apl&razi') || (yAxis === 'apl&razi')) && (yAxis === 'razi' || xAxis === 'razi')) {
			let aplRaziIndex = xAxis === 'apl&razi' ? 0 : 1;

			positionX = data[1]
				.flat()
				.flat()
				.filter((el) => el._resultadofinal);

			positionY = data[0].map((el, i, array) => {
				return { _idCandidato: array[i].flat().flat().find(el => el._idCandidato)._idCandidato, calceranking: array[i].flat().flat().find(el => el.calceranking).calceranking }
			});

			debugger

			let array = aplRaziIndex === 1 ? positionX.map((el, i) => {
				let aplValue = positionY.find(elm => elm._idCandidato === el._idCandidato).calceranking;
				let apl = (aplValue * (value.aplWeight / 100)) + (el._resultadofinal * (value.raziWeight / 100));
				return {
					x: el._resultadofinal,
					y: apl,
					label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
					r: 10,
					name: candidates.find((elm) => elm.can_id === el._idCandidato)
				};
			}) : positionX.map((el, i) => {
				let aplValue = positionY.find(elm => elm._idCandidato === el._idCandidato).calceranking;
				let apl = (aplValue * (value.aplWeight / 100)) + (el._resultadofinal * (value.raziWeight / 100));
				return {
					x: apl,
					y: el._resultadofinal,
					label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
					r: 10,
					name: candidates.find((elm) => elm.can_id === el._idCandidato)
				};
			})

			console.log(array)
			flushSync(() => {
				setPosition(array);
			});

			setPrint(true);
		} else if ((xAxis === 'apl') && (yAxis === 'razi')) {

		} else if ((xAxis === 'razi') && (yAxis === 'apl')) {

		}
		chartRef.current.update();
		setGenerated((prev) => !prev);
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
		if (((xAxis === 'apl&razi') && ((yAxis === 'razi') || (yAxis === 'apl') || (yAxis === 'performance'))) || ((yAxis === 'apl&razi')
			&& ((xAxis === 'razi') || (xAxis === 'apl') || (xAxis === 'performance'))
		)) {
			xPosition = await fetch('/get/apl?id=' + id).then((response) => response.json());
			yPosition = await fetch('/get/razi?id=' + id).then((response) => response.json());
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

					apl = response[0].map((el, i, array) => {
						return { _idCandidato: array[i].flat().flat().find(el => el._idCandidato)._idCandidato, calceranking: array[i].flat().flat().find(el => el.calceranking).calceranking }
					}
					);


					array = razi.map((el, i) => {
						let aplValue = apl.find(elm => elm._idCandidato === el._idCandidato).calceranking;
						let axis = (aplValue * (value.aplWeight / 100)) + (el._resultadofinal * (value.raziWeight / 100));
						return {
							x: axis,
							y: axis,
							label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
							r: 10,
							name: candidates.find((elm) => elm.can_id === el._idCandidato)
						};
					});
				} else {
					razi = response[1].flat().filter((el) => el._resultadofinal);
					apl = response[0].flat().filter((el) => el.calceranking);
					let obj = [{ ...apl[0], ...razi[0] }];
					array = obj.map((el, i) => {
						let axis = (el.calceranking * (value.aplWeight / 100)) + (el._resultadofinal * (value.raziWeight / 100));
						return {
							x: axis,
							y: axis,
							label: candidates.find((elm) => elm.can_id === el._idCandidato).index,
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
				setGenerated((prev) => !prev);
				chartRef.current.update();
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

	// get position
	const getPosition = async (xAxis, yAxis) => {
		const isHorizontalTotal = horizontalTotal !== 100;
		const isVerticalTotal = verticalTotal !== 100;
		if (isHorizontalTotal) {
			setValid({ ...isValid, horizontalChartError: true });
		} else if (isVerticalTotal) {
			setValid({ ...isValid, verticalChartError: true });
		} else {
			setValid({ ...isValid, horizontalChartError: false, verticalChartError: false });
			await handlePosition(xAxis, yAxis);
		}
	};

	// region set label colors
	let labelColors = ['#455a64', '#424242', '#5d4037'];

	let colors = position?.map((el, i) => {
		let newColor = Math.floor(Math.random() * labelColors.length);
		return labelColors[newColor];
	})
	//#end region

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
			} else if (!isNaN(numberValue) && numberValue < 0) {
				value = '0'
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
									{routeData[2][0].response[0].map((el) => (
										<MenuItem key={el.na_id} value={el.na_nombre}>
											{el.na_nombre}
										</MenuItem>
									))}
								</Select>
								<FormHelperText error sx={{ visibility: isValid.norm ? 'visible' : 'hidden' }}>
									Norm is required with APL test.
								</FormHelperText>
							</FormControl>
						</Grid>
						{
							(value.xAxis === "apl&razi" || value.yAxis === "apl&razi") && <>
								<Grid item xs={12} md={3} sm={6}>
									<FormControl fullWidth>
										<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="aplWeight">
											Apl Weight
										</Box>
										<TextField
											id="aplWeight"
											inputProps={{ min: 0, max: 100, step: 5 }}
											type="number"
											name="aplWeight"
											value={value.aplWeight}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={3} sm={6}>
									<FormControl fullWidth>
										<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="raziWeight">
											Razi Weight
										</Box>
										<TextField
											id="raziWeight"
											inputProps={{ min: 0, max: 100, step: 5 }}
											type="number"
											name="raziWeight"
											value={value.raziWeight}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Grid>
							</>
						}
						<Grid item xs={12}>
							<Typography variant="h5" fontWeight={600}>
								Chart Settings
							</Typography>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box component={'label'} fontWeight={600} textTransform="capitalize" display={'block'} htmlFor="xLow">
									Horizontal Low
								</Box>
								<TextField
									id="xLow"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="xLow"
									value={value.xLow}
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
									htmlFor="xAverage"
								>
									Horizontal Average
								</Box>
								<TextField
									id="xAverage"
									type="number"
									name="xAverage"
									value={value.xAverage}
									inputProps={{ min: 0, max: 100, step: 5 }}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="xHigh">
									Horizontal High
								</Box>
								<TextField
									id="xHigh"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="xHigh"
									value={value.xHigh}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box component={'label'} fontWeight={600} textTransform="capitalize" display={'block'} htmlFor="yLow">
									Vertical Low
								</Box>
								<TextField
									id="yLow"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="yLow"
									value={value.yLow}
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
									htmlFor="yAverage"
								>
									Vertical Average
								</Box>
								<TextField
									id="yAverage"
									type="number"
									name="yAverage"
									value={value.yAverage}
									inputProps={{ min: 0, max: 100, step: 5 }}
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={4} sm={6} marginBottom={3}>
							<FormControl fullWidth>
								<Box component={'label'} display={'block'} fontWeight={600} textTransform="capitalize" htmlFor="yHigh">
									Vertical High
								</Box>
								<TextField
									id="yHigh"
									inputProps={{ min: 0, max: 100, step: 5 }}
									type="number"
									name="yHigh"
									value={value.yHigh}
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
									{!isNaN(horizontalTotal) ? <>Current total for the horizontal axis is :-
										<Box component={'span'} fontWeight={'600'}>
											{horizontalTotal}
										</Box></> : <>Horizontal axis :- <Box component={'span'} sx={{ color: (theme) => theme.palette.error.light }} fontWeight={'600'}> All fields should be filled.</Box></>}
									<br />
									{!isNaN(verticalTotal) ? <>Current total for the vertical axis is :-
										<Box component={'span'} fontWeight={'600'}>
											{verticalTotal}
										</Box></> : <>Vertical axis :- <Box component={'span'} sx={{ color: (theme) => theme.palette.error.light }} fontWeight={'600'}> All fields should be filled.</Box></>}
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
										flushSync(() => {
											chartRef.current.resize();
											chartRef.current.print();
										});
										setTimeout(() => window.print(), 250);
									}}
								>
									Print
								</Button>
							)}
						</Grid>
						<Grid item xs={12} lg={4} marginBottom={3}>
							<FormControl fullWidth>
								<Box marginBottom={4} fontWeight={600} textTransform="capitalize" paddingTop={1}>
									Selected List
								</Box>
								<Table data={candidates} />
							</FormControl>
						</Grid>
						<Grid
							item
							lg={8}
							sx={{
								mb: 10,
								mt: 4,
								flexGrow: 1,
								'@media print and (min-width: 320px)': {
									flexGrow: 0
								},
								'@media screen and (max-width: 320px)': {
									flexGrow: 0
								}
							}}
						>
							<Chart />
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
