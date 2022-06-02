import React, { useContext, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import bbox from '@turf/bbox';
import voronoi from '@turf/voronoi';
import intersect from '@turf/intersect';

import { FacetsContext } from '../state/search/FacetsContext';
import { SIGNATURE_COLOR } from '../Colors';

// Cf. http://www.formerspatial.com/voronoi
const generateVoronoiRegions = (counts, items, outline, colors) => {
  const currentFacets = counts.map(c => c[0]);

  const points = { type: 'FeatureCollection', features: items };

  const bounds = bbox(outline);
  const options = { bbox: bounds };

  const voronoiRegions = voronoi(points, options).features.map((feature, idx) => {
    const item = items[idx];

    const rel = item._facet.stats?.rel.length > 0 ? item._facet.stats.rel : null;

    const color = rel ?
      (colors ?
        colors[rel[0][0]] : SIGNATURE_COLOR[currentFacets.indexOf(rel[0][0])]) : '#a2a2a2';

    const opacity = rel ? item._facet.stats.rel[0][1] : 1;

    // Voronoi geometry, intersected with the outline feature
    const boundedGeometry = intersect(outline, feature);

    return {
      ...item,
      properties: {
        ...item.properties,
        color,
        opacity
      },
      geometry: boundedGeometry.geometry
    }
  });

  return {
    type: 'FeatureCollection',
    features: voronoiRegions
  };
}

const LayerChoroplethVoronoi = props => {

  const { availableFacets } = useContext(FacetsContext);

  const { counts, items } = props.search.facetDistribution;
  
  const [data, setData] = useState();

  useEffect(() => {
    fetch('layers/cy_island_boundary.geojson')
      .then(res => res.json())
      .then(geojson => {
        const outline = geojson.features[0];
        const preConfiguredColors = availableFacets.find(f => f.name === props.search.facet)?.colors;
        const voronoiRegions = generateVoronoiRegions(counts, items, outline, preConfiguredColors);
        setData(voronoiRegions);    
      });
  }, [props.search]);

  return data ?
    <Source 
      key={'choropleth-regions-' + props.index}
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

export default LayerChoroplethVoronoi;