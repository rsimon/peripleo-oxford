const toSortedArray = counts => {
  const entries = Object.entries(counts);
  entries.sort((a, b) => b[1] - a[1]);
  return entries;
}

export default class MetricFacet {

  constructor(name, type, path) {
    this.name = name;
    this.type = type;
    this.path = path;
  } 

  computeFacetDistribution = (items, postFilter) => {
    const counts = {};

    const facetedItems = items.map(item => {
      // Metrics object (via this.path)
      const stats = this.path.reduce((obj, segment) =>
        obj[segment], item);

      // Get keys and sum values
      for (const key in  stats) {
        const count = stats[key];
        counts[key] = counts[key] ? counts[key] + count : count;
      }

      return {
        ...item,
        _facet: {
          name: this.name,
          // TODO weight = total no. of speakers
          // TODO how to express ratios?
        }
      };
    });

    return {
      facet: this.name,
      counts: toSortedArray(counts),    
      items: postFilter ? facetedItems.filter(postFilter) : facetedItems
    };
  }

}