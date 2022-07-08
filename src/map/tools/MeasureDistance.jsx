import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import distance from '@turf/distance';

const MeasureDistance = props => {

  const [ from, setFrom ] = useState();
  const [ to, setTo ] = useState();

  const onMouseDown = evt => {
    const { clientX, clientY } = evt;
    setFrom({ x: clientX, y: clientY });
  }

  const onMouseMove = evt => {
    if (from) {
      const { clientX, clientY } = evt;
      setTo({ x: clientX, y: clientY });
    }
  }

  const onMouseUp = evt => {
    const { clientX, clientY } = evt;

    const point = ({lng, lat}) => [lng, lat];

    const f = point(props.map.unproject([from.x, from.y]));
    const t = point(props.map.unproject([clientX, clientY]));

    const d = distance(f, t);

    // Bonus feature: compute elevation difference via open-elevation.com
    fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${f[1]},${f[0]}|${t[1]},${t[0]}`)
      .then(res => res.json())
      .then(data => {
        const diff = data.results[1].elevation - data.results[0].elevation;
        
        alert(`Distance: ${d.toFixed(2)} km\nElevation difference: ${diff} m`);

        props.onClose();    
      });
  }

  return ReactDOM.createPortal(
    <div 
      className="p6o-tools-measure-distance"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}>
      <svg>
        <g>
          {from && to && 
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="black" strokeWidth={2} /> 
          }
        </g>
      </svg>
    </div>, 
    
    document.body
  )

}

export default MeasureDistance;