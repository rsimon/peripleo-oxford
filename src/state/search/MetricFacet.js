const toSortedArray = counts => {
  const entries = Object.entries(counts);
  entries.sort((a, b) => b[1] - a[1]);
  return entries;
}

export default class MetricFacet {

  constructor(name, type, properties, colors) {
    this.name = name;
    this.type = type;
    this.properties = new Set(properties);

    this.colors = colors;
  } 

  computeFacetDistribution = (items, postFilter) => {
    const counts = {};

    let minWeight = Infinity;
    let maxWeight = -Infinity;

    const facetedItems = items.map(item => {
      const stats = Object.entries(item.properties)
        .filter(entry => this.properties.has(entry[0]));
      
      stats.sort((a, b) => b[1] - a[1]);

      stats.forEach(([key, count]) =>
        counts[key] = counts[key] ? counts[key] + count : count);

      // Total count across all keys
      const weight = stats.reduce((sum, t) => sum + t[1], 0);

      if (weight > maxWeight)
        maxWeight = weight;

      if (weight < minWeight)
        minWeight = weight;

      // Stats as proportion relative to weight
      const statsRelative = stats.map(entry => [ entry[0], entry[1] / weight ]);

      return {
        ...item,
        _facet: {
          name: this.name,
          weight,
          stats: {
            abs: stats,
            rel: statsRelative
          }
        }
      };
    });

    const filteredItems = facetedItems.filter(i => i._facet.weight > 0);
    
    return {
      facet: this.name,
      counts: toSortedArray(counts), 
      minWeight, maxWeight,   
      items: postFilter ? filteredItems.filter(postFilter) : filteredItems
    };
  }

  evalMetricFacetFilter = values => item => {    
    const matches = values.map(prop => ([
      prop,
      item.properties[prop] || 0
    ])).filter(t => t[1] > 0);

    // Sum of all matched quantities
    const sum = matches.reduce((sum, t) => sum + t[1], 0);
    return matches.length > 0 ? { sum } : false;
  }

}