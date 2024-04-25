import React from "react";
import {
  Chip,
  Grid,
  Checkbox,
  Button
} from "@mui/material";

export default function FullAudienceList({ items, audienceDisplayName, setItems, onCancel }) {
    const [checkedItems, setCheckedItems] = React.useState([...items]);

  const handleChecked = (e, item) => {
      
    let itemAlreadyIn = checkedItems.filter((i) => i.id === item.id)?.length>0
    if (!itemAlreadyIn) {
      setCheckedItems([...checkedItems, item]);
    } else {
      setCheckedItems(checkedItems.filter((i) => i.id !== item.id));
    }
  }
  return (
    <div style={{ width: "100%", padding: "10px 15px" }}>
      <Grid
        container
        spacing={1}
        sx={{ maxHeight: "50vh", overflow: "auto", padding: "10px 15px" }}
      >
        {items.map((item, index) => {
          return (
            <Grid item xs={6} md={6} lg={6} xl={6} key={index}>
              <Chip
                label={audienceDisplayName(item)}
                variant="outlined"
                icon={
                  <Checkbox
                    checked={
                      checkedItems.filter((i) => i.id === item.id)?.length > 0
                    }
                    onChange={(e) => {
                      handleChecked(e, item);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      border: "1px solid ##f6eeee",
                    }}
                  />
                }
              />
            </Grid>
          );
        })}
      </Grid>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 15px" }}>
        <Button variant="text" onClick={() => onCancel()} >Cancel</Button>
        <Button variant="text" onClick={()=>{
          setItems(checkedItems)
          onCancel()
        }}>Update List</Button>
      </div>
    </div>
  );
}
