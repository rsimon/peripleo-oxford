import React from 'react';
import { IoArrowBackOutline, IoCloseSharp, IoVolumeHighOutline } from 'react-icons/io5';

import { SIGNATURE_COLOR } from '../../Colors';

const ProsodicConvergenceCard = props => {

  console.log(props);

  const { node, feature } = props;

  const { audio } = node;

  const color = feature.properties.color || SIGNATURE_COLOR[3]; 

  return (
    <div 
      className="p6o-selection-card p6o-prosodic-convergence-selection-card p6o-selection-itemcard">
      <header 
        aria-disabled
        style={{ 
          backgroundColor: color,
        }}>
 
        {props.backButton && 
          <button
            aria-label="Go Back"
            onClick={props.onGoBack}>
            <IoArrowBackOutline />
          </button>
        }

        <div>
          <h1>{node.title}</h1>
          <h2>{node.properties.region}</h2>
        </div>

        <button
          aria-label="Close"
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>

      <div className="p6o-selection-content">
        <main>

        </main>
      </div>

      <footer aria-live={true}>
        {audio ? 
          <div
            className="p6o-selection-audio">
            <button>
              <IoVolumeHighOutline /> <span>{audio.length} Audio recording{audio.length > 1 && 's'}</span>
            </button>
          </div> :

          <div
            className="p6o-selection-audio disabled">
            <IoVolumeHighOutline /> <span>No audio recordings</span>
          </div>
        }
      </footer>
    </div>
  )

}

export default ProsodicConvergenceCard;