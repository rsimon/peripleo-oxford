import React from 'react';
import { IoArrowBackOutline, IoCloseSharp, IoVolumeHighOutline } from 'react-icons/io5';

import { SIGNATURE_COLOR } from '../../Colors';

const ProsodicConvergenceCard = props => {

  const { node, feature } = props;

  const { audio, properties } = node;

  const color = feature.properties.color || SIGNATURE_COLOR[3]; 

  const goTo = () => props.onGoTo({
    referrer: props,
    nodeList: audio
  });

  const rows = [
    [ 'Arabic Cypriot', properties['Arabic Cypriot'] ],
    [ 'Greek Cypriot', properties['Greek Cypriot'] ],
    [ 'Turkish Cypriot', properties['Turkish Cypriot'] ]
  ];

  rows.sort((a, b) => b[1] - a[1]);

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
          <h1>{node.title} ({node.when.label})</h1>
          <h2>{properties.region}</h2>
        </div>

        <button
          aria-label="Close"
          onClick={props.onClose}>
          <IoCloseSharp />
        </button>
      </header>

      <div className="p6o-selection-content">
        <main>
          <table>
            {rows.map(([label, count]) => 
              <tr key={label}>
                <td>{label}</td>
                <td>{(count || 0).toLocaleString('en-US')}</td>
              </tr>
            )}
          </table>
        </main>
      </div>

      <footer aria-live={true}>
        {audio ? 
          <div
            className="p6o-selection-audio">
            <button onClick={goTo}>
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