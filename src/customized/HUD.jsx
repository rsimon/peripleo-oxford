import React from 'react';

import Timeline from './Timeline';
import useSearch from '../state/search/useSearch';

const CustomizedHUD = props => {

  const { search, toggleFilter } = useSearch();

  const onChangeWhen = when => {
    console.log('setting', when);
    toggleFilter('when', when);
  }

  return (
    <div className="p6o-hud-prosodic-convergence">
      <div className="p6o-hud-permanent">
        <h1>Atlas of Prosodic Convergence</h1>
        <Timeline 
          onSelect={onChangeWhen} />
      </div>
    </div>
  )

}

export default CustomizedHUD;