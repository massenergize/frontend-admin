import React, { useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Paper, Chip } from "@mui/material";
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
import Loader from "../../../utils/components/Loader";

function ActionUsers({ classes }) {
  const title = brand.name + " - Action Users";
  const description = brand.desc;

  let { id } = useParams();
  const [action, setAction] = React.useState({});

  useEffect(() => {
    apiCall("/actions.info", { action_id: id }).then((res) => {
      if (res?.success) {
        setAction(res?.data);
      }
    });
  }, [id]);

  console.log("==== action ===", action?.action_users)

  const columns = [
    {
      name: "Recorded On",
      key: "recorded_at",
      options: {
        filter: false,
      },
    },
    {
      name: "Completed On",
      key: "completed_at",
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
      name: "Where",
      key: "unit_name",
      options: {
        filter: false,
      },
    },
    // {
    //   name: "Unit Type",
    //   key: "unit_type",
    //   options: {
    //     filter: false,
    //   },
    // },
    // {
    //   name: "Carbon Impact",
    //   key: "carbon_impact",
    //   options: {
    //     filter: false,
    //   },
    // },
    {
      name: "Status",
      key: "status",
      options: {
        filter: false,
        customBodyRender: (d) => {
          return (
            <Chip
              label={d}
              className={d === "DONE" ? classes.yesLabel : classes.todoLabel}
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
    downloadOptions: {
      filename: `${action?.title}- Action Users.csv`,
      separator: ",",

    }
  };

  const fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      getHumanFriendlyDate(d?.recorded_at, false, true),
      getHumanFriendlyDate(d?.date_completed, false, true) || "N/A",
      d?.full_name,
      d?.email,
      d?.real_estate_unit?.name,
      // d?.real_estate_unit?.unit_type,
      // d?.carbon_impact,
      d?.status,
    ]);
    return fashioned;
  };
   if(!action?.id ) return <Loader />
  return (
    <div>
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
      </Paper>

      <div className={classes.table}>
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_ACTION_USERS}
          tableProps={{
            title: "Users that have recorded this action",
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
