import React from 'react';
import './Popup.css';

function Popup({ points, onClose }) {
  return (
    <div className="popup">
      <p className="point">{points}</p>
    </div>
  );
}

export default Popup;
