export default class MetricFacet {

  constructor(name, type, path) {
    this.name = name;
    this.type = type;
    this.path = path;
  } 

  computeFacetDistribution = (items, postFilter) => {
    return {
      facet: this.name,
      counts: [],    
      items: items
    };
  }

}