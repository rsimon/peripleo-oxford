import SumFacet from './metric/SumFacet';
import RangeFacet from './metric/RangeFacet';

const create = definition => {

  if (definition.type === 'metric.sum') {
    return new SumFacet(definition.name, definition.type, definition.properties, definition.colors);
  } else if (definition.type === 'metric.range') {
    return new RangeFacet(definition.name, definition.type, definition.property, definition.buckets, definition.colors);
  }

};

export default { create };