import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

import Timeline from './Timeline';
import Facets from '../hud/search/Facets';
import useSearch from '../state/search/useSearch';

const CustomizedHUD = props => {

  const { 
    search, 
    availableFacets,
    clearFilter, 
    setFilter,
    toggleFilter,
    setCategoryFacet 
  } = useSearch();

  const onChangeWhen = when =>
    setFilter('when', when);

  const onChangeFacet = inc => () => {
    const { length } = availableFacets;
    const currentIdx = availableFacets.indexOf(search.facet);
    const updatedIdx = (currentIdx + inc + length) % length; 
    setCategoryFacet(availableFacets[updatedIdx]);
  }

  const onToggleFilter = value =>
    toggleFilter(search.facet, value);

  const onClearFilter = () => 
    clearFilter(search.facet);

  const currentTimeFilter = search.filters.find(f => f.facet === 'when')?.values[0];

  return (
    <div className="p6o-hud-prosodic-convergence">
      <div className="p6o-hud-permanent">
        <div className="p6o-hud-top">
          <h1>Atlas of Prosodic Convergence <IoInformationCircleOutline /></h1>
          <Timeline 
            active={currentTimeFilter}
            onSelect={onChangeWhen} /> 
        </div>

        {search.facet &&
          <Facets
            search={search} 
            onNextFacet={onChangeFacet(1)}
            onPreviousFacet={onChangeFacet(-1)}
            onToggleFilter={onToggleFilter} 
            onClearFilter={onClearFilter} />
        }
      </div>
    </div>
  )

}

export default CustomizedHUD;