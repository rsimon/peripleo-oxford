import React from 'react';
import { IoArrowBackOutline, IoCloseSharp } from 'react-icons/io5';

import AudioWaveform from './AudioWaveform';
import { SIGNATURE_COLOR } from '../../Colors';

const AudioList = props => {

  const { referrer, nodeList } = props;

  const color = referrer.feature.properties.color || SIGNATURE_COLOR[3]; 

  return (
    <div className="p6o-selection-card p6o-selection-itemlistcard p6o-audiolist">
      <header 
        style={{ backgroundColor: color }}>
        
        <button 
          aria-label="Go Back"
          onClick={props.onGoBack}>
          <IoArrowBackOutline />
        </button>

        {referrer && 
          <h1>{referrer.node.title} ({referrer.node.when.label})</h1>
        }
        
        <button
          aria-label="Close" 
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>
      
      <ul>
        {nodeList.map(n =>
          <li key={n.node}>
            <AudioWaveform src={n.node} />
          </li>
        )}
      </ul>
    </div>
  )

}

export default AudioList;