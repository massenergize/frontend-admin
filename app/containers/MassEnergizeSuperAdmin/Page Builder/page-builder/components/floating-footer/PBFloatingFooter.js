import React from "react";
import "./pb-floating-footer.css";
function PBFloatingFooter({ openPageSettings, close, save }) {
  return (
    <div className="pb-footer-root">
      <div className="pb-footer-content">
        <h6 className="touchable-opacity" role="button" onClick={() => openPageSettings()}>
          <i className="fa fa-cog" style={{ marginRight: 5 }} />
          Modify Page Settings
        </h6>
        <div className="right-dock">
          <button
            className="pb-save pb-footer-btn"
            onClick={() => {
              alert("The 'Save' feature will be implemented soon!");
              save && save();
            }}
          >
            <i className="fa fa-save" style={{ marginRight: 5 }} /> Save
          </button>
          <button
            className="pb-preview pb-footer-btn"
            onClick={() => alert("The 'Preview' feature will be implemented soon!")}
          >
            Preview <i className="fa fa-external-link" style={{ marginLeft: 5 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PBFloatingFooter;
