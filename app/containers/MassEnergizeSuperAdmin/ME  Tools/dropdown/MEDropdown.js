import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,

  Chip,
  FormControl,
  FormLabel,
  Select,
  CircularProgress,
} from "@mui/material";

import React, {
  useCallback, useEffect, useRef, useState
} from "react";
import { pop } from "../../../../utils/common";
import LightAutoComplete from "../../Gallery/tools/LightAutoComplete";
import MEDropdownPro from "./MEDropdownPro";
import { apiCall } from "../../../../utils/messenger";
import useObserver from "../../../../utils/useObserver";
function MEDropdown(props) {
  const {
    containerStyle,
    labelExtractor,
    valueExtractor,
    onItemSelected,
    multiple,
    // data,
    placeholder,
    defaultValue,
    value,
    generics,
    fullControl = false,
    name,
    allowClearAndSelectAll,
    smartDropdown = true,
    ...rest
  } = props;
  const [dropOpen, setOpenDropdown] = useState(false);
  const [selected, setSelected] = useState([]);
  const [optionsToDisplay, setOptionsToDisplay] = useState([]);
  // const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });

  const isAll = (item) => typeof item === "string" && item?.toLowerCase() === "all";
  const valueOf = (item) => {
    if (!item) return;
    if (multiple && isAll(item)) return "all";
    if (valueExtractor) return valueExtractor(item);
    return (item && item.name) || (item && item.toString());
  };
  useEffect(() => {
    setSelected(defaultValue || value || []);
  }, [defaultValue, value]);

  useEffect(() => {
    if (!rest?.isAsync) {
      setOptionsToDisplay(props.data);
    }
  }, [props.data]);

  // -------------------------------------------------------------------
  if (fullControl) return <MEDropdownPro {...props} />;
  // -------------------------------------------------------------------
  const { ref, data: newItems, cursor } = useObserver({
    data: optionsToDisplay,
    endpoint: rest?.endpoint,
    args: { limit: 10 },
    params: { ...(rest?.params || {}) },
  });
  useEffect(() => {
    if(!rest?.endpoint) return;
    const newItemsConstructed = (newItems || [])?.map((item) => ({
      ...item,
      displayName: labelExtractor
        ? labelExtractor(item)
        : item?.name || item?.title,
    }));
    const all = [...(optionsToDisplay || []), ...(newItemsConstructed || [])];
    const uniqueItems = [
      ...new Map(all.map((item) => [item.id, item])).values(),
    ];
    setOptionsToDisplay(uniqueItems);
  }, [newItems]);


  // const elementObserver = useRef(null);
  // const lastDropDownItemRef = useCallback(
  //   (node) => {
  //     if (elementObserver.current) elementObserver.current.disconnect();
  //     elementObserver.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && cursor.has_more) {
  //         if (!rest?.endpoint) return;
  //         apiCall(rest?.endpoint, {
  //           page: cursor.next,
  //           limit: 10,
  //           params: JSON.stringify({ ...(rest?.params || {}) }),
  //         }).then((res) => {
  //           setCursor({
  //             has_more: res?.cursor?.count > optionsToDisplay?.length,
  //             next: res?.cursor?.next,
  //           });
  //           let items = [
  //             ...optionsToDisplay,
  //             ...(res?.data || [])?.map((item) => {
  //               return {
  //                 ...item,
  //                 displayName: labelExtractor
  //                   ? labelExtractor(item)
  //                   : item?.name || item?.title,
  //               };
  //             }),
  //           ];

  //           setOptionsToDisplay([
  //             ...new Map(
  //               items.map((item) => [item["id"], item])
  //             ).values(),
  //           ]);
  //         });
  //       }
  //     });

  //     if (node) elementObserver.current.observe(node);
  //   },
  //   [cursor]
  // );
  // -------------------------------------------------------------------
  // Always switch dropdown to auto complete dropdown if there are a lot of items. A lot = (>20 items)
  if (smartDropdown && optionsToDisplay && optionsToDisplay.length > 20) {
    return (
      <LightAutoComplete
        onChange={(items) => {
          items = (items || []).map((a) => valueExtractor(a));
          onItemSelected && onItemSelected(items);
        }}
        {...props}
      />
    );
  }
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------

  const labelOf = (item, fromValue) => {
    const data = optionsToDisplay;
    if (!item) return;
    if (multiple && isAll(item)) return "All";
    if (fromValue) {
      item = (data || []).find((it) => valueOf(it) === item);
    }
    if (labelExtractor) return labelExtractor(item);
    return (item && item.name) || (item && item.toString());
  };

  const handleOnChange = (item) => {
    let items;
    if (!multiple) {
      items = [valueOf(item)];
      if (onItemSelected) onItemSelected(items);
      return setSelected(items);
    }
    const first = selected[0];
    const [found, rest] = pop(selected, valueOf(item));
    if (found) items = rest;
    else items = [...(isAll(first) ? [] : rest), valueOf(item)];
    setSelected(items);
    if (onItemSelected) return onItemSelected(items);
  };

  const itemIsSelected = (item) => {
    const found = (selected || []).find((it) => it === item);
    return found;
  };
  const allOrNothing = ({ nothing }) => {
    if (nothing) {
      setSelected([]);
      onItemSelected([]);
      return;
    }
    setSelected(["all"]);
    onItemSelected(["all"]);
  };

  const ITEM_HEIGHT = 60;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        // width: 250,
      },
    },
  };
  const renderSpotlight = () => {
    const { spotlightExtractor, spotlightText } = props;
    if (!spotlightExtractor) return <></>;
    const itemsInSpotlight = optionsToDisplay?.filter(spotlightExtractor);
    return (
      <div
        style={{
          border: "solid 0px #f6f6f6fc",
          borderBottomWidth: 2,
        }}
      >
        {spotlightText && (
          <Typography
            variant="body2"
            style={{ padding: "10px 20px", color: "grey" }}
          >
            {spotlightText}
          </Typography>
        )}
        {itemsInSpotlight.map((d, i) => (
          <MenuItem key={i}>
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
        ))}
      </div>
    );
  };

  return (
    <>
      <FormControl
        key={name || "me-dropdown"}
        style={{ width: "100%", marginTop: 10, ...(containerStyle || {}) }}
      >
        {placeholder && (
          <FormLabel component="legend">{placeholder}</FormLabel>
        )}
        <Select
          {...generics || {}}
          open={dropOpen}
          onOpen={() => setOpenDropdown(true)}
          onClose={() => setOpenDropdown(false)}
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
          sx={rest.sx || {}}
          MenuProps={MenuProps}
        >
          {allowClearAndSelectAll && multiple && (
            <div
              style={{
                border: "solid 0px #f6f6f6fc",
                padding: "15px 20px",
                borderBottomWidth: 2,
              }}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  allOrNothing({});
                  setOpenDropdown(false);
                }}
                href="#"
                style={{ marginRight: 15, fontWeight: "bold", color: "black" }}
              >
                Select All
                {" "}
              </a>
              {selected?.length ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    allOrNothing({ nothing: true });
                  }}
                  href="#"
                  style={{ color: "#ca1f1f", fontWeight: "bold" }}
                >
                  Clear All
                  {" "}
                </a>
              ) : (
                <></>
              )}
            </div>
          )}

          {renderSpotlight()}
          {(optionsToDisplay || []).map((d, i) => {
            const { spotlightExtractor } = props;
            if (spotlightExtractor && spotlightExtractor(d)) return <></>;
            return (
              <MenuItem
                key={i}
                onClick={() => handleOnChange(d)}
              >
                <FormControlLabel
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
          {cursor.has_more && rest?.isAsync && (
            <MenuItem
              value={cursor.next}
              key="fetcher-option"
              ref={ref}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} />
              </Box>
            </MenuItem>
          )}
        </Select>
      </FormControl>
      {/* {allowClearAndSelectAll && multiple && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "3px 0px",
              fontSize: "0.87rem",
            }}
          >
            <span
              onClick={() => allOrNothing({})}
              className={`touchable-opacity`}
              style={{
                marginRight: 15,
                textDecoration: "underline",
                fontWeight: "bold",
                // color: "var(--app-purple)",
              }}
            >
              {" "}
              Select All
            </span>
            {selected?.length ? (
              <span
                className={` touchable-opacity`}
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "#c74d4d",
                }}
                onClick={() => allOrNothing({ nothing: true })}
              >
                Clear All
              </span>
            ) : (
              <></>
            )}
          </div>

        </div>
      )} */}
    </>
  );
}

export default MEDropdown;

MEDropdown.defaultValues = {
  multiple: false,
  allowClearAndSelectAll: false,
  placeholder: "Enter placeholder text for your dropdown",
};
