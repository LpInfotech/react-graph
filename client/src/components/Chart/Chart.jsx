import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
	Chart as ChartJS,
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'react-chartjs-2';
import { useEffect } from 'react';

// register controller
ChartJS.register(
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController,
	ChartDataLabels
);

// chart config
const config = {
	categoryPercentage: 100,
	barPercentage: 100,
	indexAxis: 'y',
	plugins: {
		legend: {
			display: false
		},
		title: {
			display: true
		},
		tooltip: {
			filter: (tooltipItem) => tooltipItem.datasetIndex === 0
		}
	},
	responsive: true,
	scales: {
		x: {
			beginAtZero: true,
			stacked: true,
			grid: {
				display: false
			}
		},
		y: {
			stacked: true,
			title: { display: false, text: 'Value' },
			grid: {
				display: false
			}
		}
	}
};

const BarChart = forwardRef(function BarChart({ value }, ref) {
	const [options, setOptions] = useState(config);
	const initialData = {
		datasets: [
			{
				type: 'bubble',
				backgroundColor: 'rgba(53, 162, 235, 1)',
				borderWidth: 1,
				fill: false,
				data: [
					{ x: 85, y: 30, r: 10,label:1},
					{ x: 20, y: 20, r: 10,label:2},
					{ x: 15, y: 45, r: 10,label:3 },
					{ x: 15, y: 95, r: 10,label:4 }
				]
			},
			{
				type: 'bar',
				label: 'Low',
				backgroundColor: 'rgba(255,0,0,0.4)',
				data: [{ x:value.view === 'y' ? value.low : 0, y:value.view === 'x' ? value.low : 0,label:'Low'}]
			},
			{
				type: 'bar',
				label: 'Average',
				backgroundColor: 'rgba(255,255,0,0.4)',
				data: [{ x:value.view === 'y' ? value.average : 0, y:value.view === 'x' ? value.average : 0,label:'Average'}],
				options: {
					tooltip: {
						enabled: false
					}
				}
			},
			{
				type: 'bar',
				label: 'High',
				backgroundColor: 'rgba(0,128,0,0.4)',
				data: [{ x:value.view === 'y' ? value.high : 0, y:value.view === 'x' ? value.high : 0,label:'High'}],
				options: {
					tooltips: {
						enabled: false
					}
				}
			}
		]
	};
	const [data, setData] = useState(initialData);
	const chartRef = useRef(null);

	useImperativeHandle(ref, () => {
		return {
			update() {
				setOptions({ ...options, indexAxis: value.view }); 
				setData(initialData);
				chartRef.current.update();
			}
		};
	});

	// const handleClick = () => {
	// 	setOptions({ ...options, indexAxis: options.indexAxis === 'x' ? 'y' : 'x' });
	// 	data.datasets
	// 		.filter((el) => el.type !== 'bubble')
	// 		.forEach((el) => {
	// 			if (options.indexAxis === 'x') {
	// 				el.data[0].x = el.data[0].y;
	// 				el.data[0].y = 0;
	// 			} else {
	// 				el.data[0].y = el.data[0].x;
	// 				el.data[0].x = 0;
	// 			}
	// 		});
	// 	// chartRef.current.update()
	// };



	return (
		<>
			<Chart ref={chartRef} type="bubble" options={options} data={data} />
		</>
	);
});

export default BarChart;
