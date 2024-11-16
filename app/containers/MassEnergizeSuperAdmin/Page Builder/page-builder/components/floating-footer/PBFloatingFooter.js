import React from "react";
import "./pb-floating-footer.css";
function PBFloatingFooter({ openPageSettings, close, save, preview, sections }) {
  const disabled = !sections?.length;
  return (
    <div className="pb-footer-root">
      <div className="pb-footer-content">
        <h6 className="touchable-opacity" role="button" onClick={() => openPageSettings()}>
          <i className="fa fa-cog" style={{ marginRight: 5 }} />
          Modify Page Settings
        </h6>
        <div className="right-dock">
          <button
            disabled={disabled}
            className="pb-save pb-footer-btn"
            onClick={() => {
              alert("The 'Save' feature will be implemented soon!");
              save && save();
            }}
          >
            <i className="fa fa-save" style={{ marginRight: 5 }} /> Save
          </button>
          <button disabled={disabled} className="pb-preview pb-footer-btn" onClick={() => preview && preview()}>
            Preview <i className="fa fa-eye" style={{ marginLeft: 5 }} />
          </button>
          <button
            disabled={disabled}
            className="pb-publish pb-footer-btn"
            onClick={() => alert("The 'Publish' feature will be implemented soon!")}
          >
            Publish <i className="fa fa-external-link" style={{ marginLeft: 5 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PBFloatingFooter;