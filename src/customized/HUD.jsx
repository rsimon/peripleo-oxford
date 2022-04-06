import React, { useEffect } from 'react';

import Timeline from './Timeline';
import Facets from '../hud/search/Facets';
import useSearch from '../state/search/useSearch';

const CustomizedHUD = props => {

  const { 
    search, 
    availableFacets,
    clearFilter, 
    setFilter,
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

  return (
    <div className="p6o-hud-prosodic-convergence">
      <div className="p6o-hud-permanent">
        <h1>Atlas of Prosodic Convergence</h1>
        <Timeline 
          onSelect={onChangeWhen} />

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