import React, { useState } from 'react';
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

  const [ selectedLayers, setSelectedLayers ] = useState(props.selectedLayers);

  const onToggleLayer = layer => {
    const updated = [ ...selectedLayers ];
    const index = updated.indexOf(layer);

    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(layer);
    }

    setSelectedLayers(updated);

    // Retain order of the original config file
    const ordered = props.layers.filter(l => updated.includes(l));
    props.onChangeLayers(ordered);
  }

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
            selected={selectedLayers.includes(layer)}
            label={layer.name} 
            onSelect={() => onToggleLayer(layer)} />
        )}
      </ul>
    </motion.div>
  )

}

export default MapLayersDropdown;