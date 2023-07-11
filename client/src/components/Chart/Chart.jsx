import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'react-chartjs-2';

// register controller
ChartJS.register(
	LinearScale,
	PointElement,
	Legend,
	Tooltip,
	ChartDataLabels,
);

// chart config
const config = {
  maintainAspectRatio: true,
	responsive: true,
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
			// filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
			callbacks: {
				label: (tooltipItems) => {
					return (tooltipItems.raw?.label + " " + tooltipItems.raw?.name?.can_nombre) || tooltipItems.raw?.label;
				}
			}
		}
	},
	scales: {

		x: {
			title: { display: false, text: '9 Box' },
			beginAtZero: true,
			min:0,
			max:101,
			grid: {
				display: false,
				drawOnChartArea:false,
				drawBorder:false,
				drawTicks:false,
				lineWidth:0,
				textStrokeWidth:0
			},
			ticks: {
				display: false
			},
			border:{
				display:false,
			 },
		},
		y: {
			beginAtZero: true,
			title: { display: false, text: '9 Box' },
			min:0,
			max:101,
			grid: {
				display: false,
				drawOnChartArea:false,
				drawBorder:false,
				drawTicks:false,
				lineWidth:0,
				textStrokeWidth:0
			},
			border:{
			 display:false,
			},
			ticks: {
				display: false
			}
		}
	}
};

const BarChart = forwardRef(function BarChart({ values, bubblePosition, view, colors }, ref) {
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
			// {
			// 	type: 'bar',
			// 	label: 'Low',
			// 	backgroundColor: 'rgba(255,0,0,0.4)',
			// 	data: [{ x: view === 'y' ? value.verticalLow : 0, y: view === 'x' ? value.horizontalLow : 0, label: 'Low' }]
			// },
			// {
			// 	type: 'bar',
			// 	label: 'Average',
			// 	backgroundColor: 'rgba(255,255,0,0.4)',
			// 	data: [
			// 		{
			// 			x: view === 'y' ? value.verticalAverage : 0,
			// 			y: view === 'x' ? value.horizontalAverage : 0,
			// 			label: 'Average'
			// 		}
			// 	],
			// 	options: {
			// 		tooltip: {
			// 			enabled: false
			// 		}
			// 	}
			// },
			// {
			// 	type: 'bar',
			// 	label: 'High',
			// 	backgroundColor: 'rgba(0,128,0,0.4)',
			// 	data: [{ x: view === 'y' ? value.verticalHigh : 0, y: view === 'x' ? value.horizontalHigh : 0, label: 'High' }],
			// 	options: {
			// 		tooltips: {
			// 			enabled: false
			// 		}
			// 	}
			// }
		]
	};

	const [data, setData] = useState(initialData);
	const chartRef = useRef(null);

	const [value,setValue] = useState({
    xLow:30,
    xAverage:30,
    xHigh:40,
    yLow:50,
    yAverage:30,
    yHigh:20  
  })

const handleChange = (e) => {
  setValue({...value,[e.target.name]:e.target.value})
}

	useImperativeHandle(ref, () => {
		return {
			update() {
				setData(initialData);
				chartRef.current.update();
			},
			print(){
					triggerHover(chartRef.current)
			}
		};
	});

	// chart ref update index
	// if (view !== options.indexAxis && chartRef.current) {
	// 	setOptions({ ...options, indexAxis: view });
	// 	chartRef.current.update();
	// }

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


	console.log(chartRef?.current,)


	return (
		<>
		<div style={{marginBottom:'32px',display:'flex',alignItems: 'center',justifyContent: 'space-between',flexWrap:'wrap'}}>
		<input type="text" name="xLow" onChange={(e)=>handleChange(e)} placeholder="xLow" value={value.xLow} />
		<input type="text" name="xAverage" onChange={(e)=>handleChange(e)} placeholder="xAverage" value={value.xAverage} />
		<input type="text" name="xHigh" onChange={(e)=>handleChange(e)} placeholder="xHigh" value={value.xHigh} />
		<input type="text" name="yLow" onChange={(e)=>handleChange(e)} placeholder='yLow' value={value.yLow}/>
		<input type="text" name="yAverage" onChange={(e)=>handleChange(e)} placeholder='yAverage' value={value.yAverage}/>
		<input type="text" name="yHigh" onChange={(e)=>handleChange(e)} placeholder='yHigh' value={value.yHigh}/>
		</div>

		<div style={{position:'relative',overflow:'hidden',marginInline:'auto',minWidth:chartRef?.current?.chartArea?.width,minHeight:chartRef?.current?.chartArea.height,width:window.innerWidth - 80 +"px"}}>
		<div className="wrapper" style={{gridTemplateColumns:`${value.xLow + "%"} ${value.xAverage+ "%"} ${value.xHigh+ "%"}`}}>
		<div>
			<div className='low' style={{width:parseInt(value.xLow) + "%",height:parseInt(value.yLow) + "%",bottom:'0px'}}>1</div>
			<div className='average' style={{bottom:parseInt(value.yLow)+"%",	width:parseInt(value.xLow)+parseInt(value.xAverage) + "%",zIndex:1,height:parseInt(value.yAverage)+"%"}}>2</div>
			<div style={{bottom:parseInt(value.yAverage)+parseInt(value.yLow)+"%",width:parseInt(value.xLow)+parseInt(value.xAverage) + "%",zIndex:1,height:parseInt(value.yHigh)+"%"}} className='high'>3</div>
			</div>
			<div>
			<div className='average' style={{width:parseInt(value.xAverage)+"%"}}>4</div>
			</div>
			<div>
			<div className='high' style={{width:parseInt(value.xHigh)+"%"}}>7</div>
			</div>
		</div>
		<Chart ref={chartRef}  type="bubble" options={options} data={data} />
		</div>
		</>)

});

export default BarChart;
