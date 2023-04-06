import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { reduxLoadVisitLogs } from "../../../redux/redux-actions/adminActions";
import { LOADING } from "../../../utils/constants";

function RenderVisitLogs({ putLogsInRedux, logs, id }) {
  const [loading, setLoading] = useState(LOADING);

  const Container = ({ children }) => {
    return <div style={{ width: 400, height: 300 }}>{children}</div>;
  };
  if (loading)
    return (
      <Container>
        {" "}
        <LinearBuffer message="Looking for records..." />
      </Container>
    );
    return <div></div>
  // return (
  //   <Container>
  //     <div style={{ height: "80%" }}>
  //       <h1>And this is where it all starts meerhn</h1>
  //     </div>

  //     <div
  //       style={{ background: "grey", padding: "10px 25px", display: "flex" }}
  //     >
  //       <button style={{ marginLeft: "auto" }}> Close</button>
  //     </div>
  //   </Container>
  // );
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
