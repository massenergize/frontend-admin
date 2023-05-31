import React from "react";
import { withStyles } from "@mui/styles";
import { Paper, Chip, Snackbar, Alert } from "@mui/material";
import { Helmet } from "react-helmet";
import { bindActionCreators } from "redux";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import styles from "../../../components/Widget/widget-jss";

import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { reduxLoadMetaDataAction } from "../../../redux/redux-actions/adminActions";
import METable from "../ME  Tools/table /METable";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getHumanFriendlyDate } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";

function ActionUsers({ classes, actions }) {
  const title = brand.name + " - Action Users";
  const description = brand.desc;

  let {id} = useParams();
  const action = (actions||[])?.filter((a) => a.id?.toString() == id?.toString())[0];
  const [snackData, setSnackData] = React.useState({error: null, successMsg: null});
  const[open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackData({error: null, successMsg: null});
      setOpen(false);
    };


  const columns = [
    {
      name: "Recorded At",
      key: "created_at",
      options: {
        filter: false,
      },
    },
    {
      name: "User Name",
      key: "full_name",
      options: {
        filter: false,
      },
    },
    {
      name: "User Email",
      key: "email",
      options: {
        filter: false,
      },
    },
    {
      name: "Unit Name",
      key: "unit_name",
      options: {
        filter: false,
      },
    },
    {
      name: "Unit Type",
      key: "unit_type",
      options: {
        filter: false,
      },
    },
    {
      name: "Carbon Impact",
      key: "carbon_impact",
      options: {
        filter: false,
      },
    },
    {
      name: "Status",
      key: "status",
      options: {
        filter: false,
        customBodyRender: (d) => {
          return (
            <Chip
              label={d}
              className={
                d === "DONE" ? classes.yesLabel : classes.todoLabel
              }
            />
          );
        },
      },
    },
  ];
      const options = {
        filterType: "dropdown",
        responsive: "standard",
        print: true,
        rowsPerPage: 25,
        rowsPerPageOptions: [10, 25, 100],
      };

   const fashionData = (data) => {
     if (!data) return [];
     const fashioned = data.map((d) => [
       getHumanFriendlyDate(d.created_at, true, false),
       d?.full_name,
       d?.email,
       d?.real_estate_unit?.name,
       d?.real_estate_unit?.unit_type,
       d?.carbon_impact,
       d?.status,
     ]);
     return fashioned;
   };

  return (
    <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={snackData?.error ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              <small style={{ marginLeft: 15, fontSize: 15 }}>
                {snackData?.error || snackData?.successMsg}
              </small>
            </Alert>
          </Snackbar>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <Paper style={{ padding: 20, marginBottom: 15 }}>
        <Typography variant="h5" style={{ marginBottom: 10 }}>
          {action?.title}
        </Typography>

        <Link to="/admin/read/actions">Go to all actions</Link>
        {action?.action_users?.length > 0 && (
          <Link
            onClick={(e) => {
              e.preventDefault();
              apiCall("/downloads.action.users", {
                action_id: action?.id,
              }).then((res) => {
                setOpen(true);
                if (res.success) {
                  setSnackData({
                    error: null,
                    successMsg:
                      " Your request has been received. Please check your email for the file.",
                  });
                } else {
                  setSnackData({
                    error: "Unable to download: " + res.error,
                    successMsg: null,
                  });
                }
              });
            }}
            style={{ marginLeft: 20 }}
          >
            Request User Actions CSV
          </Link>
        )}
      </Paper>

      <div className={classes.table}>
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_ACTION_USERS}
          tableProps={{
            title: "Action Users",
            data: fashionData(action?.action_users),
            columns: columns,
            options: options,
          }}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    actions: state.getIn(["allActions"]),
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    meta: state.getIn(["paginationMetaData"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
}
const ActionUsersMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionUsers);

export default withStyles(styles)(withRouter(ActionUsersMapped));
