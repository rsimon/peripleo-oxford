import React, { useContext, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import pointInPolygon from '@turf/boolean-point-in-polygon';

import { FacetsContext } from '../state/search/FacetsContext';
import { SIGNATURE_COLOR } from '../Colors';

const buildRegions = (counts, items, regions, colors) => {

  const itemsPerRegion = {};

  for (const item of items) {
    const region = regions.find(region =>
      pointInPolygon(item.geometry.coordinates, region));

    if (region) {
      if (itemsPerRegion[region.id]) {
        itemsPerRegion[region.id].push(item);
      } else {
        itemsPerRegion[region.id] = [item];
      }
    }
  }

  const aggregated = Object.entries(itemsPerRegion).map(([id, items]) => {
    const region = regions.find(region => region.id === id);

    const abs = items.reduce((agg, item) => {
      if (item._facet.stats?.abs.length > 0) {
        const counts = item._facet.stats.abs;

        for (const [label, count] of counts) {
          if (agg[label]) {
            agg[label] += count;
          } else {
            agg[label] = count;
          }
        }
      } 
      
      return agg;
    }, {});

    const sorted = Object.entries(abs);
    sorted.sort((a, b) => b[1] - a[1]);

    const currentFacets = counts.map(c => c[0]);

    const topValue = sorted.length > 0 ? sorted[0][0] : null;
    const totalCount = sorted.reduce((total, [, count]) => total + count, 0);

    const color = topValue ? 
      colors ? colors[topValue] : SIGNATURE_COLOR[currentFacets.indexOf(topValue)] : 
      '#a2a2a2';
    
    const opacity = sorted.length > 0 ? sorted[0][1] / totalCount : 1;

    return {
      ...region,
      properties: {
        ...region.properties,
        color,
        opacity
      }
    }
  });

  return aggregated;
}

const LayerChoropleth = props => {

  const { availableFacets } = useContext(FacetsContext);
  
  const { counts, items } = props.search.facetDistribution;

  const [data, setData] = useState();

  useEffect(() => {
    fetch('layers/cy_first_level_admin_polygons.geojson')
      .then(res => res.json())
      .then(geojson => {
        const { features } = geojson;

        const preConfiguredColors = availableFacets.find(f => f.name === props.search.facet)?.colors;

        const data = buildRegions(counts, items, features, preConfiguredColors);
        setData({
          type: 'FeatureCollection',
          features: data
        });
      });
  }, [props.search]);

  return data ?
    <Source 
      type="geojson" 
      data={data}>
      <Layer 
        id="p6o-choropleth"
        type="fill"
        paint={{
          "fill-color": ['get', 'color'],
          "fill-opacity": ['get', 'opacity']
        }}
      />
    </Source> : null;

}

export default LayerChoropleth;