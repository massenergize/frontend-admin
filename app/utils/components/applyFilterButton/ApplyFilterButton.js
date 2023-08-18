import { Button } from "@mui/material";
import React, {useEffect} from "react";
import { generateFilterParams, getFilterData } from "../../helpers";
import { apiCall } from "../../messenger";

export default function ApplyFilterButton({ url, reduxItems, updateReduxFunction, columns, limit, applyFilters, name, meta, updateMetaData, otherArgs}) {
  const handleFilterSubmit = () => {
    const filterList = applyFilters()
    let arr = generateFilterParams(filterList, columns);
    apiCall(url, {
      params: JSON.stringify(arr),
      limit: limit,
      ...(otherArgs || {}),
    }).then((res) => {
      if (res && res.success) {
        let filterData = getFilterData(res, reduxItems);
        updateReduxFunction(filterData);
        updateMetaData({ ...meta, [name]: res.cursor });
      }
    });
  };

    useEffect(() => {
      const keyDownHandler = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleFilterSubmit()
        }
      };
      document.addEventListener("keydown", keyDownHandler);
      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }, []);

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
