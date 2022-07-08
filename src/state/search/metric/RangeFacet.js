export default class RangeFacet {

  constructor(name, type, property, buckets, colors) {
    this.name = name;
    this.type = type;
    this.property = property;
    this.buckets = buckets;
    this.colors = colors;

    console.log('colors', colors);
  } 

  computeFacetDistribution = (items, postFilter) => {
    const bucketLabels = this.buckets.map(b => `${b[0]}-${b[1]}`);
    const counts = bucketLabels.map(label => ([ label, 0]));

    const facetedItems = items.map(item => {
      const value = item.properties[this.property] || 0;
      
      let bucketIdx = this.buckets.findIndex(b => value >= b[0] && value < b[1]); 
      if (bucketIdx === -1)
        bucketIdx = this.buckets.length - 1;
    
      const label = bucketLabels[bucketIdx];

      counts[bucketIdx][1]++;

      return {
        ...item,
        _facet: {
          name: this.name,
          values: [ label ]
        }
      };
    });

    return {
      facet: this.name,
      counts,
      items: facetedItems
    };
  }

}