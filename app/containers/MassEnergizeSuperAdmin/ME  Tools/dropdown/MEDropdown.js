import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { Chip, FormControl, FormLabel, Select } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { pop } from "../../../../utils/common";
import LightAutoComplete from "../../Gallery/tools/LightAutoComplete";
import MEDropdownPro from "./MEDropdownPro";
import { apiCall } from "../../../../utils/messenger";
function MEDropdown(props) {
  const {
    containerStyle,
    labelExtractor,
    valueExtractor,
    onItemSelected,
    multiple,
    data,
    placeholder,
    defaultValue,
    value,
    generics,
    fullControl = false,
    ...rest
  } = props;
  const [selected, setSelected] = useState(defaultValue || value || []);
  const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);
    const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const valueOf = (item) => {
    if (!item) return;
    if (valueExtractor) return valueExtractor(item);
    return (item && item.name) || (item && item.toString());
  };

  useEffect(() => {
    setSelected(defaultValue || value || []);
  }, [defaultValue, value]);

  // -------------------------------------------------------------------
  if (fullControl) return <MEDropdownPro {...props} />;
  // -------------------------------------------------------------------
  const elementObserver = useRef(null);
  const lastDropDownItemRef = useCallback(
    (node) => {
      if (elementObserver.current) elementObserver.current.disconnect();
      elementObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && cursor.has_more) {
          if (!rest?.endpoint) return;
          apiCall(rest?.endpoint, { page: cursor.next,limit: 10,}).then((res) => {
            setCursor({
              has_more: res?.cursor?.count > optionsToDisplay?.length,
              next: res?.cursor?.next,
            });
            let items = [
              ...optionsToDisplay,
              ...(res?.data || [])?.map((item) => {
                return {
                  ...item,
                  displayName: labelExtractor
                    ? labelExtractor(item)
                    : item?.name || item?.title,
                };
              }),
            ];

            setOptionsToDisplay([
              ...new Map(items.map((item) => [item["id"], item])).values(),
            ]);
          });
        }
      });

      if (node) elementObserver.current.observe(node);
    },
    [cursor]
  );
  // -------------------------------------------------------------------
  // Always switch dropdown to auto complete dropdown if there are a lot of items. A lot = (>20 items)
  if (optionsToDisplay && optionsToDisplay.length > 20) {
    return (
      <LightAutoComplete
        onChange={(items) => {
          items = (items || []).map((a) => valueExtractor(a));
          onItemSelected(items);
        }}
        {...props}
      />
    );
  }
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------


  const labelOf = (item, fromValue) => {
    if (!item) return;
    if (fromValue) {
      item = (data || []).find((it) => valueOf(it) === item);
    }
    if (labelExtractor) return labelExtractor(item);
    return (item && item.name) || (item && item.toString());
  };

  const handleOnChange = (item) => {
    var items;
    if (!multiple) {
      items = [valueOf(item)];
      if (onItemSelected) onItemSelected(items);
      return setSelected(items);
    }

    const [found, rest] = pop(selected, valueOf(item));
    if (found) items = rest;
    else items = [...rest, valueOf(item)];
    setSelected(items);
    if (onItemSelected) return onItemSelected(items);
  };

  const itemIsSelected = (item) => {
    const found = (selected || []).find((it) => it === item);
    return found;
  };
  return (
    <FormControl
      style={{ width: "100%", marginTop: 10, ...(containerStyle || {}) }}
    >
      {placeholder && <FormLabel component="legend">{placeholder}</FormLabel>}
      <Select
        {...generics || {}}
        className="me-drop-override"
        multiple={multiple}
        displayEmpty
        renderValue={(itemsToDisplay) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {itemsToDisplay.map((item, id) => (
              <Chip
                key={id.toString()}
                label={labelOf(item, true)}
                style={{ margin: 5 }}
              />
            ))}
          </div>
        )}
        value={selected || []}
      >
        {(optionsToDisplay || []).map((d, i) => {
          return (
            <MenuItem key={i} ref={(i === optionsToDisplay.length - 1) && rest?.isAsync ? lastDropDownItemRef:null}>
              <FormControlLabel
                onClick={() => handleOnChange(d)}
                key={i}
                control={
                  multiple ? (
                    <Checkbox
                      checked={itemIsSelected(valueOf(d))}
                      value={valueOf(d)}
                      name={labelOf(d)}
                    />
                  ) : (
                    <Typography style={{ padding: "7px 15px" }}>
                      {labelOf(d)}
                    </Typography>
                  )
                }
                label={multiple ? labelOf(d) : ""}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default MEDropdown;

MEDropdown.defaultValues = {
  multiple: false,
  placeholder: "Enter placeholder text for your dropdown",
};
