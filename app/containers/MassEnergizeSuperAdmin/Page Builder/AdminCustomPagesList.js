import { Button,Link, Paper, Typography, withStyles } from "@mui/material";
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
          filter: false
        }
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false
        }
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: false
        }
      },
      {
        name: "Created By",
        key: "created-by",
        options: {
          filter: false
        }
      },
      {
        name: "Actions",
        key: "actions",
        options: {}
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
        <Typography variant="p" style={{ margin: "10px 0px" }}>
          Here you can create pages for resource guides, and other topics on your your community sites. You can also set
          which communities can make copies of your pages.
        </Typography>
        <div>
          <Link
            style={{ marginTop: 10, textTransform: "unset" }}
            target="_blank"
            href="/admin/community/configure/navigation/custom-pages"
          >
            Create a Custom Page
          </Link>
          {/* <Button  variant="outlined" color="primary" style={{ marginTop: 10, textTransform: "unset" }}>
            Create a Custom Page
          </Button> */}
        </div>
      </Paper>
      <br />

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.CUSTOM_PAGES}
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
