import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LOADING } from "../../../utils/constants";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import Loading from "dan-components/Loading";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { apiCall } from "../../../utils/messenger";
import { bindActionCreators } from "redux";
import { reduxLoadActionEngagements } from "../../../redux/redux-actions/adminActions";
import { TIME_RANGE } from "../Summary/CommunityEngagement";

const NO_DATA = "NO_DATA";
const DONE = "DONE";
const TODO = "TODO";
function ActionEngagements({ engagements, putItemsInRedux }) {
  const history = useHistory();
  const location = useLocation();
  const ids = location.state?.ids || [];
  const type = location.state?.type || ""; // whether TODO or DONE
  const filters = location.state?.options || {};

  useEffect(() => {
    const body = {
      actions: ids,
      time_range: filters?.range[0] || null,
      communities: filters?.communities || [],
      end_date: filters?.endDate || null,
      start_date: filters?.startDate || null,
    };
    apiCall("/communities.actions.completed", body).then((response) => {
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
        <Typography>
          We could not find any action engagement data...{" "}
          <Link onClick={() => history.goBack()}>Go Back</Link>
        </Typography>
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

  const makeTitle = () => {
    const titles = {
      TODO: "Actions added to Todo list",
      DONE: "Actions completed",
    };
    var title = titles[type];
    const tr = (filters?.range || [])[0];
    const range = TIME_RANGE.find((a) => a.key === tr);
    if (!range) return title;
    if (tr !== "custom") return `${title} in the ${range.name}`;

    return `${title} from (${filters.startDateString} to ${
      filters.endDateString
    })`;
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
        name: "# Compeleted",
        key: "done",
        options: {
          display: type === DONE ? true : false,
          filter: false,
        },
      },
      {
        name: "# Todo",
        key: "todo",
        options: {
          display: type === TODO ? true : false,
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
          title: makeTitle(),
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
