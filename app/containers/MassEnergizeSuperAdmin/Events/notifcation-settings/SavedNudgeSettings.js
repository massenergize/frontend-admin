import React from 'react';

const SavedNudgeSettings = () => {
  const common = {
    marginRight: 10,
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: '#428BCF'
  };
  return (
    <div style={{
      padding: '10px'
    }}>
      {[1, 2, 3, 4, 5].map((t) => <>
        <div style={{ marginTop: 10 }}>
          <p style={{
            marginBottom: 0,
            color: 'black',
          }}>Notify on first Nudge, Nudge within 30 days, Nudge within 1 week...</p>
          <small style={{
            color: 'black',
            fontWeight: 'bold'
          }}>Wayland, Concord, Framingham, Stowe, Agawam...</small>
          <div style={{ display: 'flex' }}>
            <small>5 communities, 10 items toggled</small>
            <div style={{ marginLeft: 'auto' }}>
              <small className="touchable-opacity" style={{ ...common }}>Edit</small>
              <small className="touchable-opacity" style={{
                ...common,
                color: '#C15757'
              }}>Remove</small>
            </div>
          </div>
        </div>
      </>)}
      {/* <div style={{ marginTop: 10 }}> */}
      {/*   <p style={{ */}
      {/*     marginBottom: 0, */}
      {/*     color: 'black', */}
      {/*   }}>Notify on first Nudge, Nudge within 30 days, Nudge within 1 week...</p> */}
      {/*   <small style={{ */}
      {/*     color: 'black', */}
      {/*     fontWeight: 'bold' */}
      {/*   }}>Wayland, Concord, Framingham, Stowe, Agawam...</small> */}
      {/*   <div style={{ display: 'flex' }}> */}
      {/*     <small>5 communities, 10 items toggled</small> */}
      {/*     <div style={{ marginLeft: 'auto' }}> */}
      {/*       <small className="touchable-opacity" style={{ ...common }}>Edit</small> */}
      {/*       <small className="touchable-opacity" style={{ */}
      {/*         ...common, */}
      {/*         color: '#C15757' */}
      {/*       }}>Remove</small> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}


    </div>
  );
};

export default SavedNudgeSettings;