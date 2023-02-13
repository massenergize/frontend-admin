import { Button } from "@mui/material";
import React from "react";
import { generateFilterParams, getFilterData } from "../../helpers";
import { apiCall } from "../../messenger";

export default function ApplyFilterButton({ url, reduxItems, updateReduxFunction, columns, filters, applyFilters}) {
  const handleFilterSubmit = () => {
    const filterList = applyFilters()
    let arr = generateFilterParams(filterList, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
      limit:100
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(res,reduxItems && reduxItems.items,"id");
        updateReduxFunction(filterData.items, filterData.meta);
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
