import { Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { reduxLoadVisitLogs } from "../../../redux/redux-actions/adminActions";
import { getHumanFriendlyDate } from "../../../utils/common";
import { LOADING } from "../../../utils/constants";
import { apiCall } from "../../../utils/messenger";

function RenderVisitLogs({ putLogsInRedux, logs, id, users }) {
  logs = logs || {};
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const userInQuestion = useMemo(() => users?.find((user) => user?.id === id), [
    users,
    id,
  ]);

  const fetchLogs = (id) => {
    apiCall("users.get.visits", { id }).then((response) => {
      setLoading(false);
      if (!response.success)
        return console.log("Error while loading logs: ", response.error);
      const isEmpty = Object.keys(response.data).length === 0;
      const data = isEmpty ? [] : response.data;
      setContent(data);
      putLogsInRedux({ ...logs, [id]: data });
    });
  };

  useEffect(() => {
    // If admin has clicked the modal for a user before, their data would already have been loaded so no need to fetch again, just retrieve from redux
    const cachedVersion = logs[id];
    if (cachedVersion) {
      setLoading(false);
      return setContent(cachedVersion);
    }
    fetchLogs(id);
  }, []);

  const Container = ({ children }) => {
    return (
      <div style={{ width: 400, height: 300 }}>
        <Typography
          variant="h6"
          style={{
            color: "black",
            border: "solid 0px rgb(236 236 236)",
            borderBottomWidth: 2,
            paddingBottom: 7,
          }}
        >
          {userInQuestion?.full_name || "..."}
        </Typography>
        <br />
        {children}
      </div>
    );
  };
  if (loading)
    return (
      <Container>
        {" "}
        <LinearBuffer message="Looking for records..." />
      </Container>
    );
  if (content.length === 0)
    return (
      <Container>
        <Typography
          variant="body"
          style={{ marginBottom: 5, color: "#444040" }}
        >
          Sorry, we could not find any sign in logs related to this user...
          {/* I am using March because its around that time that we started recording user portal signins with Footages  */}
        </Typography>
      </Container>
    );

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {content.map((log) => {
          return (
            <Typography
              variant="body"
              style={{ marginBottom: 5, color: "#444040" }}
            >
              <i
                className="fa fa-clock"
                style={{ marginRight: 6, color: "#e8e8e8" }}
              />{" "}
              {/*  Uncomment this if we are using logs instead of footages */}
              {/* <span> {getHumanFriendlyDate(log, true, false)}</span> */}
              <span> {getHumanFriendlyDate(log.created_at, true, false)}</span>
            </Typography>
          );
        })}
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    logs: state.getIn(["userVisitLogs"]),
    users: state.getIn(["allUsers"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putLogsInRedux: reduxLoadVisitLogs,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderVisitLogs);
