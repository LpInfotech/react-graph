import React, { forwardRef, useImperativeHandle, useRef, useState,memo } from 'react';
import { chartConfig } from '../../config';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bubble } from 'react-chartjs-2';
import { orange,red,yellow } from '@mui/material/colors';
import { Stack } from '@mui/material';

// register controller
ChartJS.register(LinearScale, PointElement, Legend, Tooltip, ChartDataLabels);

const BarChart = memo(forwardRef(function BarChart({ value, bubblePosition, colors}, ref) {

	const initialData = {
		datasets: [
			{
				type: 'bubble',
				backgroundColor: colors,
				borderWidth: 1,
				fill: false,
				data: bubblePosition
			}
		],
	};
  
	const [data, setData] = useState(initialData);
	const chartRef = useRef(null);

	useImperativeHandle(ref, () => {
		return {
			update() {
       setData(initialData);
				chartRef.current.update();
			},
			print() {
				triggerHover(chartRef.current);
			},
			resize(){
				chartRef?.current.resize(750,760);
			}
		};
	});

	// before print
	window.addEventListener('beforeprint', () => {
		if (chartRef.current !== null) {
			chartRef?.current.resize(750,760);
		}
	});

	// after print
	window.addEventListener('afterprint', () => {
		if (chartRef.current !== null) {
			chartRef?.current.resize();
		}
	});

	// trigger hover
	function triggerHover(chart) {
		const tooltip = chart?.tooltip;
		if (tooltip.getActiveElements().length > 0) {
			tooltip.setActiveElements([]);
		} else {
			tooltip.setActiveElements(
				bubblePosition.map((el, i) => {
					return { datasetIndex: 0, index: i };
				})
			);
		}
		chart.update();
	}

	// div element
	const Div = styled('div')(({ theme }) => ({
		position: 'absolute',
		display: 'flex'
	}));

	// stack element
	const Item = styled('div')(({ theme }) => ({
		textAlign: 'center',
	}));

	return (
		<>
		<Stack>
			<Box
				position={'relative'}
				sx={{
					mx: 'auto',
				  width:'100%',
					height: '100%',
					'@media screen and (max-width:576px)':{
						fontSize:'13px'
					},
					'@media print and (min-width: 320px)': {
           marginTop: '80px',
					 fontSize:'14px'
         }
				}}
			>
				<Box
					display={'grid'}
					sx={{
						gridTemplateColumns: `${parseInt(value.xLow) + '%'} ${parseInt(value.xAverage) + '%'} ${
							parseInt(value.xHigh) + '%'
						}`,width: '100%',
					}}
				>
					<Box>
						<Div
							sx={{
								width: parseInt(value.xLow) + '%',
								height: parseInt(value.yLow) + '%',
								bottom: 0,
								justifyContent: 'flex-start',
								alignItems: 'center',
								zIndex:parseInt(value.xLow) === 0 ? 1 : '',
								left:parseInt(value.xLow) === 0 ? '-20px' : '',
								'&::before': {
									content: '"Low"',
									pl:1,
									display:parseInt(value.yLow) === 0 ? 'none' : ''
								},
								backgroundColor:red[300],
							}}
						>
						</Div>
						<Div
							sx={{
								width: parseInt(value.xLow) + parseInt(value.xAverage) + '%',
								height: parseInt(value.yAverage) + '%',
								bottom: parseInt(value.yLow) + '%',
								zIndex: 1,
								alignItems: 'center',
								display:parseInt(value.yAverage) === 0 ? 'none' : '',
								pl: 1,
								backgroundColor:orange.A200,
							}}
						>
							Average
						</Div>
						<Div
							bottom={parseInt(value.yAverage) + parseInt(value.yLow) + '%'}
							sx={{
								width: parseInt(value.xLow) + parseInt(value.xAverage) + '%',
								height: parseInt(value.yHigh) + '%',
								zIndex: 1,
								alignItems: 'center',
								display:parseInt(value.yHigh) === 0 ? 'none' : '',
								pl: 1,
								backgroundColor:yellow.A100,
							}}
						>
							High
						</Div>
					</Box>
					<Box>
						<Div
							sx={{
								width: parseInt(value.xAverage) + '%',
								bottom: 0,
								height: '100%',
								backgroundColor:orange.A200,
							}}
						>
						</Div>
					</Box>
					<Box>
						<Div
							sx={{
								width: parseInt(value.xHigh) + '%',
								bottom: 0,
								height: '100%',
								backgroundColor:yellow.A100,
							}}
						>
						</Div>
					</Box>
				</Box>
				<Bubble ref={chartRef} options={chartConfig} data={data} />
				<Stack position={'absolute'} flexDirection={'row'} width={'100%'}>
					<Item sx={{flexBasis:value.xLow+"%",display:parseInt(value.xLow) === 0 ? 'none' : ''}}>Low</Item>
					<Item sx={{flexBasis:value.xAverage+"%",display:parseInt(value.xAverage) === 0 ? 'none' : ''}}>Average</Item>
					<Item sx={{flexBasis:value.xHigh+"%",display:parseInt(value.xHigh) === 0 ? 'none' : ''}}>High</Item>
				</Stack>
			</Box>
			</Stack>
		</>
	);
}));

export default BarChart;
