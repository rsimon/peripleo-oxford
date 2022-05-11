import { AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react';
// import { FiMap } from 'react-icons/fi';
// import { AnimatePresence } from 'framer-motion';
import { 
  AiOutlineFullscreen, 
  AiOutlineFullscreenExit, 
  AiOutlinePlus, 
  AiOutlineMinus 
} from 'react-icons/ai';
import { BsLayers } from 'react-icons/bs';

import useClickOutside from './useClickoutside';
// import MapModesDropdown from './MapModesDropdown';
import MapLayersDropdown from './MapLayersDropdown';

const Controls = props => {

  // const [ isModesMenuVisible, setIsModesMenuVisible ] = useState(false);
  const [ isLayersMenuVisible, setIsLayersMenuVisible ] = useState(false);

  const el = useRef();

  useClickOutside(el, () =>
    setIsLayersMenuVisible(false));

  return (
    <div
      ref={el} 
      className="p6o-controls">
      {props.fullscreenButton && <button 
          className="p6o-controls-btn p6o-hud-button p6o-toggle-fullscreen"
          aria-label="Switch to fullscreen"
          tabIndex={30}
          onClick={props.onToggleFullscreen}>
          {props.isFullscreen ? 
            <AiOutlineFullscreenExit /> :
            <AiOutlineFullscreen />
          }
        </button>
      }
      
      <button 
        className="p6o-controls-btn p6o-hud-button p6o-zoom-in"
        tabIndex={31}
        aria-label="Zoom in"
        onClick={props.onZoomIn}>
        <AiOutlinePlus />
      </button>

      <button 
        className="p6o-controls-btn p6o-hud-button p6o-zoom-out"
        tabIndex={32}
        aria-label="Zoom out"
        onClick={props.onZoomOut}>
        <AiOutlineMinus />
      </button>

      {props.config.layers?.length > 0 && 
        <div className="p6o-map-layers">

          <button
            className="p6o-controls-btn p6o-hud-button"
            onClick={() => setIsLayersMenuVisible(!isLayersMenuVisible)}>
            <BsLayers />
          </button>

          <AnimatePresence>
            {isLayersMenuVisible && 
              <MapLayersDropdown 
                layers={props.config.layers} 
                selectedLayers={props.selectedLayers}
                onChangeLayers={props.onChangeLayers} />
            }
          </AnimatePresence>
        </div>
      }

      {/* <div className="p6o-map-modes">
        <button
          className="p6o-controls-btn p6o-hud-button"
          tabIndex={33}
          aria-label="Mapping modes"
          onClick={() => setIsModesMenuVisible(!isModesMenuVisible) }>
          <FiMap />
        </button>

        <AnimatePresence>
          {isModesMenuVisible &&
            <MapModesDropdown />
          }
        </AnimatePresence>
      </div>*/}
    </div>
  )

}

export default Controls;