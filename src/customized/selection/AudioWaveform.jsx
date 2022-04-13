import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { IoPlayCircle, IoPauseCircle } from 'react-icons/io5';

const AudioWaveform = props => {

  const el = useRef();

  const [ wavesurfer, setWavesurfer ] = useState();

  const [ playing, setPlaying ] = useState(false);

  useEffect(() => {
    if (el.current) {
      const wavesurfer = WaveSurfer.create({
        container: el.current.querySelector('.p6o-audio-waveform'),
        height:64
      });

      // Sample file for testin
      console.log('Loading: ' + props.src);
      wavesurfer.load('sample-6s.mp3');

      setWavesurfer(wavesurfer);
    }
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      if (playing)
        wavesurfer.play();
      else
        wavesurfer.pause();
    }
  }, [ playing ]);

  const togglePlayback = () =>
    setPlaying(!playing);
  
  return (
    <div className="p6o-audio-container" ref={el}>
      <div className="p6o-audio-controls">
        <button onClick={togglePlayback}>
          {playing ?
            <IoPauseCircle /> : <IoPlayCircle />
          }
        </button>
      </div>

      <div className="p6o-audio-waveform">

      </div>
    </div>
  )
  
}

export default AudioWaveform;