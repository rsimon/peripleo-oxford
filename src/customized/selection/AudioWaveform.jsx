import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioWaveform = props => {

  const el = useRef();

  useEffect(() => {
    if (el.current) {
      const wavesurfer = WaveSurfer.create({
        container: el.current,
      });

      // Sample file for testin
      console.log('Loading: ' + props.src);
      wavesurfer.load('sample-6s.mp3');
    }
  }, []);
  
  return (
    <div className="p6o-audio-container" ref={el}></div>
  )
  
}

export default AudioWaveform;