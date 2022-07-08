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

    const point = ({lng, lat}) => ({
      type: 'Point',
      coordinates: [lng, lat]
    });

    const fromCoord = point(props.map.unproject([from.x, from.y]));
    const toCoord = point(props.map.unproject([clientX, clientY]));

    const d = distance(fromCoord, toCoord);

    alert(`Distance: ${d.toFixed(2)} km`);

    props.onClose();
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