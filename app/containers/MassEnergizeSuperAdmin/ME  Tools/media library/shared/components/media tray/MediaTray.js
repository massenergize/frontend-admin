import React from 'react';
import MediaLibrary from '../../../MediaLibrary';

export default function MediaTray({}) {
  return (
    <div
      className=""
      style={{
        width: '100%',
        display: 'flex',
        height: 200,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MediaLibrary.Button>Show Library</MediaLibrary.Button>
    </div>
  );
}
