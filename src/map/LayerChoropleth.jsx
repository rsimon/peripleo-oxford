import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

const LayerChoropleth = props => {
  // Data points + count per data point
  const { counts, items } = props.search.facetDistribution;

  const [data, setData] = useState();

  useEffect(() => {
    fetch('layers/cy_first_level_admin_polygons.geojson')
      .then(res => res.json())
      .then(data => {
        const { features } = data;

        const random = {
          type: 'FeatureCollection',
          features: features.map(feature => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                weight: Math.random()
              }
            }
          })
        };

        console.log(random);

        setData(random);
      });
  }, []);

  return data ?
    <Source 
      type="geojson" 
      data={data}>
      <Layer 
        id="p6o-choropleth"
        type="fill"
        paint={{
          "fill-color": "#ff0000",
          "fill-opacity": ['get', 'weight']
        }}
      />
    </Source> : null;

}

export default LayerChoropleth;