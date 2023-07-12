import React, { forwardRef, useImperativeHandle, useRef, useState,memo } from 'react';
import { chartConfig } from '../../config';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bubble } from 'react-chartjs-2';
import { orange,red,yellow } from '@mui/material/colors';

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
				chartRef?.current.resize(750,750);
			}
		};
	});

	// before print
	window.addEventListener('beforeprint', () => {
		if (chartRef.current !== null) {
			chartRef?.current.resize(750,750);
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

	const Div = styled('div')(({ theme }) => ({
		position: 'absolute',
		display: 'flex'
	}));

	return (
		<>
			<Box
				position={'relative'}
				overflow={'hidden'}
				sx={{
					mx: 'auto',
				  width:'100%',
					height: '100%',
					'@media print and (min-width: 320px)': {
           marginTop: '80px'
         }
				}}
			>
				<Box
					display={'grid'}
					sx={{
						gridTemplateColumns: `${parseInt(value.xLow) + '%'} ${parseInt(value.xAverage) + '%'} ${
							parseInt(value.xHigh) + '%'
						}`,width: '100%',overflow:'hidden'
					}}
				>
					<Box>
						<Div
							sx={{
								width: parseInt(value.xLow) + '%',
								height: parseInt(value.yLow) + '%',
								bottom: 0,
								justifyContent: 'center',
								alignItems: 'flex-end',
								'&.low::before': {
									content: '"Low"',
									position:'absolute',
									top:'50%',
									left: 10,
								},
								backgroundColor:red[300],
							}}
						>
							Low
						</Div>
						<Div
							sx={{
								width: parseInt(value.xLow) + parseInt(value.xAverage) + '%',
								height: parseInt(value.yAverage) + '%',
								bottom: parseInt(value.yLow) + '%',
								zIndex: 1,
								alignItems: 'center',
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
								justifyContent: 'center',
								alignItems: 'flex-end',
								bottom: 0,
								height: '100%',
								backgroundColor:orange.A200,
							}}
						>
							Average
						</Div>
					</Box>
					<Box>
						<Div
							sx={{
								width: parseInt(value.xHigh) + '%',
								justifyContent: 'center',
								alignItems: 'flex-end',
								bottom: 0,
								height: '100%',
								backgroundColor:yellow.A100,
							}}
						>
							High
						</Div>
					</Box>
				</Box>
				<Bubble ref={chartRef} options={chartConfig} data={data} />
			</Box>
		</>
	);
}));

export default BarChart;
