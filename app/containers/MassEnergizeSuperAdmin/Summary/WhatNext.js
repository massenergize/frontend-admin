import { Typography } from "@material-ui/core";
import React from "react";
import { PapperBlock } from "dan-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
function WhatNext({ data }) {
  const { messages, teams, testimonials, users } = data || {};
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
        <SectionTemplate
          content={messages}
          name="messages"
          description={(count) => `You have ${count} unanswered messages`}
        />
        <SectionTemplate
          content={teams}
          name="teams"
          description={(count) => `You have ${count} unapproved teams`}
        />
        <SectionTemplate
          content={testimonials}
          name="testimonials"
          description={(count) => `You have ${count} unapproved testimonials`}
        />
        <SectionTemplate
          content={users}
          name="users"
          description={(count) =>
            `You have ${count} new registered users since your last sign in`
          }
        />
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

const SectionTemplate = ({ content, name, description }) => {
  if (!content || !content.data || !content.data.length) return <></>;
  const { data } = content;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <div className="next-section-item">
        <Typography
          variant="h6"
          style={{ fontSize: 16, textTransform: "uppercase" }}
        >
          {name}
        </Typography>
        <Typography
          className="text"
          variant="body2"
          style={{
            display: "inline",
            paddingBottom: 7,
          }}
        >
          <span className="me-badge">{data.length}</span>
          {description(data.length)}
          <span style={{ marginLeft: 6 }} className="fa fa-long-arrow-right" />
        </Typography>
      </div>
    </div>
  );
};
