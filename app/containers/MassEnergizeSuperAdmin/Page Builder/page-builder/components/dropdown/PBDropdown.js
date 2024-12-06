import React, { useEffect } from "react";
import "./pb-dropdown.css";
function PBDropdown(props) {
  const {
    accessor,
    propAccessor,
    propIsObj,
    append,
    ref,
    focus,
    data,
    onChange,
    onFocus,
    cssKey,
    propertyIndex,
    value,
  } = props || {};
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);
  return (
    <div className="pb-dropdown">
      <select
        onFocus={onFocus}
        ref={ref}
        value={value}
        className="pb-undefault"
        onChange={(e) => {
          onChange &&
            onChange({
              accessor,
              propAccessor,
              propIsObj,
              append,
              value: e?.target.value,
              rawValue: e?.target.value,
              e,
              cssKey,
              propertyIndex,
            });
        }}
      >
        {data?.map((item, index) => (
          <option key={index} value={item?.value}>
            {item?.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PBDropdown;
