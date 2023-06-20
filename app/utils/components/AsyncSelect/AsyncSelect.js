import React, { useEffect } from "react";
import {
  Checkbox,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import useObserver from "../../useObserver";

export default function AsyncSelect({
  items,
  onChange,
  column,
  filterList,
  label,
  index,
  endpoint,
  prepData,
}) {
  const [data, setData] = React.useState(items);
  const { ref, data: newItems, cursor } = useObserver({ data, endpoint });

  useEffect(() => {
    if (prepData) {
      let preppedData = prepData(newItems, data);
      setData(preppedData);
    }
  }, [newItems]);

  const ITEM_HEIGHT = 60;
  const ITEM_PADDING_TOP = 10;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  return (
    <FormControl size="small">
      <InputLabel htmlFor="select-multiple-chip">{label}</InputLabel>
      <Select
        label={label}
        multiple
        MenuProps={MenuProps}
        value={filterList[index]}
        renderValue={(selected) => selected?.slice(0, 3)?.join(", ")} 
        onChange={(event) => {
          filterList[index] = event.target.value;
          onChange(filterList[index], index, column);
        }}
      >
        {data?.map((c) => (
          <MenuItem key={c} value={c}>
            <Checkbox
              color="primary"
              checked={filterList[index].indexOf(c) > -1}
            />
            <ListItemText primary={c} />
          </MenuItem>
        ))}

        {cursor?.has_more && endpoint && (
          <MenuItem value={cursor.next} key={"fetcher-option"} ref={ref}>
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
  );
}
