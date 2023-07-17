// import React from 'react';
// import {
//   Chart as ChartJS,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bubble } from 'react-chartjs-2';
// const nineGridLabels = {
//   id: 'nineGridLabels',
//   beforeDatasetsDraw:((chart,args,plugin)=>{
//     const {ctx,chartArea:{top,bottom,left,right,width},scales:{x,y}}= chart;

//     const nineLabels = {labels:[
//       {
//       name:'A1',x:16.65,y:16.65
//     },{
//       name:'A2',x:16.65,y:49.95
//     }
//     ,{
//       name:'A3',x:16.65,y:83.25
//     },
//     {
//       name:'B1',x:49.95,y:16.65
//     },{
//       name:'B2',x:49.95,y:49.95
//     }
//     ,{
//       name:'B3',x:49.95,y:83.25
//     },
//     {
//       name:'C1',x:83.25,y:16.65
//     },{
//       name:'C2',x:83.25,y:49.95
//     }
//     ,{
//       name:'C3',x:83.25,y:83.25
//     }
  
//   ]}

//   console.log(x,y)

//     ctx.save();
//     ctx.font = "bold 12px";
//     ctx.fillStyle = "rgb(102,102,102)";
//     ctx.textAlign = "center";

//     nineLabels.labels.forEach((label,index) => {
//       ctx.fillText(label.name,x.getPixelForValue(label.x),y.getPixelForValue(label.y),);
    
//     })
   
//   })

// }


// ChartJS.register(
//   nineGridLabels,
//   LinearScale,
//   PointElement,
//   Legend,
//   Tooltip,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const labels = ['January', 'February', 'March',];


// const config = {
// 	plugins: {
// 		legend: {
// 			display: false
// 		},
// 		title: {
// 			display: true
// 		},
// 		// tooltip: {
// 		// 	filter: (tooltipItem) => tooltipItem.datasetIndex === 0
// 		// }
// 	},
// 	responsive: true,
//   aspectRatio:1,
// 	scales: {
// 		// x: {
//     //   max:100,
//     //   min:0,
// 		// 	beginAtZero: true,
// 		// 	stacked: true,
// 		// 	grid: {
// 		// 		display: true
// 		// 	}
// 		// },
//     x:{
//       min:0,
//       beginAtZero: true,
// 			grid: {
// 				drawTicks: false,
// 			},
//       afterTickToLabelConversion: (ctx)=>{
//         console.log(ctx)
//         ctx.ticks =[];
//         ctx.ticks.push({value:33.33,label:'a'})
//         ctx.ticks.push({value:66.66,label:'b'})
//        },
//        border:{
//         width:2,
//        },
//        title:{display:true,text:'Potential'}
       
//     },
// 		y: {
//       min:0,
//       beginAtZero: true,
// 			grid: {
// 				drawTicks: false,
// 			},
//       afterTickToLabelConversion: (ctx)=>{
//         console.log(ctx)
//         ctx.ticks =[];
//         ctx.ticks.push({value:33.33,label:'a'})
//         ctx.ticks.push({value:66.66,label:'b'})
//        },
//        border:{
//         width:2,
//        },
//        title:{display:true,text:'Impact'}

// 		}
// 	},
// };

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'bubbles',
//       backgroundColor: 'rgb(53,192,132)',
//       data:[{label:1,x:100,y:100 ,r:10}],
//     },
//   ],
// };

// export default function MultiChart() {
//   return <Bubble options={config} data={data}/>
// }
