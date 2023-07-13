import React,{useState} from 'react'
import './tet.css'

function ChartLayout() {
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

// style={{marginBottom:'32px',display:'flex',alignItems: 'center',justifyContent: 'space-between',flexWrap:'wrap'}}
  return (
    <>
    <div >
<input type="text" name="xLow" onChange={(e)=>handleChange(e)} placeholder="xLow" value={value.xLow} />
<input type="text" name="xAverage" onChange={(e)=>handleChange(e)} placeholder="xAverage" value={value.xAverage} />
<input type="text" name="xHigh" onChange={(e)=>handleChange(e)} placeholder="xHigh" value={value.xHigh} />
<input type="text" name="yLow" onChange={(e)=>handleChange(e)} placeholder='yLow' value={value.yLow}/>
<input type="text" name="yAverage" onChange={(e)=>handleChange(e)} placeholder='yAverage' value={value.yAverage}/>
<input type="text" name="yHigh" onChange={(e)=>handleChange(e)} placeholder='yHigh' value={value.yHigh}/>
</div>

<div className="wrapper" style={{	gridTemplateColumns:`${value.xLow + "%"} ${value.xAverage+ "%"} ${value.xHigh+ "%"}`,display:'none'}}>
test
</div>
</>
  )
}

export default ChartLayout




