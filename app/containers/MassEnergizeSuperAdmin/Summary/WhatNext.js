import { Typography } from "@material-ui/core";
import React from "react";
import { PapperBlock } from "dan-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
function WhatNext({ data }) {
  console.log("I think I am the data my gee", data);
  return (
    <PapperBlock
      whiteBg
      icon="ios-help"
      title="What to do next?"
      desc="Here are items you need to take care of"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {[1, 2, 3, 4, 5].map((_) => (
          <div className="next-section-item">
            <Typography variant="h6" style={{ fontSize: 16 }}>
              MESSAGES
            </Typography>
            <Typography
              className="text"
              variant="body2"
              style={{
                display: "inline",
                paddingBottom: 7,
              }}
            >
              <span className="me-badge">65</span>
              You have 65 messages that you have not answered{" "}
              <span
                style={{ marginLeft: 6 }}
                className="fa fa-long-arrow-right"
              />
            </Typography>
          </div>
        ))}
      </div>
    </PapperBlock>
  );
}

const mapStateToProps = (state) => {
  return { data: state.getIn(["nextStepsSummary"]) };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhatNext);
