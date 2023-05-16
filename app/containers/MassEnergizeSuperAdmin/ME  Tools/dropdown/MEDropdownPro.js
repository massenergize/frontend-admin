import { Checkbox, Chip, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { pop } from "../../../../utils/common";

function MEDropdownPro({
  onHeaderRender,
  labelExtractor,
  valueExtractor,
  onItemSelected,
  multiple,
  data,
  placeholder,
  defaultValue,
  value,
}) {
  const [selected, setSelected] = useState(defaultValue || value || []);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setSelected(defaultValue || value || []);
  }, [defaultValue, value]);

  const labelOf = (item, getItemFromValue) => {
    if (!item) return;
    if (getItemFromValue) {
      item = (data || []).find((it) => valueOf(it) === item);
    }
    if (labelExtractor) return labelExtractor(item);
    return (item && item.name) || (item && item.toString());
  };

  const valueOf = (item) => {
    if (!item) return;
    if (valueExtractor) return valueExtractor(item);
    return (item && item.name) || (item && item.toString());
  };
  const renderHeader = () => {
    let items = selected?.map((itm) => labelOf(itm, true));
    if (onHeaderRender) return onHeaderRender(items, selected);
    if (!items?.length) return placeholder || "Select an item";
    return items?.join(",");
  };

  const handleOnChange = (item) => {
    var items;
    if (!multiple) {
      items = [valueOf(item)];
      if (onItemSelected) onItemSelected(items);
      setShow(false)
      return setSelected(items);
    }
    const [found, rest] = pop(selected, valueOf(item));
    if (found) items = rest;
    else items = [...rest, valueOf(item)];
    setSelected(items);
    if (onItemSelected) return onItemSelected(items);
  };

  const itemIsSelected = (item) => {
    const found = (selected || []).find(
      (it) => it.toString() === item.toString()
    );
    return found;
  };

  const renderChildren = () => {
    if (!show) return <></>;
    return data?.map((d, i) => {
      return (
        <p
          key={i}
          onClick={() => handleOnChange(d)}
          className="drop-pro-child"
          style={multiple ? { padding: "13px" } : {}}
        >
          {multiple && (
            <Checkbox
              checked={itemIsSelected(valueOf(d))}
              value={valueOf(d)}
              name={labelOf(d)}
            />
          )}
          {labelOf(d)}
        </p>
      );
    });
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div className="drop-pro-trigger" onClick={() => setShow(!show)}>
        {renderHeader()}
        <i className="fa fa-caret-down" style={{ marginLeft: 10 }} />
      </div>
      {show && (
        <div className="drop-ghost-curtain" onClick={() => setShow(false)} />
      )}
      {show && <div className="drop-children-area">{renderChildren()}</div>}
    </div>
  );
}

export default MEDropdownPro;
