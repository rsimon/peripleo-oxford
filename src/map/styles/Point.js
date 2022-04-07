export const pointStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': args?.radius || 4,
    'circle-color': args?.fill || '#fff',
    'circle-stroke-color': args?.stroke || '#000',
    'circle-stroke-width': args?.strokeWidth || 1
  }
});

export const pointCategoryStyle = args => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['get','weight'],
      args.minWeight, 4,
      args.maxWeight, 35
    ],
    'circle-color': ['get', 'color'],
    'circle-opacity': ['get', 'opacity'],
    'circle-stroke-color': args?.stroke || ['get', 'color-dark'],
    'circle-stroke-width': args?.strokeWidth || 1,
    'circle-stroke-opacity': ['get', 'opacity']
  }
});
