import { Button } from "@material-ui/core";
import React from "react";
import { generateFilterParams, getFilterData } from "../../helpers";
import { apiCall } from "../../messenger";

export default function ApplyFilterButton({ url, reduxItems, updateReduxFunction, columns, filters }) {
  const handleFilterSubmit = () => {
    let newFilters = [...filters]
    console.log("==== Filters =====", filters);
    let arr = generateFilterParams(newFilters, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(
          res.data,
          reduxItems && reduxItems.items,
          "id"
        );
        updateReduxFunction(filterData);
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
