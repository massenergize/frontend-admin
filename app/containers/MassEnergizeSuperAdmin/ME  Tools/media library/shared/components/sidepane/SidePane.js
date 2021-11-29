import React from 'react';
import ImageThumbnail from '../thumbnail/ImageThumbnail';
import { getRandomStringKey } from '../../utils/utils';
import MLButton from '../button/MLButton';

export default function SidePane({ activeImage, setShowSidePane }) {
  return (
    <div className="ml-sidepane-container elevate-float side-pane-slide-animation">
      <div style={{ position: 'relative', height: '100%', padding: 15 }}>
        <h5 style={{ margin: 0, marginBottom: 10 }}>IMAGE DETAILS</h5>
        <ImageThumbnail
          style={{ width: '100%', height: 200, objectFit: 'contain' }}
          imageSource={activeImage.url}
          key={getRandomStringKey()}
        />

        <h6 style={{ margin: 0 }}>URL</h6>
        <a href="#" style={{ fontSize: 13, color: 'cornflowerblue' }}>
          {activeImage.url}
        </a>

        <MLButton
          onClick={() => setShowSidePane(false)}
          backColor="#245a93"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            padding: '15px 40px',
          }}
        >
          HIDE
        </MLButton>
        {/* <button
          className="ml-footer-btn"
          style={{
            "--btn-color": "white",
            "--btn-background": "#245a93",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
          }}
        >
          HIDE
        </button> */}
      </div>
    </div>
  );
}
