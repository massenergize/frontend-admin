import React, { useEffect, useState } from "react";
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
      opacity: 0.1,
      zIndex: 100,
    },
    dropdown: {
      borderRadius: 5,
      position: "absolute",
      left: 0,
      top: 100,
      width: "100%",
      zIndex: 105,
      minHeight: 50,
      boxShadow: theme.shadows[7],
      maxHeight: 500,
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
      margin: "0px 6px",
    },
  };
};

function LightAutoComplete(props) {
  const {
    data,
    onChange,
    label,
    id,
    classes,
    labelExtractor,
    valueExtractor,
    defaultSelected,
    onMount,
  } = props;

  const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(defaultSelected); // keeps a list of all selected items

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

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {selected && selected.length > 0 && (
        <div>
          {selected.map((option, index) => {
            return (
              <Chip
                key={index.toString()}
                label={getLabel(option)}
                onDelete={() => handleSelection(option)}
                className={classes.chips}
              />
            );
          })}
        </div>
      )}
      <TextField
        onClick={() => setShowDropdown(true)}
        id={id}
        label={label}
        className={classes.textbox}
        onChange={handleOnChange}
        margin="normal"
        variant="outlined"
        autoComplete="off"
      />
      {showDropdown && (
        <>
          <div
            className={classes.ghostCurtain}
            onClick={() => setShowDropdown(false)}
          />
          <Paper className={classes.dropdown}>
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
  );
}

LightAutoComplete.propTypes = {};
LightAutoComplete.defaultProps = {
  id: "light-auto",
  label: "Search for community...",
  data: ["Option1", "Option2", "Option3"],
  defaultSelected: [],
};
export default withStyles(styles)(LightAutoComplete);
