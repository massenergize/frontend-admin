import React from "react";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";

function ManageFeatureFlags({ classes }) {
  const columns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Feature Name",
        key: "feature-name",
      },
      {
        name: "Is For Everyone",
        key: "is-for-everyone",
        options: {
          filter: false,
        },
      },
      {
        name: "Communities",
        key: "selected-communities",
      },
      {
        name: "Expires On",
        key: "expiry-date",
      },
      {
        name: "Manage",
        key: "manage",
      },
    ];
  };
  const options = {
    filterType: "dropdown",
    responsive: "stacked",
    print: true,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 100],
  };
  return (
    <div>
      <METable
        page={PAGE_PROPERTIES.FEATURE_FLAGS}
        classes={classes}
        tableProps={{
          title: "All Features",
          data: [],
          columns: columns,
          options: options,
        }}
      />
    </div>
  );
}

export default ManageFeatureFlags;
