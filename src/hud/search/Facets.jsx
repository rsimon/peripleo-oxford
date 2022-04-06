import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlusCircle } from 'react-icons/hi';

import { SIGNATURE_COLOR } from '../../Colors';

const formatNumber = num => {
  if (num > 1000)
    return (num / 1000).toFixed(1) + 'k';
  else if (num > 1000000)
    return (num / 1000000).toFixed(1) + 'M';
  else 
    return num;
}

const parentAnimation = {
  hidden: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05
    }
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childAnimation = {
  hidden: { 
    opacity: 0,
    maxWidth: 0 
  },
  visible: { 
    opacity: 1,
    maxWidth: 500,
    transition: {
      duration: 0.5
    }
  }
}

const equivalentFilters = (a, b) => {
  if (a.length === b.length) {
    const setA = new Set(a);
    const setB = new Set(b);

    for (const x of setA) if (!setB.has(x)) return false;
    return true;
  } else {
    return false;
  }
}

const Facets = props => {

  const counts = props.search.facetDistribution?.counts || [];

  const displayed = counts.slice(0, 8);
  const remaining = counts.length - displayed.length;

  // Filter values on the current facet (if any)
  const currentFacetFilter = props.search.filters.find(f => f.facet === props.search.facet);

  const onToggleFilter = label => () => {
    const allDisplayed = displayed.map(t => t[0]);
    const filterValues = currentFacetFilter?.values || [];
    const filterValuesAfter = [...filterValues, label ];

    const isAllValues = equivalentFilters(allDisplayed, filterValuesAfter); 

    // If the user has enabled all displayed filter values -> remove filter on this facet!
    if (isAllValues)
      props.onClearFilter();
    else
      props.onToggleFilter(label);
  }

  return (
    <motion.div 
      key="facets-container"
      className="p6o-facets-container">
      <div className="p6o-facets">
        <motion.div
          className="p6o-facets-carousel"
          variants={parentAnimation}
          initial="hidden"
          animate="visible"
          exit="hidden">

          <button 
            tabIndex={4}
            aria-label="Previous filter category"
            onClick={props.onPreviousFacet}>
            <HiOutlineChevronLeft />
          </button>
          
          <h3 
            aria-live="polite"
            aria-atomic={true}>
            {props.search.facet.replace('_', ' ')}
          </h3>
          
          <button
            tabIndex={5}
            aria-label="Next filter category" 
            onClick={props.onNextFacet}>
            <HiOutlineChevronRight />
          </button>
        </motion.div>

        <motion.ul 
          variants={parentAnimation} 
          initial="hidden" 
          animate="visible"
          exit="hidden">

          {displayed.map(([label, count], idx) => 
            <motion.li 
              key={label}
              className={currentFacetFilter &&
                (currentFacetFilter.values.includes(label) ? 'p6o-filter-shown' : 'p6o-filter-hidden')}
              variants={childAnimation}
              onClick={onToggleFilter(label)}>
              <div className="p6o-facet-value-wrapper">
                <span 
                  className="p6o-facet-value-count"
                  style={{ backgroundColor: SIGNATURE_COLOR[idx] }}>{formatNumber(count)}</span>

                <span className="p6o-facet-value-label">{label}</span>
              </div>
            </motion.li>
          )}

          {remaining > 0 && 
            <motion.li
              key="p6o-remaining"
              variants={childAnimation}
              className="p6o-facet-values-remaining">
              <div className="p6o-facet-value-wrapper">
                <span><HiOutlinePlusCircle /> {remaining} more</span>
              </div>
            </motion.li>
          }
        </motion.ul>

      </div>
    </motion.div>
  )

}

export default Facets;