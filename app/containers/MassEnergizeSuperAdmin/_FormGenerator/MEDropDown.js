import React, { useRef, useState, useCallback } from "react";
import { InputLabel } from "@mui/material";
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


  // console.log("=== lastDropDownItemRef ===", lastDropDownItemRef);
  return (
    <div key={field.name}>
      <FormControl className={classes.field}>
        {/* {renderGeneralContent(field)} */}
        <InputLabel
          htmlFor={field.label}
          className={classes.selectFieldLabel}
        >
          {field.label}
        </InputLabel>
        <Select
          native
          label={field.label}
          name={field.name}
          onChange={async (newValue) => {
            await updateForm(field.name, newValue.target.value);
          }}
          inputProps={{
            id: "age-native-simple",
          }}
        >
          <option value={getValue(field.name)}>
            {getDisplayName(field.name, getValue(field.name), field.data)}
          </option>
          {data?.map((c, index) => (
            <option value={c.id} key={c.id} ref={index === data?.length-1 && field?.isAsync ? lastDropDownItemRef : null}>
              {c.displayName}
            </option>
          ))}
        </Select>
        {field.child &&
          getValue(field.name) === field.child.valueToCheck &&
          renderFields(field.child.fields)}
      </FormControl>
    </div>
  );
}

export default MEDropDown
