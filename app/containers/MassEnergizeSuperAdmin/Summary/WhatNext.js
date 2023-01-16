import { Typography } from "@material-ui/core";
import React from "react";
import { PapperBlock } from "dan-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
function WhatNext({ data }) {
  const { messages, teams, testimonials, users, team_messages } = data || {};
  if (!Object.keys(data).length) return <></>;

  const history = useHistory();
  console.log("I think I am the data my gee", data);
  return (
    <PapperBlock
      whiteBg
      icon="ios-help"
      title="What to do next?"
      desc="Here are items you need to take care of "
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
          name="Messages"
          description={(count) => `You have ${count} unanswered messages`}
          onClick={() =>
            history.push({
              pathname: "/admin/read/community-admin-messages",
              state: { ids: messages && messages.data },
            })
          }
        />
        <SectionTemplate
          content={team_messages}
          name="Team Messages"
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
)(withRouter(WhatNext));

const SectionTemplate = ({ content, name, description, onClick }) => {
  if (!content || !content.data || !content.data.length) return <></>;

  const { data } = content;
  const single = data && data.length < 10; // Need to style single digits differently, so check
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginRight: "5%",
        marginBottom: 10,
      }}
    >
      <div className="next-section-item">
        <Typography
          variant="h6"
          style={{ fontSize: 16, textTransform: "uppercase", marginBottom: 1 }}
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
          onClick={() => onClick && onClick()}
        >
          <span
            className="me-badge"
            style={single ? { paddingLeft: 8, paddingRight: 8 } : {}}
          >
            {data.length}
          </span>
          {description(data.length)}
          <span style={{ marginLeft: 6 }} className="fa fa-long-arrow-right" />
        </Typography>
      </div>
    </div>
  );
};
