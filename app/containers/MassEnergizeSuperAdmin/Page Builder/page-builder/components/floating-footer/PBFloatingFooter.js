import React from "react";
import "./pb-floating-footer.css";
import { PBKEYS } from "../../PBEntry";
function PBFloatingFooter({ loadingStates, publish, openPageSettings, close, save, preview, inPreview, sections }) {
  const saveIsLoading = loadingStates[PBKEYS.FOOTER.SAVING];
  const isPublishing = loadingStates[PBKEYS.FOOTER.PUBLISHING];
  const disabled = !sections?.length;


  return (
    <div className="pb-footer-root">
      <div className="pb-footer-content">
        <h6 className="touchable-opacity" role="button" onClick={() => openPageSettings()}>
          <i className="fa fa-cog" style={{ marginRight: 5 }} />
          Page Configuration
        </h6>
        <div className="right-dock">
          <button
            disabled={disabled || saveIsLoading || isPublishing}
            className="pb-save pb-footer-btn"
            onClick={() => {
              save && save();
            }}
          >
            <i className={`fa fa-${saveIsLoading ? "spinner fa-spin" : "save"}`} style={{ marginRight: 5 }} /> Save
          </button>
          <button disabled={disabled} className="pb-preview pb-footer-btn" onClick={() => preview && preview()}>
            {inPreview ? "Edit Mode" : "Preview"}{" "}
            <i className={inPreview ? "fa fa-edit" : "fa fa-eye"} style={{ marginLeft: 5 }} />
          </button>
          <button
            disabled={disabled || saveIsLoading || isPublishing}
            className="pb-publish pb-footer-btn"
            onClick={() => publish && publish()}
          >
            Publish{" "}
            <i className={`fa fa-${isPublishing ? "spinner fa-spin" : "external-link"}`} style={{ marginLeft: 5 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PBFloatingFooter;
