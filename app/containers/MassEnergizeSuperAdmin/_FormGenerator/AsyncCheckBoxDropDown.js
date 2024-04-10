import React, { useRef, useState, useCallback } from "react";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import { createStyles, makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";
import { Box, CircularProgress, MenuItem } from "@mui/material";
import { apiCall } from "../../../utils/messenger";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 30,
    },
    field: {
      width: "100%",
      marginBottom: 20,
    },
    fieldBasic: {
      width: "100%",
      marginBottom: 20,
      marginTop: 10,
    },
    inlineWrap: {
      display: "flex",
      flexDirection: "row",
    },
    buttonInit: {
      margin: theme.spacing(4),
      textAlign: "center",
    },
  })
);

function AsyncDropDown({
  field,
  renderGeneralContent,
  getValue,
  getDisplayName,
  isThisSelectedOrNot,
  handleCheckBoxSelect,
  handleCheckboxToggle,
  MenuProps,
}) {
  const classes = useStyles();
  const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const [data, setData] = useState(field?.data || []);
  const elementRef = useRef(null);
  const lastItemRef = useCallback(
    (node) => {
      if (elementRef.current) elementRef.current.disconnect();
      elementRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && cursor.has_more) {
          if (!field?.endpoint) return;
          apiCall(field?.endpoint, { page: cursor.next, limit: 10 }).then(
            (res) => {
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
            }
          );
        }
      });

      if (node) elementRef.current.observe(node);
    },
    [cursor]
  );

  if (field.data) {
    let value = getValue && getValue(field.name);
    return (
      <div key={field.name}>
        <div className={classes.field}>
          <FormControl component="fieldset">
            {/* {renderGeneralContent(field)} */}
            <FormLabel component="legend">{field.label}</FormLabel>
            <Select
              multiple
              displayEmpty
              name={field.name}
              value={getValue(field.name) || []}
              input={<Input id="select-multiple-chip" />}
              onClose={() => field?.onClose && field.onClose(value)}
              renderValue={(selected) => {
                return (
                  <div
                    className={classes.chips}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {(selected || []).map((id) => (
                      <Chip
                        key={id}
                        label={getDisplayName(field.name, id, data)}
                        className={classes.chip}
                        style={{ margin: 5 }}
                      />
                    ))}
                  </div>
                );
              }}
              MenuProps={MenuProps}
            >
              {data.map((t, i) => {
                const isChecked =
                  isThisSelectedOrNot && isThisSelectedOrNot(field.name, t.id);
                return (
                  <MenuItem key={t.id}>
                    <FormControlLabel
                      key={t.id}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(event) =>
                            handleCheckBoxSelect(event, field.selectMany, field)
                          }
                          value={t.id}
                          name={field.name}
                        />
                      }
                      label={t.displayName}
                    />
                  </MenuItem>
                );
              })}

              {cursor.has_more && field?.isAsync && (
                <MenuItem
                  value={cursor.next}
                  key={"fetcher-option"}
                  ref={lastItemRef}
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
          <br />
        </div>
      </div>
    );
  } else {
    // single checkbox
    const checked = typeof value == "string" ? value === "true" : value;
    return (
      <div key={field.name + field.label}>
        <FormControlLabel
          label={field.label}
          control={
            <Checkbox
              checked={checked} //{field.isRequired}
              label={field.label}
              name={field.name}
              onChange={handleCheckboxToggle}
              disabled={field.readOnly}
            />
          }
        />
      </div>
    );
  }
}
export default AsyncDropDown;
