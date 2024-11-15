import React, { forwardRef, useEffect, useRef } from "react";
import PBDropdown from "../dropdown/PBDropdown";
import { remove } from "lodash";

export const PROPERTY_TYPES = {
  INPUT: "input",
  INPUT_GROUP: "input-group",
  DROPDOWN: "dropdown",
  COLOR_PICKER: "color-picker",
  BACKGROUND_PICKER: "background-picker",
  RICH_TEXT: "richtext",
  FIXED_CHECKBOX: "fixed-checkbox",
  MEDIA: "MEDIA"
};

export const PBInputGroup = (props) => {
  const { group, onChange, propertyIndex, onFocus, shouldBeFocused } = props || {};

  return (
    <div className="flex-row align-center">
      {group?.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <PBInput
              focus={shouldBeFocused(item?.name)}
              onFocus={(e) => onFocus({ target: e?.target, key: item?.name })}
              unit="%"
              onChange={(data) => onChange({ ...data, groupIndex: index, isGrouped: true, propertyIndex })}
              {...item}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
export const PBInput = (props) => {
  const {
    propIsObj,
    propAccessor,
    accessor,
    append,
    focus,
    onFocus,
    unit,
    label,
    type,
    value,
    onChange,
    placeholder,
    name,
    cssKey,
    propertyIndex
  } = props || {};
  const ref = useRef();
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  return (
    <div className="flex-row align-center">
      <div className="pb-textbox" style={{ marginRight: 10, width: "100%" }}>
        <label>{label || "..."}</label>
        <br />
        <input
          ref={ref}
          onFocus={onFocus}
          name={name}
          onChange={(e) =>
            onChange &&
            onChange({
              accessor,
              value: `${e?.target.value}${unit || "px"}`,
              rawValue: e?.target.value,
              name: e?.target.name,
              propertyIndex,
              propIsObj,
              propAccessor,
              append,
              e
            })
          }
          type={type}
          value={value || ""}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export const PBColorPicker = (props) => {
  const { accessor, propAccessor, propIsObj, append, value, focus, onFocus, onChange, placeholder, propertyIndex } =
    props || {};
  const ref = useRef();
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  return (
    <input
      ref={ref}
      onFocus={onFocus}
      type="color"
      onChange={(e) =>
        onChange({
          value: e?.target.value,
          rawValue: e?.target.value,
          e,
          propertyIndex,
          accessor,
          propAccessor,
          propIsObj,
          append
        })
      }
      value={value}
      className="pb-color-picker"
      placeholder={placeholder || "Use Color Picker"}
    />
  );
};

export const PBBackgroundPicker = (props) => {
  const { label, type, value, onChange, placeholder, colorPickerLabel = "Use Color Picker" } = props || {};
  return (
    <>
      <div className="pb-image-picker">
        <i className=" fa fa-image" />
      </div>
      <br />
      <label style={{ color: "grey" }}>{colorPickerLabel}</label>
      <br />
      <input type="color" value="#dddddd" className="pb-color-picker" placeholder={colorPickerLabel} />
      {/* <div className="pb-side-panel-btn pb-touchable-opacity">{colorPickerLabel}</div> */}
    </>
  );
};

export const Dropdown = (props) => {
  const { value, focus, onFocus, onChange, placeholder, propertyIndex, cssKey } = props || {};
  const ref = forwardRef();

  return <PBDropdown ref={ref} {...props} />;
};

export const PBFixedCheckbox = (props) => {
  const {
    name,
    accessor,
    propertyIndex,
    propIsObj,
    propAccessor,
    append,
    onChange,
    value,
    _resetValue,
    unit,
    checkedValue,
    ...rest
  } = props;

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "10px 0px" }}>
      <input
        onChange={(e) => {
          const valueToUse = e?.target.value === checkedValue ? _resetValue : checkedValue;
          onChange({
            value: e?.target?.checked,
            accessor,
            value: `${valueToUse}${unit || "%"}`,
            rawValue: valueToUse,
            name: e?.target.name,
            propertyIndex,
            propIsObj,
            propAccessor,
            append,
            e
          });
        }}
        type="checkbox"
        name={name}
        value={value}
        checked={value === checkedValue}
      />
      <label>{rest?.label}</label>
    </div>
  );
};

export const PBImageSelector = (props) => {
  const { text, openMediaLibrary, src, remove } = props || {};
  const open = () => openMediaLibrary && openMediaLibrary();
  return (
    <div>
      <div style={{ marginTop: 10 }}>
        {!src ? (
          <div className="pb-image-picker" onClick={() => open()}>
            <i className=" fa fa-image" />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={src} alt="Other image placeholder" className="pb-side-image-preview" />
            <p onClick={() => remove && remove()} className="pb-img-remove touchable-opacity">
              Remove
            </p>
          </div>
        )}
      </div>
      <button onClick={() => openMediaLibrary && openMediaLibrary()} className="touchable-opacity pb-r-t">
        {text}
      </button>
    </div>
  );
};
