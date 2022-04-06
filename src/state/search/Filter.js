const evalNestedFieldFilter = (allowedValues, path) => item => {

  const getValueRecursive = (obj, p) => {
    const [ nextSegment, ...pathRest ] = p;

    const value = obj[nextSegment];
    if (pathRest.length === 0 || !value) {
      return value;
    } else {
      return Array.isArray(value) ?
        value.map(obj => getValueRecursive(obj, pathRest)): 
        getValueRecursive(value, pathRest);
    }
  };

  const v = getValueRecursive(item, path);
  const values = Array.isArray(v) ? v : [ v ];
  
  return !!allowedValues.find(allowedValue => values.indexOf(allowedValue) > -1);
}

const evalCustomFnFilter = (allowedValues, fn) => item =>
  allowedValues.indexOf(fn(item)) > -1;

const evalSimpleFieldFilter = (allowedValues, field) => item =>  {
  const v = item[field];
  const values = Array.isArray(v) ? v : [ v ];

  return !!allowedValues.find(allowedValue => values.indexOf(allowedValue) > -1);
}

export default class Filter {

  constructor(facet, arg) {
    this.facet = facet;
    this.values = Array.isArray(arg) ? arg : [ arg ];
  }

  equals = filter =>
    filter.facet === this.facet && filter.value === this.value;

  executable = facets => {
    const facet = facets.find(f => f.name === this.facet);

    if (facet.type?.startsWith('metric')) 
      return facet.evalMetricFacetFilter(this.values);
    if (Array.isArray(facet.definition))
      return evalNestedFieldFilter(this.values, facet.definition);
    else if (facet.definition instanceof Function)
      return evalCustomFnFilter(this.values, facet.definition);
    else 
      return evalSimpleFieldFilter(this.values, facet.definition);
  }

}
