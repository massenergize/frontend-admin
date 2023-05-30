import React, { useRef, useState, useCallback } from "react";
import { Box, CircularProgress, InputLabel, LinearProgress, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { createStyles, makeStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";


const useStyles = makeStyles((theme) =>
  createStyles({
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
  })
);


function MEDropDown({
  renderGeneralContent,
  updateForm,
  getValue,
  renderFields,
  field,
  getDisplayName,
}) {
  const classes = useStyles();
  const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const [data, setData] = useState(field?.data || []);
  const elementRef = useRef(null);
  const lastDropDownItemRef = useCallback(
    (node) => {
      if (elementRef.current) elementRef.current.disconnect();
      elementRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && cursor.has_more) {
          if (!field?.endpoint) return;
          apiCall(field?.endpoint, {
            page: cursor.next,
            limit: 10,
          }).then((res) => {
            setCursor({
              has_more: res?.cursor?.count > data?.length,
              next: res?.cursor?.next,
            });
            let items = [
              ...data,
              ...(res?.data || [])?.map((item) => {
                return {
                  ...item,
                  displayName: field?.labelExtractor
                    ? field?.labelExtractor(item)
                    : item?.name || item?.title,
                };
              }),
            ];

            setData([
              ...new Map(items.map((item) => [item["id"], item])).values(),
            ]);
          });
        }
      });

      if (node) elementRef.current.observe(node);
    },
    [cursor]
  );

  const ITEM_HEIGHT = 60;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  return (
    <div key={field.name}>
      <FormControl className={classes.field} fullWidth>
        <InputLabel
          htmlFor={field.label}
          className={classes.selectFieldLabel}
        >
          {field.label}
        </InputLabel>
        <Select
          label={field.label}
          name={field.name}
          value={getValue(field.name) || ""}
          onChange={async (newValue) => {
            await updateForm(field.name, newValue.target.value);
          }}
          MenuProps={MenuProps}
        >
          {data?.map((c, index) => (
            <MenuItem value={c.id} key={c.id} sx={{ padding: "15px " }}>
              {" "}
              {c.displayName}
            </MenuItem>
          ))}
          {cursor.has_more && field?.isAsync && (
            <MenuItem
              value={cursor.next}
              key={"fetcher-option"}
              ref={lastDropDownItemRef}
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
        {field.child &&
          getValue(field.name) === field.child.valueToCheck &&
          renderFields(field.child.fields)}
      </FormControl>
    </div>
  );
}

export default MEDropDown
