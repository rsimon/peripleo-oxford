import React from 'react';
import ReactDOM from 'react-dom';

const Welcome = props => {

  return ReactDOM.createPortal(
    <div className="p6o-welcome-wrapper">
      <div className="p6o-welcome">
        <h1>
          Atlas of Prosodic Convergence
        </h1>

        <p>
          This is a concept prototype for the planned <strong>Atlas of Prosodic Convergence</strong>. 
          To learn more about how the user interface works, take the tour.
        </p>
        
        <div className="p6o-welcome-buttons">
          <button 
            className="p6o-no-thanks"
            onClick={props.onNoThanks}>
            No thanks
          </button>

          <button 
            className="p6o-take-tour"
            onClick={props.onTakeTour}>
            Yes, take the tour
          </button>
        </div>
      </div>
    </div>,

    document.body
  );

}

export default Welcome;