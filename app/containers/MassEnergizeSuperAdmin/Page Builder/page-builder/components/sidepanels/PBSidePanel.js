import React, { useEffect } from "react";
import "./pb-sidepanel.css";
import PBDropdown from "../dropdown/PBDropdown";
import { PBBackgroundPicker, PROPERTY_TYPES } from "./PBPropertyTypes";
import usePropertyRenderer from "./usePropertyRenderer";
import { DEFAULT_PROPERTIES, EXAMPLE_PROPERTIES } from "./property-data";
import { usePBBottomSheet } from "../../hooks/usePBBottomSheet";
import PBRichTextEditor from "../richtext/PBRichTextEditor";
import { useMemo } from "react";
// import PropertyRenderer from "./PropertyRenderer";

function PBSidePanel({
  propsOverride,
  block,
  onPropertyChange,
  onFocused,
  lastFocus,
  tinyKey,
  reset,
  openMediaLibrary
}) {
  const { BottomSheet, open: openBottomSheet, heightIsToggled, close } = usePBBottomSheet();
  const { PropertyRenderer } = usePropertyRenderer({
    blockId: block?.id,
    onPropertyChange,
    onFocused,
    lastFocus,
    openBottomSheet,
    openMediaLibrary,
    propsOverride
  });

  useEffect(() => {
    if (block?.key !== PROPERTY_TYPES.RICH_TEXT) return close();
  }, [block?.key]);

  // const extractValue = (v, unit) => {
  //   if (!v) return null;
  //   return v?.toString().split(unit)?.[0];
  // };
  // const getStartingValueFromElement = (prop, elementProps) => {
  //   const { group, propAccessor, accessor, unit } = prop || {};

  //   if (group) return { ...prop, group: group?.map((p) => getStartingValueFromElement(p, elementProps)) };
  //   let value;
  //   if (!propAccessor) {
  //     value = elementProps[accessor];
  //     value = extractValue(value, unit);
  //     return { ...prop, value };
  //   }

  //   const obj = elementProps[propAccessor] || {};
  //   value = extractValue(obj[accessor]);
  //   return { ...prop, value };
  // };

  // const transformPropertiesToMatchElementProps = (blockInFocus) => {
  //   if (!blockInFocus) return null;
  //   const elementProps = blockInFocus?.template?.element?.props;
  //   const properties = blockInFocus?.properties;
  //   const newProps = properties?.map((prop) => getStartingValueFromElement(prop, elementProps));
  //   return { ...blockInFocus, properties: newProps };
  // };

  // const transformedBlock = useMemo(() => transformPropertiesToMatchElementProps(block), [block]);
  const transformedBlock = block;

  const onEditorChange = (data) => {
    const block = transformedBlock;
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

  const value = transformedBlock?.template?.element?.props?.__html;
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
        <PropertyRenderer properties={transformedBlock?.properties} />
      </div>
      <BottomSheet>
        <div style={{ width: "70%" }}>
          <PBRichTextEditor
            onFocused={onFocused}
            focus={lastFocus?.key === block?.name}
            value={value || ""}
            onChange={onEditorChange}
            apiKey={tinyKey}
            height={heightIsToggled ? 800 : 600}
          />
        </div>
      </BottomSheet>
    </>
  );
}

export default PBSidePanel;
