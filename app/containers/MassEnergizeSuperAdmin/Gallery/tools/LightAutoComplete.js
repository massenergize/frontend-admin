import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Checkbox, Chip, CircularProgress, Paper, TextField } from "@mui/material";
import { pop } from "../../../../utils/common";
import { withStyles } from "@mui/styles";
import useObserver from "../../../../utils/useObserver";

const styles = (theme) => {
  return {
    textbox: {
      width: "100%"
    },
    ghostCurtain: {
      position: "absolute",
      top: 100,
      left: "-100px",
      width: "100vw",
      height: "100vh",
      background: "white",
      opacity: 0,
      zIndex: 100
    },
    dropdown: {
      borderRadius: 5,
      position: "absolute",
      left: 0,
      top: 100,
      width: "100%",
      zIndex: 111,
      minHeight: 50,
      boxShadow: theme.shadows[7],
      maxHeight: 330,
      overflowY: "scroll"
    },
    dropdownItem: {
      padding: 10,
      width: "100%",
      cursor: "pointer",
      "&:hover": {
        background: "#e9e9e9"
      }
    },
    chips: {
      margin: "2px",
      opacity: "1"
    },
    option: {
      textDecoration: "underline",
      cursor: "pointer"
    },
    container: {},
    error: {},
    header: {},
    dropdownArea: {},
    success: {}
  };
};

function LightAutoComplete(props) {
  const {
    data, // array of items to display (Items must be objects, not strings)
    onChange,
    label,
    placeholder,
    id,
    classes,
    labelExtractor,
    valueExtractor,
    defaultSelected,
    onMount,
    disabled,
    allowChipRemove,
    containerStyle,
    multiple,
    showSelectAll = true,
    endpoint,
    args,
    params,
    selectAllV2, // If true, the component will only show one chip with the text "All" and will not show the list of selected items
    showHiddenList,
    renderItemsListDisplayName,
    shortenListAfter, 
    renderSelectedItems
  } = props;

  const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);
  // const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState([]); // keeps a list of all selected items
  const chipWrapperRef = useRef();
  // -------------------------------------------------------

  const items = query ? filteredItems : optionsToDisplay;
  const { ref, data: newItems, cursor } = useObserver({
    data: items,
    endpoint,
    args,
    params: { search_text: query, ...(params || {}) }
  });
  useEffect(() => {
    let newItemsConstructed = (newItems || [])?.map((item) => {
      return {
        ...item,
        displayName: getLabel(item)
      };
    });
    let all = [...(items || []), ...(newItemsConstructed || [])];
    const uniqueItems = [...new Map(all.map((item) => [item["id"], item])).values()];
    if (query) setFilteredItems(uniqueItems);
    setOptionsToDisplay(uniqueItems);
  }, [newItems]);

  const mount = () => {
    if (!onMount) return;
    onMount(() => setSelected([]));
  };
  const getValue = (item) => {
    if (valueExtractor) return valueExtractor(item);
    return item;
  };
  const allOrNothing = ({ nothing, data }) => {
    if (selectAllV2) return allOrNothing2({ nothing });
    if (nothing) {
      setSelected([]);
      return transfer([]);
    }
    const values = (data || []).map((itm) => getValue(itm));
    setSelected(data);
    transfer(data);
  };

  const allOrNothing2 = ({ nothing }) => {
    if (nothing) {
      setSelected([]);
      transfer([]);
      return;
    }
    setSelected(["all"]);
    transfer(["all"]);
    setShowDropdown(false);
  };

  const isAll = (item) => {
    return typeof item === "string" && item?.toLowerCase() === "all";
  };

  const getLabel = (item) => {
    if (multiple && isAll(item)) return "All";
    if (labelExtractor) return labelExtractor(item);
    return item;
  };

  const transfer = (content) => {
    if (onChange) return onChange(content);
  };

  const handleSelection = (item) => {
    var value = getValue(item);
    var [found, rest] = pop(selected, value, getValue);

    if (!isAll(item)) {
      // If the item is not "All", then we remove the "All" item from the list (if it exists)
      // We want to give the effect that the user has deselected "All" by selecting a specific item
      var [_, remaining] = pop(rest, "all");
      rest = remaining;
    }

    if (!multiple) setShowDropdown(false);
    if (found) {
      setSelected(rest);
      return transfer(rest);
    }
    rest = [...rest, item];
    setSelected(rest);
    transfer(rest);
  };

  const handleOnChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setQuery(value);
    if (!multiple) setShowDropdown(false);
    const filtered = optionsToDisplay?.filter((item) => {
      var label = getLabel(item);
      if (label && label.toLowerCase().includes(value)) {
        return item;
      }
    });
    setFilteredItems(filtered);
  };

  useEffect(() => mount(), []);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const increasedRatio = () => {
    const height = chipWrapperRef.current ? chipWrapperRef.current.clientHeight : 0;
    return height;
  };

  const onlyValues = (selected || []).map((itm) => getValue(itm)).filter((itm) => itm);
  const thereAreNoOptionsToDisplay = query ? filteredItems?.length === 0 : optionsToDisplay.length === 0;
  const userHasSelectedStuff = selected.length;

  const handleSelectionRender = () => {
    if (renderSelectedItems) return renderSelectedItems(selected, setSelected);
    return showHiddenList && selected?.length > (shortenListAfter || 5) ? (
      renderItemsListDisplayName ? (
        renderItemsListDisplayName(selected, setSelected)
      ) : (
        <span
          onClick={() => showHiddenList && showHiddenList(selected, setSelected)}
          style={{
            cursor: "pointer",
            color: "blue"
          }}
        >
          View full list
        </span>
      )
    ) : (
      selected?.length > 0 && (
        <>
          {selected.map((option, index) => {
            var deleteOptions = { onDelete: () => handleSelection(option) };
            deleteOptions = allowChipRemove ? deleteOptions : {};
            return (
              <Chip key={index?.toString()} label={getLabel(option)} {...deleteOptions} className={classes.chips} />
            );
          })}
        </>
      )
    );
  };

  const updateSelectedFromOutside = (newSelected) => {
    setSelected(newSelected);
    transfer(newSelected)
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginTop: 0
      }}
      key={props?.key}
    >

      <div ref={chipWrapperRef}>{handleSelectionRender()}</div>
      <div ref={chipWrapperRef}>
        {showHiddenList && selected?.length > (shortenListAfter || 5) ? (
          renderItemsListDisplayName ? (
            renderItemsListDisplayName(selected, updateSelectedFromOutside)
          ) : (
            <span
              onClick={() => showHiddenList && showHiddenList(selected, updateSelectedFromOutside)}
              style={{
                cursor: "pointer",
                color: "blue"
              }}
            >
              View full list
            </span>
          )
        ) : (
          selected?.length > 0 && (
            <>
              {selected.map((option, index) => {
                var deleteOptions = { onDelete: () => handleSelection(option) };
                deleteOptions = allowChipRemove ? deleteOptions : {};
                return (
                  <Chip key={index?.toString()} label={getLabel(option)} {...deleteOptions} className={classes.chips} />
                );
              })}
            </>
          )
        )}
      </div>
      <GhostDropdown
        show={showDropdown}
        close={() => setShowDropdown(false)}
        style={{
          top: -500,
          height: 500
        }}
        classes={classes}
      />
      <div style={containerStyle || {}}>
        <div style={{ position: "relative" }}>
          <i className=" fa fa-search" style={{ position: "absolute", top: 26, left: 15, color: "#a5a5a5" }} />
          <i className=" fa fa-caret-down" style={{ position: "absolute", top: 26, right: 15, color: "#a5a5a5" }} />
          <input
            onChange={handleOnChange}
            onClick={() => {
              !disabled && setShowDropdown(true);
            }}
            style={{
              padding: "10px 35px",
              width: "100%",
              margin: "10px 0px"
            }}
            placeholder={placeholder || label}
          />
        </div>

        {/* <TextField */}
        {/*   disabled={disabled} */}
        {/*   onClick={() => { */}
        {/*     !disabled && setShowDropdown(true); */}
        {/*   }} */}
        {/*   id={id} */}
        {/*   label={placeholder || label} */}
        {/*   className={classes.textbox} */}
        {/*   onChange={handleOnChange} */}
        {/*   margin="normal" */}
        {/*   variant="outlined" */}
        {/*   autoComplete="off" */}
        {/* /> */}
        {showDropdown && (
          <>
            <GhostDropdown show={showDropdown} classes={classes} close={() => setShowDropdown(false)} />
            <Paper
              className={classes.dropdown}
              style={{
                top: 60 + increasedRatio(),
                maxHeight: 220
              }}
            >
              {thereAreNoOptionsToDisplay && (
                <p
                  style={{
                    padding: 10,
                    color: "lightgray"
                  }}
                >
                  No results found...
                </p>
              )}

              {multiple && !thereAreNoOptionsToDisplay && showSelectAll && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10
                    }}
                  >
                    <span
                      onClick={() => allOrNothing({ data: optionsToDisplay })}
                      className={`${classes.option} touchable-opacity`}
                      style={{ marginRight: 15 }}
                    >
                      {" "}
                      Select All
                    </span>

                    {userHasSelectedStuff ? (
                      <span
                        className={`${classes.option} touchable-opacity`}
                        onClick={() => allOrNothing({ nothing: true })}
                      >
                        Clear
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr style={{ margin: 0 }} />
                </div>
              )}

              {(query ? filteredItems : optionsToDisplay).map((op, index) => {
                return (
                  <div
                    key={index?.toString()}
                    className={classes.dropdownItem}
                    onClick={() => handleSelection(op)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    {multiple && (
                      <Checkbox
                        style={{
                          padding: 0,
                          marginRight: 6
                        }}
                        checked={onlyValues.includes(getValue(op))}
                      />
                    )}
                    {getLabel(op)}
                  </div>
                );
              })}
              {endpoint && cursor?.has_more ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                  ref={ref}
                >
                  <CircularProgress size={20} />
                </Box>
              ) : null}
            </Paper>
          </>
        )}
      </div>
    </div>
  );
}

const GhostDropdown = ({ classes, close, show, style = {} }) => {
  if (!show) return <></>;
  return <div className={classes.ghostCurtain} onClick={() => close()} style={style} />;
};
LightAutoComplete.propTypes = {};
LightAutoComplete.defaultProps = {
  id: "light-auto",
  label: "Search for community...",
  data: ["Option1", "Option2", "Option3"],
  defaultSelected: [],
  allowChipRemove: true,
  multiple: false,
  showHiddenList: null, // boolean: true if you want the list of selected items to be truncated after a count of 5
  renderItemsListDisplayName: null // function(component): renders  a button or text to display which toggles the list of selected items.
};
export default withStyles(styles)(LightAutoComplete);
