export default class RangeFacet {

  constructor(name, type, property, buckets) {
    this.name = name;
    this.type = type;
    this.property = property;
    this.buckets = buckets;
  } 

  computeFacetDistribution = (items, postFilter) => {
    console.log('computing range facet distribution');

    const facetedItems = items.map(item => {

      return {
        ...item,
        _facet: {
          name: this.name
        }
      };
    });

    return {
      facet: this.name,
      counts: [], 
      items: facetedItems
    };
  }

}