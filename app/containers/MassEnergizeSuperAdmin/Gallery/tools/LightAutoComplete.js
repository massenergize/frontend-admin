import React, { useState } from "react";
import PropTypes from "prop-types";
import { Chip, Paper, TextField, withStyles } from "@material-ui/core";
import { pop } from "../../../../utils/common";

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
  } = props;

  const [optionsToDisplay, setOptionsToDisplay] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState([]); // keeps a list of all selected items

  console.log("I am teh selected", selected);

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
    // setShowDropdown(false);
    if (found) {
      setSelected(rest);
      return transfer(rest);
    }
    rest = [...rest, item];
    setSelected(rest);
    transfer(rest);
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setShowDropdown(true);
    if (!value || value.trim() === "") return;
    const filtered = data.filter((item) => {
      var label = getLabel(item);
      if (label.includes(value)) return item;
    });
    setOptionsToDisplay(filtered);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {selected && selected.length > 0 && (
        <div>
          {selected.map((option) => {
            return (
              <Chip
                label={getLabel(option)}
                onDelete={() => handleSelection(option)}
                className={classes.chips}
              />
            );
          })}
        </div>
      )}
      <TextField
        id={id}
        label={label}
        className={classes.textbox}
        onChange={handleOnChange}
        margin="normal"
        variant="outlined"
      />
      {showDropdown && (
        <>
          <div
            className={classes.ghostCurtain}
            onClick={() => setShowDropdown(false)}
          />
          <Paper className={classes.dropdown}>
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
  data: ["him", "here", "hise"],
};
export default withStyles(styles)(LightAutoComplete);
