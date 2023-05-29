import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Checkbox, Chip, LinearProgress, Paper, TextField } from "@mui/material";
import { pop } from "../../../../utils/common";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../../utils/messenger";

const styles = (theme) => {
  return {
    textbox: {
      width: "100%",
    },
    ghostCurtain: {
      position: "absolute",
      top: 100,
      left: "-100px",
      width: "100vw",
      height: "100vh",
      background: "white",
      opacity: 0,
      zIndex: 100,
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
      overflowY: "scroll",
    },
    dropdownItem: {
      padding: 16,
      width: "100%",
      cursor: "pointer",
      "&:hover": {
        background: "#e9e9e9",
      },
    },
    chips: {
      margin: "2px",
      opacity: "1",
    },
    option: {
      textDecoration: "underline",
      cursor: "pointer",
    },
    container: {},
    error: {},
    header: {},
    dropdownArea: {},
    success: {},
  };
};

function LightAutoComplete(props) {
  const {
    data,
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
    isAsync,
    endpoint,
    args
  } = props;

  const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);
  const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState([]); // keeps a list of all selected items
  const chipWrapperRef = useRef();
  // -------------------------------------------------------
  const elementObserver = useRef(null);
  const lastAutoCompleteItemRef = useCallback(
    (node) => {
      if (elementObserver.current) elementObserver.current.disconnect();

      elementObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && cursor.has_more) {
          if (!endpoint) return;
          apiCall(endpoint, {
            page: cursor.next,
            limit: 10,
            ...(args || {}),
            params: JSON.stringify({ search_text: query || ""}),
          }).then((res) => {
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
              ...new Map(
                items.map((item) => [item["id"], item])
              ).values(),
            ]);
          });
        }
      });

      if (node) elementObserver.current.observe(node);
    },
    [cursor]
  );
  // ----------------------------------------------------
  const mount = () => {
    if (!onMount) return;
    onMount(() => setSelected([]));
  };
  const getValue = (item) => {
    if (valueExtractor) return valueExtractor(item);
    return item;
  };
  const allOrNothing = ({ nothing, data }) => {
    if (nothing) {
      setSelected([]);
      return transfer([]);
    }
    const values = (data || []).map((itm) => getValue(itm));
    setSelected(data);
    transfer(data);
  };

  const getLabel = (item) => {
    if (labelExtractor) return labelExtractor(item);
    return item;
  };

  const transfer = (content) => {
    if (onChange) return onChange(content);
  };

  const handleSelection = (item) => {
    var value = getValue(item);
    var [found, rest] = pop(selected, value, getValue);
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
      if (label && label.toLowerCase().includes(value)) return item;
    });
    setFilteredItems(filtered);
  };

  useEffect(() => mount(), []);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const increasedRatio = () => {
    const height = chipWrapperRef.current
      ? chipWrapperRef.current.clientHeight
      : 0;
    return height;
  };
  const onlyValues = (selected || []).map((itm) => getValue(itm));
  const thereAreNoOptionsToDisplay = optionsToDisplay.length === 0;
  const userHasSelectedStuff = selected.length;


  const toggleRef = (index)=>{
    if(((query && filteredItems.length-1 === index)|| (index === optionsToDisplay.length - 1) )&& isAsync) return lastAutoCompleteItemRef
    return null
  }

  return (
    <div style={{ position: "relative", width: "100%", marginTop: 19 }}>
      {selected && selected.length > 0 && (
        <div ref={chipWrapperRef}>
          {selected.map((option, index) => {
            var deleteOptions = { onDelete: () => handleSelection(option) };
            deleteOptions = allowChipRemove ? deleteOptions : {};
            return (
              <Chip
                key={index.toString()}
                label={getLabel(option)}
                {...deleteOptions}
                className={classes.chips}
              />
            );
          })}
        </div>
      )}
      <GhostDropdown
        show={showDropdown}
        close={() => setShowDropdown(false)}
        style={{ top: -500, height: 500 }}
        classes={classes}
      />
      <div style={containerStyle || {}}>
        <TextField
          disabled={disabled}
          onClick={() => {
            !disabled && setShowDropdown(true);
          }}
          id={id}
          label={placeholder || label}
          className={classes.textbox}
          onChange={handleOnChange}
          margin="normal"
          variant="outlined"
          autoComplete="off"
        />
        {showDropdown && (
          <>
            <GhostDropdown
              show={showDropdown}
              classes={classes}
              close={() => setShowDropdown(false)}
            />
            <Paper
              className={classes.dropdown}
              style={{ top: 70 + increasedRatio() }}
            >
              {thereAreNoOptionsToDisplay && (
                <p style={{ padding: 10, color: "lightgray" }}>
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
                      padding: 16,
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

              {(query && filteredItems?.length
                ? filteredItems
                : optionsToDisplay
              ).map((op, index) => {
                return (
                  <div
                    key={index.toString()}
                    className={classes.dropdownItem}
                    onClick={() => handleSelection(op)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {multiple && (
                      <Checkbox
                        style={{ padding: 0, marginRight: 6 }}
                        checked={onlyValues.includes(getValue(op))}
                      />
                    )}
                    {getLabel(op)}
                  </div>
                );
              })}
              {isAsync && cursor.has_more ? (
                  <Box sx={{ width: "100%" }} ref={lastAutoCompleteItemRef}>
                    <LinearProgress />
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
  return (
    <div
      className={classes.ghostCurtain}
      onClick={() => close()}
      style={style}
    />
  );
};
LightAutoComplete.propTypes = {};
LightAutoComplete.defaultProps = {
  id: "light-auto",
  label: "Search for community...",
  data: ["Option1", "Option2", "Option3"],
  defaultSelected: [],
  allowChipRemove: true,
  multiple: false,
};
export default withStyles(styles)(LightAutoComplete);
