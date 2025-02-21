export const clusterPointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'point_count'],
      2,
      8,
      300,
      40
    ],
    'circle-color': args?.fill || 'red',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});

export const clusterLabelStyle = args => ({
  'type': 'symbol',
  'filter': ['has', 'point_count'],
  'layout': {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
});