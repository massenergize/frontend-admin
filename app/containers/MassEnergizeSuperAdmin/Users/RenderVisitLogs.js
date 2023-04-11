import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { reduxLoadVisitLogs } from "../../../redux/redux-actions/adminActions";
import { LOADING } from "../../../utils/constants";
import { apiCall } from "../../../utils/messenger";

function RenderVisitLogs({ putLogsInRedux, logs, id }) {
  logs = logs || {};
  console.log("L>Ets see what the ID has to say", id);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);

  const fetchLogs = (id) => {
    apiCall("users.get.visits", { id }).then((response) => {
      setLoading(false);
      if (!response.success)
        return console.log("Error while loading logs: ", response.error);

      setContent(response.data);
      putLogsInRedux({ ...logs, [id]: response.data });
    });
  };

  useEffect(() => {
    // If admin has clicked the modal for a user before, their data would already have been loaded so no need to fetch again, just retrieve from redux
    const cachedVersion = logs[id];
    if (cachedVersion) return setContent(cachedVersion);
    fetchLogs(id);
  }, []);

  const Container = ({ children }) => {
    return <div style={{ width: 400, height: 300 }}>{children}</div>;
  };
  // if (loading)
  //   return (
  //     <Container>
  //       {" "}
  //       <LinearBuffer message="Looking for records..." />
  //     </Container>
  //   );

  return (
    <Container>
      <Typography
        variant="h6"
        style={{
          color: "black",
          border: "solid 0px rgb(236 236 236)",
          borderBottomWidth: 2,
          paddingBottom: 7,
        }}
      >
        Akwesi Frimpong{" "}
      </Typography>
      <br />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {[1, 2, 3, 4, 5, 6].map((item) => {
          return (
            <Typography
              variant="body"
              style={{ marginBottom: 5, color: "#444040" }}
            >
              <i
                className="fa fa-clock"
                style={{ marginRight: 6, color: "#e8e8e8" }}
              />{" "}
              <span> 22nd March 1998 9:15 AM</span>
            </Typography>
          );
        })}
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return { logs: state.userVisitLogs };
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
