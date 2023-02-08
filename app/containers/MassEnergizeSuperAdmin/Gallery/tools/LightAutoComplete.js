import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Chip, Paper, TextField, withStyles } from "@material-ui/core";
import { pop } from "../../../../utils/common";
import Typography from "material-ui/styles/typography";

const styles = (theme) => {
  const spacing = theme.spacing.unit;
  return {
    textbox: {
      width: "100%",
    },
    ghostCurtain: {
      position: "absolute",
      top: 100,
      left: 0,
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
      padding: spacing * 2,
      width: "100%",
      cursor: "pointer",
      "&:hover": {
        background: "#e9e9e9",
      },
    },
    chips: {
      margin: "2px",
    },
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
  } = props;

  const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState([]); // keeps a list of all selected items
  const chipWrapperRef = useRef();
  const mount = () => {
    if (!onMount) return;
    onMount(() => setSelected([]));
  };
  const getValue = (item) => {
    if (valueExtractor) return valueExtractor(item);
    return item;
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
    setShowDropdown(false);
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
    setShowDropdown(true);
    const filtered = data.filter((item) => {
      var label = getLabel(item);
      if (label && label.toLowerCase().includes(value)) return item;
    });
    setOptionsToDisplay(filtered);
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
  return (
    <div style={{ position: "relative", width: "100%" }}>
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
                disabled
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
              {optionsToDisplay.length === 0 && (
                <p style={{ padding: 10, color: "lightgray" }}>
                  No results found...
                </p>
              )}
              {optionsToDisplay.map((op, index) => {
                return (
                  <div
                    key={index.toString()}
                    className={classes.dropdownItem}
                    onClick={() => handleSelection(op)}
                  >
                    {getLabel(op)}
                  </div>
                );
              })}
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
};
export default withStyles(styles)(LightAutoComplete);
