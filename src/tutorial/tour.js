const tour = [{
  target: '.p6o-hud-timeline',
  title: 'The timeline',
  content: 'Click the buttons on the timeline to explore data from different years.',
  disableBeacon: true
},{
  target: '.p6o-facets',
  title: 'The filter panel',
  content: 'The filter panel allows you to explore different dimensions in the data.',
  disableBeacon: true
},{
  target: '.p6o-facets-carousel',
  content: 'You can toggle between different filter dimensions with the arrow buttons.',
  disableBeacon: true
},{
  target: '.p6o-facets ul',
  content: 'Click the labels to set a filter, and hide other categories from the map.',
  disableBeacon: true
},{
  target: '.p6o-map-modes',
  content: 'Select between different point- and area-display styles for the map data.',
  disableBeacon: true
},{
  target: '.p6o-map-layers',
  content: 'Choose additional map backgrounds and overlays from the layers menu.',
  disableBeacon: true
}, {
  target: '.p6o-measure-distance',
  content: 'The measurement utility allows you to measure distance and altitude difference between two points on the map. Click the tool once, and the click and drag somewhere on the map.',
  disableBeacon: true
},{
  target: 'body',
  placement: 'center',
  title: 'That\'s it!',
  content: 'Thanks for taking the time. Have fun exploring our prototype mapping prototype.'
}];

export default tour;