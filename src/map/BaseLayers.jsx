import React from 'react';
import { Source, Layer } from 'react-map-gl';

import { geojsonLineStyle } from './styles/BackgroundLayers';

const parseRasterConfig = (config, idx) => (
  <Source
    key={config.name + idx}
    type="raster"
    scheme={config.scheme}
    tiles={config.tiles}
    tileSize={config.tileSize}
    attribution={config.attribution}>

    <Layer
      type="raster"
      minzoom={config.minzoom || 0}
      maxzoom={config.maxzoom  || 24} />
  </Source>
)

const parseGeoJSONConfig = (config, idx) => (
  <Source 
    key={config.name + idx}
    type="geojson" 
    data={config.src}>

    <Layer
      {...geojsonLineStyle(config.color)} />

  </Source>
)

export const parseLayerConfig = (config, idx) => {
  if (config.type === 'raster') {
    return parseRasterConfig(config, idx);
  } else if (config.type === 'geojson') {
    return parseGeoJSONConfig(config, idx);
  }
}