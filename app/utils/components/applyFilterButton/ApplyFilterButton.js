import { Button } from "@mui/material";
import React from "react";
import { generateFilterParams, getFilterData } from "../../helpers";
import { apiCall } from "../../messenger";

export default function ApplyFilterButton({ url, reduxItems, updateReduxFunction, columns, limit, applyFilters, name, meta, updateMetaData}) {
  const handleFilterSubmit = () => {
    const filterList = applyFilters()
    let arr = generateFilterParams(filterList, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
      limit:limit
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(res,reduxItems);
        updateReduxFunction(res.data);
        updateMetaData({ ...meta, [name]: res.cursor });
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 10,
      }}
    >
      <Button variant="contained" onClick={() => handleFilterSubmit()}>
        Apply Filters
      </Button>
    </div>
  );
}
