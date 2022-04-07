import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { StoreContext } from '../../store';
import { FacetsContext } from './FacetsContext';

import Search from './Search';
import { searchState } from '..';

import Filter from './Filter';

import { computeFacetDistribution } from './Facets';

const useSearch = () => {

  const { store } = useContext(StoreContext);

  const { availableFacets } = useContext(FacetsContext);

  const [ search, setSearchState ] = useRecoilState(searchState);

  /**
   * Executes a new search - warning costly operation!
   */
  const executeSearch = (query, filters, facet, fitMap) => {
    const all = query ?
      store.searchMappable(query) :
      store.getAllLocatedNodes();

    // Hack!!
    let countableProperties = [ 'Turkish Cypriot', 'Greek Cypriot', 'Arabic Cypriot' ];

    const metricFilterFacet = filters
      .map(filter => availableFacets.find(facet => facet.name === filter.facet))
      .find(f => f.type === 'metric.sum');

    if (metricFilterFacet) {
      const metricFilter = filters.find(f => f.facet === metricFilterFacet.name);
      countableProperties = countableProperties.filter(prop => metricFilter.values.indexOf(prop) > -1);
    }

    const count = items => items.map(item => {
      const weight = countableProperties.reduce((sum, prop) =>
        sum + item.properties[prop], 0);
      
      return {
        ...item,
        properties: {
          ...item.properties,
          weight
        }
      }
    });

    let preFilteredItems, postFilter;

    if (filters?.length > 0) {
      // All filters except on the current facet
      const preFilters = filters.filter(f => f.facet !== facet)
        .map(f => f.executable(availableFacets));

      // The current facet filter (if any)
      postFilter = filters.find(f => f.facet === facet)?.executable(availableFacets);

      // Step 1: apply pre-filters
      preFilteredItems = count(all.filter(item => preFilters.every(fn => fn(item))));
    } else {
      preFilteredItems = count(all);
    }

    const facetDistribution = 
      facet &&
      availableFacets.find(f => f.name === facet) &&
      computeFacetDistribution(preFilteredItems, availableFacets.find(f => f.name === facet), postFilter);

    const items = facetDistribution ? 
      facetDistribution.items : preFilteredItems;

    setSearchState(new Search(query, filters, facet, fitMap, items, facetDistribution));
  }

  /** Re-runs the search (e.g. if data has changed meanwhile) **/
  const refreshSearch = () => 
    executeSearch(search.query, search.filters, search.facet, search.fitMap);

  /** 
   * Changes the search query, running a new search. Keeps filters and current facet.
   */
  const changeSearchQuery = query => 
    executeSearch(query, search?.filters, search?.facet, false);

  /**
   * Clears the search query, running a new search. Keeps filters
   * and current facet setting.
   */
  const clearSearchQuery = () =>
    changeSearchQuery(null);

  /**
   * Flips the fitMap switch (but doesn't re-run the search)
   */
  const fitMap = () => {
    const updated = search.clone();
    updated.fitMap = true;
    setSearchState(updated);
  }

  /**
   * Adds or removes a filter and re-runs the search
   */
  const toggleFilter = (filterFacet, filterValue) => {
    const { query, filters, facet } = search;

    // Is there already a filter on this facet?
    const existingFilter = filters.find(f => f.facet === filterFacet);

    let updatedFilters = [];

    if (existingFilter?.values.length === 1 && existingFilter?.values[0] === filterValue) {
      // Toggle last remaining value for the existing filter -> remove!
      updatedFilters = filters.filter(f => f.facet !== filterFacet);
    } else if (existingFilter) {
      // Toggle single value in existing filter
      updatedFilters = filters.map(f => {
        if (f.facet === filterFacet) {
          // Update this filter
          return f.values.includes(filterValue) ?
            // Remove this value
            new Filter(filterFacet, f.values.filter(v => v !== filterValue)) :
            // Append this value
            new Filter(filterFacet, [...f.values, filterValue ]);
        } else {
          return f;
        }
      });
    } else {
      // No existing filter on this facet yet - add
      updatedFilters = [
        ...filters,
        new Filter(filterFacet, filterValue)
      ];
    }
      
    executeSearch(query, updatedFilters, facet);
  }

  /**
   * Sets a filter, replacing previous values (if any)
   */
  const setFilter = (filterFacet, arg) => {
    const { query, filters, facet } = search;

    // Allow null arg for removing a filter
    if (!arg) {
      const updatedFilters = filters.filter(f.facet !== filterFacet);
      executeSearch(query, updatedFilters, facet);
    } else {
      const filterValues = Array.isArray(arg) ? arg : [ arg ]; 


      const filter = new Filter(filterFacet, filterValues);

      // Is there already a filter on this facet?
      const existingFilter = filters.find(f => f.facet === filterFacet);
      const updatedFilters = existingFilter ?
        filters.map(f => f.facet === filterFacet ? filter : f) :
        [...filters, filter ];

      executeSearch(query, updatedFilters, facet);
    }
  }

  const clearFilter = filterFacet => {
    const { query, filters, facet } = search;

    const updatedFilters = filters.filter(f => f.facet !== filterFacet);

    executeSearch(query, updatedFilters, facet);
  }

  /**
   * Sets the current category facet. Re-runs the facet computation,
   * but not the search.
   */
  const setCategoryFacet = facetName => {
    const { query, filters } = search;
    executeSearch(query, filters, facetName);
  }

  return {
    search,
    refreshSearch,
    changeSearchQuery,
    clearSearchQuery,
    fitMap,
    setFilter,
    toggleFilter,
    clearFilter,
    setCategoryFacet,
    availableFacets: availableFacets.filter(f => !f.exclude).map(f => f.name)
  };

}

export default useSearch;