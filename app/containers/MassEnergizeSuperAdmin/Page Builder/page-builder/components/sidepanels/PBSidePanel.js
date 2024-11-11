import React, { useEffect } from "react";
import "./pb-sidepanel.css";
import PBDropdown from "../dropdown/PBDropdown";
import { PBBackgroundPicker } from "./PBPropertyTypes";
import usePropertyRenderer from "./usePropertyRenderer";
import { DEFAULT_PROPERTIES, EXAMPLE_PROPERTIES } from "./property-data";
// import PropertyRenderer from "./PropertyRenderer";

function PBSidePanel({ block, onPropertyChange, onFocused, lastFocus }) {
  const { PropertyRenderer } = usePropertyRenderer({ blockId: block?.id, onPropertyChange, onFocused, lastFocus });

  return (
    <div className="pb-side-panel-root">
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <h6>Properties</h6> <small style={{ marginLeft: "auto", color: "grey" }}>v1.0.0</small>
      </div>
      <PropertyRenderer properties={block?.properties} />
    </div>
  );
}

export default PBSidePanel;
