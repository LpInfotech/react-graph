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
	BarController,
	RadialLinearScale,
	LogarithmicScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'react-chartjs-2';

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
	// maintainAspectRatio: true,
	responsive: true,
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
				weight: 600
			},
			color: (context, args) => {
				return ['#3e2723', '#01579b', '#1b5e20'];
			}
		},
		legend: {
			display: false
		},
		title: {
			display: true
		},
		tooltip: {
			filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
			callbacks: {
				label: (tooltipItems) => {
					return (tooltipItems.raw?.label + " " + tooltipItems.raw?.name?.can_nombre) || tooltipItems.raw?.label;
				}
			}
		}
	},
	scales: {
		x: {
			title: { display: true, text: '9 Box' },
			beginAtZero: true,
			stacked: true,
			grid: {
				display: false
			},
			ticks: {
				display: false
			}
		},
		y: {
			stacked: true,
			title: { display: true, text: '9 Box' },
			grid: {
				display: false
			},
			ticks: {
				display: false
			}
		}
	}
};

const BarChart = forwardRef(function BarChart({ value, bubblePosition, view, colors }, ref) {
	const [options, setOptions] = useState(config);

	const initialData = {
		datasets: [
			{
				type: 'bubble',
				backgroundColor: colors,
				borderWidth: 1,
				fill: false,
				data: bubblePosition
			},
			{
				type: 'bar',
				label: 'Low',
				backgroundColor: 'rgba(255,0,0,0.4)',
				data: [{ x: view === 'y' ? value.verticalLow : 0, y: view === 'x' ? value.horizontalLow : 0, label: 'Low' }]
			},
			{
				type: 'bar',
				label: 'Average',
				backgroundColor: 'rgba(255,255,0,0.4)',
				data: [
					{
						x: view === 'y' ? value.verticalAverage : 0,
						y: view === 'x' ? value.horizontalAverage : 0,
						label: 'Average'
					}
				],
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
				data: [{ x: view === 'y' ? value.verticalHigh : 0, y: view === 'x' ? value.horizontalHigh : 0, label: 'High' }],
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
				setOptions({ ...options, indexAxis: view });
				setData(initialData);
				chartRef.current.update();
			},
			print(){
					triggerHover(chartRef.current)
			}
		};
	});

	// chart ref update index
	if (view !== options.indexAxis && chartRef.current) {
		setOptions({ ...options, indexAxis: view });
		chartRef.current.update();
	}

// before print 
	window.addEventListener('beforeprint', () => {
		if (chartRef.current !== null) {
			chartRef.current.resize(800, 1200);
		}
	});

	// after print 
	window.addEventListener('afterprint', () => {
		if (chartRef.current !== null) {
			chartRef.current.resize();
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


	return (
				<Chart ref={chartRef} type="bubble" options={options} data={data} />);
});

export default BarChart;
