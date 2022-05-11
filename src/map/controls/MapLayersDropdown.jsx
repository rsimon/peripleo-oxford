import React from 'react';
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Layer = props => {

  return (
    <li 
      className={props.selected ? "p6o-map-layer" : "p6o-map-layer selected" }
      onClick={() => props.onSelect(props.label)}>
      {props.label} {props.selected ? <RiCheckboxCircleFill /> : <RiCheckboxBlankCircleLine /> }
    </li>
  )

}

const MapLayersDropdown = props => {

  console.log(props);

  return (
    <motion.div 
      key="map-layers"
      className="p6o-controls-dropdown"
      initial={{ maxWidth: 0 }}
      animate={{ maxWidth: 300 }}
      exit={{ maxWidth: 0 }}>
      <h1>Map layers:</h1>
      <ul>
        {props.layers.map(layer =>
          <Layer
            key={layer.name}
            selected={false}
            label={layer.name} 
            onSelect={() => console.log('select')} />
        )}
      </ul>
    </motion.div>
  )

}

export default MapLayersDropdown;