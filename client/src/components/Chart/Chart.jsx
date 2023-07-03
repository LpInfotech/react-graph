import React, { forwardRef,useImperativeHandle, useRef, useState} from 'react';

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
	BarController,
	RadialLinearScale,
	LogarithmicScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart} from 'react-chartjs-2';


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
	ChartDataLabels,
	RadialLinearScale,
	LogarithmicScale
);

// chart config
const config = {
	maintainAspectRatio: true,
	categoryPercentage: 100,
	barPercentage: 100,
	indexAxis: 'y',
	interaction: {
		mode: 'nearest'
},
	plugins: {
		datalabels: {
				font: {
						size: 16.5,
						weight:600
				},
		},
		legend: {
			display: false,
		},
		title: {
			display: true
		},
		tooltip: {
			filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
			callbacks: {
				label: (tooltipItems) => {
					return tooltipItems.raw.name[0].can_nombre;
				},
			}
		},
	},
	responsive: true,
	scales: {
		x: {
			title: { display: true, text: '9 Box' },
			beginAtZero: true,
			stacked: true,
			grid: {
				display: false
			},
			ticks: {
				display: false,
		}
		},
		y: { 
			stacked: true,
			title: { display: true, text: '9 Box' },
			grid: {
				display: false
			},
			ticks: {
				display: false,
		},
		}
	}
};

const BarChart = forwardRef(function BarChart({value,bubblePosition}, ref) {
	const [options, setOptions] = useState(config);

	const initialData = {
		datasets: [
			{
				type: 'bubble',
				backgroundColor: 'rgba(53, 162, 235, 1)',
				borderWidth: 1,
				fill: false,
				data: [bubblePosition]
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
			},
		};
	});

	return (
		<>
			<Chart ref={chartRef} type="bubble" options={options} data={data} />
		</>
	);
});

export default BarChart;
