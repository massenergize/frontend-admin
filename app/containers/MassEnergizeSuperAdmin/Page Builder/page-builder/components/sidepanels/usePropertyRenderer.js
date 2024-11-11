import React, { useEffect } from "react";
import { PBBackgroundPicker, PBColorPicker, PBInput, PBInputGroup, PROPERTY_TYPES } from "./PBPropertyTypes";
import PBDropdown from "../dropdown/PBDropdown";

function usePropertyRenderer({ blockId, onPropertyChange, onFocused, lastFocus }) {
  const onChange = (prop) => {
    onPropertyChange && onPropertyChange({ blockId, prop });
  };
  const handleFocus = (focusedProps) => {
    onFocused && onFocused(focusedProps);
  };

  const ContentWrapper = ({ text, children }) => {
    return (
      <div>
        {text && <h6 className="pb-panel-area-heading">{text}</h6>}
        {children}
      </div>
    );
  };

  const PropertyField = ({ json, propertyIndex }) => {
    const { _type, text, ...rest } = json || {};
    const commonProps = { text };
    const itemProps = { onChange, onFocus: handleFocus, propertyIndex, ...rest };
    const shouldBeFocused = (name) => lastFocus?.key === name;
    switch (_type) {
      case PROPERTY_TYPES.INPUT:
        return (
          <ContentWrapper {...commonProps}>
            <PBInput
              focus={shouldBeFocused(rest?.name)}
              {...itemProps}
              onFocus={(e) => handleFocus({ target: e?.target, key: rest?.name })}
            />
          </ContentWrapper>
        );
      case PROPERTY_TYPES.INPUT_GROUP:
        return (
          <ContentWrapper {...commonProps}>
            <PBInputGroup shouldBeFocused={shouldBeFocused} isGroup {...itemProps} />
          </ContentWrapper>
        );
      case PROPERTY_TYPES.DROPDOWN:
        return (
          <ContentWrapper {...commonProps}>
            <PBDropdown {...itemProps} />
          </ContentWrapper>
        );
      case PROPERTY_TYPES.COLOR_PICKER:
        return (
          <ContentWrapper {...commonProps}>
            <PBColorPicker focus={shouldBeFocused(rest?.name)} {...itemProps} />
          </ContentWrapper>
        );
      case PROPERTY_TYPES.BACKGROUND_PICKER:
        return (
          <ContentWrapper {...commonProps}>
            <PBBackgroundPicker {...itemProps} />
          </ContentWrapper>
        );

      default:
        console.log("PBError: Unknown type", _type);
        break;
    }
  };

  const PropertyRenderer = ({ properties }) => {
    if (!properties) return <small> Selected item has no properties </small>;

    return properties.map((item, index) => {
      return <React.Fragment key={index}>{<PropertyField json={item} propertyIndex={index} />}</React.Fragment>;
    });
  };

  return { PropertyRenderer };
}

export default usePropertyRenderer;
