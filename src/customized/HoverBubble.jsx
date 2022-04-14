import React, { useEffect, useState } from 'react';

const OFFSET = [15, 15];

const Hover = props => {

  const [ colors, setColors ] = useState();

  const [ counts, setCounts ] = useState();

  const { node, feature, config } = props;

  useEffect(() => {
    const  { colors }  = config.facets.find(f => f.name === 'speakers');
    setColors(colors);
  }, [ config ] );

  useEffect(() => {
    if (colors && node) {
      const counts = Object.keys(colors).map(key => (
        [key, node.properties[key]]
      ));
    
      counts.sort((a, b) => b[1] - a[1]);
      setCounts(counts);
    }
  }, [ colors, node ]);

  const style = {
    left: props.x + OFFSET[0], 
    top: props.y + OFFSET[1],
    borderWidth: !feature.properties.color && 0, 
    borderColor: feature.properties.color
  }

  return (
    <div
      className="p6o-map-hover p6o-prosodic-convergence-map-hover"
      style={style}>
      {node.title}

      {counts &&
        <ul>
          {counts.map(([key, val]) => 
            <li style={{ backgroundColor: colors[key] }} key={key}>{val.toLocaleString('en-US')}</li>
          )}
        </ul>
      } 
    </div> 
  )

}

export default Hover;