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

const NO_DATA = "NO_DATA";
function ActionEngagements({ engagements, putItemsInRedux }) {
  const location = useLocation();
  const ids = location.state?.ids || [];
  const type = location.state?.type || ""; // whether TODO or DONE
  const filters = location.state?.options || {};
  console.log("ids", ids, type);

  useEffect(() => {
    const body = {
      actions: ids,
      time_range: filters?.range || null,
      communities: filters?.communities || [],
      end_date: filters?.endDate || null,
      start_date: filters?.startDate || null,
    };
    apiCall("/communities.actions.completed", body).then((response) => {
      console.log("Here is the response", response);
      if (!response.success) console.log(response.error);
      putItemsInRedux({ ...engagements, [type]: response.data || NO_DATA });
    });
  }, []);

  if (engagements === LOADING) return <Loading />;
  var data = engagements[type];
  if (!data) return <Loading />;

  if (!ids.length || data === NO_DATA)
    return (
      <div style={{ padding: 20, background: "white", borderRadius: 10 }}>
        <Typography>We could not find any action engagement data...</Typography>
      </div>
    );

  const fashionData = (_data) => {
    return (_data || []).map((d) => [
      d.id,
      d.name,
      d.category,
      d.done_count,
      d.todo_count,
      d.carbon_total,
    ]);
  };

  const makeColumns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect",
        },
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
          filterType: "multiselect",
        },
      },

      {
        name: "Category",
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
  data = fashionData(data);
  //   ----------------------------------------------------
  return (
    <div>
      <METable
        // classes={classes}
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
