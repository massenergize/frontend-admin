import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LOADING } from "../../../utils/constants";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import Loading from "dan-components/Loading";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { apiCall } from "../../../utils/messenger";
import { bindActionCreators } from "redux";
import { reduxLoadActionEngagements } from "../../../redux/redux-actions/adminActions";

function ActionEngagements({ engagements, putItemsInRedux }) {
  const location = useLocation();
  const ids = location.state?.ids || [];
  useEffect(() => {
    apiCall("/communities.actions.completed", { actions: ids }).then(
      (response) => {
        console.log("Here is the response", response);
        if (!response.success) console.log(response.error);
        putItemsInRedux(response.data);
      }
    );
  }, []);
  if (!ids.length || !engagements)
    return (
      <div style={{ padding: 20, background: "white", borderRadius: 10 }}>
        <Typography>Sorry, we could not load the action engagements</Typography>
      </div>
    );
  if (engagements === LOADING) return <Loading />;
  const fashionData = (data) => {
    return (data || []).map((d) => [
      d.id,
      d.category,
      d.done_count,
      d.todo_count,
      d.carbon_total,
    ]);
  };
  const makeColumns = () => {
    return [
      {
        name: "name",
        key: "name",
        options: {
          filter: false,
          filterType: "multiselect",
        },
      },
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect",
        },
      },
      {
        name: "category",
        key: "category",
        options: {
          filter: false,
        },
      },
      {
        name: "# Done",
        key: "done",
        options: {
          filter: false,
        },
      },
      {
        name: "# Todo",
        key: "todo",
        options: {
          filter: false,
        },
      },
      {
        name: "Carbon Savings",
        key: "carbon",
        options: {
          filter: false,
        },
      },
    ];
  };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 100],
  };

  const data = fashionData(actionCountObjs);
  return (
    <div>
      <METable
        classes={classes}
        page={PAGE_PROPERTIES.ACTION_ENGAGEMENTS}
        tableProps={{
          title: "Action Engagements",
          data,
          columns: makeColumns(),
          options: options,
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { engagements: state.getIn(["actionEngagements"]) };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putItemsInRedux: reduxLoadActionEngagements,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionEngagements);
