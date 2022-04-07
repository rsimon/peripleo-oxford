import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

import { lighten, SIGNATURE_COLOR } from '../Colors';

import { pointStyle, pointCategoryStyle } from './styles/Point';
import { clusterPointStyle, clusterLabelStyle } from './styles/Clusters';
import { colorHeatmapCoverage, colorHeatmapPoint } from './styles/Heatmap';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const getLayers = facetDistribution => {
  const { counts, items } = facetDistribution;

  const topValues = counts.slice(0, 8).map(t => t[0]);

  // For every feature, we'll check the facet value, and assign it 
  // to the first layer it matches. In other words: the feature will
  // get the color of the most common facet value.
  const layers = Object.fromEntries(topValues.map(label => [ label, [] ]));
  const unassigned = [];

  items.forEach(item => {
    const values = item._facet?.values || [];

    const firstMatch = topValues.find(l => values.indexOf(l) > -1);
    if (firstMatch)
      layers[firstMatch].push(item);
    else
      unassigned.push(item);
  });

  // Map to array of entries + legend color
  const getColor = label => SIGNATURE_COLOR[topValues.indexOf(label)];
  
  const arr = Object.entries(layers)
    .filter(t => t[1].length > 0)
    .map(t => [...t, getColor(t[0])]);

  arr.sort((a, b) => a[1].length - b[1].length);

  return [
    ...arr,
    ['__unassigned', unassigned, '#a2a2a2' ]
  ].slice().reverse(); // Largest layer at bottom
}

const LayersCategorized = props => {

  const [ features, setFeatures ] = useState();

  const [ layers, setLayers ] = useState();

  useEffect(() => {
    if (props.selectedMode === 'heatmap') {
      setLayers(getLayers(props.search.facetDistribution));       
    } else {
      const { counts, items, minWeight, maxWeight } = props.search.facetDistribution;

      console.log(props.search.maxWeight, props.search.minWeight);

      // Just the facet value labels, in order of the legend
      const currentFacets = counts.map(c => c[0]);

      // Current filter on this facet, if any
      const currentFilter = props.search.filters.find(f => 
        f.facet === props.search.facet);

      // Colorize the features according to their facet values
      const colorized = items.map(feature => {
        // Facet values assigned to this feature
        const values = feature._facet ? (
          feature._facet.values || feature._facet.stats?.rel.map(t => t[0]) || []
        ) : [];
        
        // Color the feature by the top facet *that's currently active*!
        // That means: we need to use different colors depending on whether
        // there's currently a filter set on this facet
        const topValue = values.find(value =>     
          currentFilter ?
            currentFilter.values.indexOf(value) > -1 :
            currentFacets.indexOf(value) > -1);

        const weight = feature._facet?.stats ? (
          currentFilter ?
            feature._facet.stats.abs.reduce((sum, t) => {
              return currentFilter.values.indexOf(t[0]) >= 0 ?
                sum + t[1] : sum
            }, 0) : feature._facet.weight
        ) : feature.properties.weight;

        let color = topValue ?
          SIGNATURE_COLOR[currentFacets.indexOf(topValue)] : '#a2a2a2';
        
        if (feature._facet.stats?.rel.length > 0)
          color = lighten(color, 1 - feature._facet.stats.rel[0][1]);

        return {
          ...feature,
          properties: {
            ...feature.properties,
            color, weight
          }
        }
      });

      setFeatures(colorized);
    }
  }, [ props.search, props.facet, props.selectedMode ])

  return (
    <>
      {props.selectedMode === 'points' &&
        <Source type="geojson" data={toFeatureCollection(features)}>
          <Layer 
            id="p6o-points"
            {...pointCategoryStyle()} />
        </Source>
      } 

      {props.selectedMode === 'clusters' && 
        <Source 
          type="geojson" 
          cluster={true}
          data={toFeatureCollection(features)}>

          <Layer 
            {...clusterPointStyle()} />

          <Layer  
            {...clusterLabelStyle()} />

          <Layer 
            id="p6o-points"
            filter={['!', ['has', 'point_count']]}
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>
      }

      {props.selectedMode === 'heatmap' &&
        layers?.map(([layer, features, color]) => 
          <Source key={layer} type="geojson" data={toFeatureCollection(features)}>
            <Layer
              id={`p6o-heatmap-${layer}`}
              {...colorHeatmapCoverage(color)} />
          
            <Layer
              id={`p6o-points-${layer}`}
              {...colorHeatmapPoint(color)} /> 
          </Source>
        )
      }
    </>
  )

}

export default LayersCategorized;