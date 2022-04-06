import React from 'react';

const YEARS = ['1901', '1946', '1960', '1973', '2000s' ];

const Timeline = props => {

  const BUTTONS = YEARS.map(label => 
    <li
      key={label} 
      className={props.active === label ? 'active' : null}>
      <button onClick={() => props.onSelect(label)}>
        {label}
      </button>
    </li>
  );

  return (
    <div className="p6o-hud-timeline">
      <ul>
        {BUTTONS}
      </ul>
    </div>
  )

}

export default Timeline;