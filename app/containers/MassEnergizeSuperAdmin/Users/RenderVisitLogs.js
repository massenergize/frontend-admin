import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { LOADING } from "../../../utils/constants";

function RenderVisitLogs({ addLogsToRedux, id }) {
  const [loading, setLoading] = useState(LOADING);

  const Container = ({ children }) => {
    return <div style={{ width: 300, height: 300 }}>{children}</div>;
  };
  if (loading)
    return (
      <Container>
        {" "}
        <LinearBuffer message="Looking for records..." />
      </Container>
    );
  return (
    <Container>
      <h1>And this is where it all starts meerhn</h1>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return { logs: state.userVisitLogs };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderVisitLogs);
