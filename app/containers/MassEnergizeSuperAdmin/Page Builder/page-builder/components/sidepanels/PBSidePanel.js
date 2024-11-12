import React, { useEffect } from "react";
import "./pb-sidepanel.css";
import PBDropdown from "../dropdown/PBDropdown";
import { PBBackgroundPicker, PROPERTY_TYPES } from "./PBPropertyTypes";
import usePropertyRenderer from "./usePropertyRenderer";
import { DEFAULT_PROPERTIES, EXAMPLE_PROPERTIES } from "./property-data";
import { usePBBottomSheet } from "../../hooks/usePBBottomSheet";
import PBRichTextEditor from "../richtext/PBRichTextEditor";
// import PropertyRenderer from "./PropertyRenderer";

function PBSidePanel({ block, onPropertyChange, onFocused, lastFocus, tinyKey, reset }) {
  const { BottomSheet, open: openBottomSheet, heightIsToggled } = usePBBottomSheet();
  const { PropertyRenderer } = usePropertyRenderer({
    blockId: block?.id,
    onPropertyChange,
    onFocused,
    lastFocus,
    openBottomSheet
  });

  const onEditorChange = (data) => {
    const { content } = data;
    const func = (prop) => prop?._type === PROPERTY_TYPES.RICH_TEXT;
    const richProp = block?.properties?.find(func);
    const propertyIndex = block?.properties?.findIndex(func);
    onPropertyChange({
      blockId: block?.id,
      prop: {
        ...richProp,
        value: content,
        rawValue: content,
        onFocused,
        lastFocus,
        propertyIndex
      }
    });
  };

  const value = block?.template?.element?.props?.__html;
  return (
    <>
      <div className="pb-side-panel-root">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <h6>Properties</h6> <small style={{ marginLeft: "auto", color: "grey" }}>v1.0.0</small>
        </div>
        <div style={{ margin: "10px 0px" }}>
          <button
            onClick={() => reset && reset()}
            disabled={!block?.properties}
            className="pb-reset-btn touchable-opacity"
          >
            Reset Properties
          </button>
        </div>
        <PropertyRenderer properties={block?.properties} />
      </div>
      <BottomSheet>
        <div style={{ width: "70%" }}>
          <PBRichTextEditor
            value={value || ""}
            onChange={onEditorChange}
            apiKey={tinyKey}
            height={heightIsToggled ? 500 : 300}
          />
        </div>
      </BottomSheet>
    </>
  );
}

export default PBSidePanel;
