import { Paper, Typography, withStyles } from "@mui/material";
import React from "react";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from "../../../utils/constants";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

function AdminCustomPagesList({ classes }) {
  const makeColumns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect"
        }
      },
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect"
        }
      },
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect"
        }
      }
    ];
  };
  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
    rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS
    // count: metaData && metaData.count,
    // confirmFilters: true,
    // onRowsDelete: (rowsDeleted) => {
    //   const idsToDelete = rowsDeleted.data;
    //   idsToDelete.forEach((d) => {
    //     const email = data[d.dataIndex][2];
    //     apiCall("/teams.removeMember", { team_id: team.id, email });
    //   });
    // },
  };
  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6">Manage your custom pages</Typography>
        <Typography variant="p">
          Here you can create pages for resrouce guides, and other topics on your your community sites. You can also set
          which communities can make copies of your pages.
        </Typography>
      </Paper>
      <br />

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.ALL_ACTIONS}
        tableProps={{
          title: "All Custom Pages",
          data: [],
          columns: makeColumns(),
          options: options
        }}
        //   saveFilters={this.state.saveFilters}
      />
    </div>
  );
}
export default AdminCustomPagesList;
