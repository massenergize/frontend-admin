import { Toolbar, Typography, Tooltip } from "@mui/material";
import React from "react";
// import { PapperBlock } from "dan-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, useHistory, withRouter } from "react-router-dom";
import Loading from "dan-components/Loading";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import PapperBlock from "../ME  Tools/paper block/MEPaperBlock";

function WhatNext({ data }) {
  const { messages, teams, testimonials, users, team_messages } = data || {};

  const totalCount = (data) => {
    if (!data) return 0;
    const { messages, teams, testimonials, users, team_messages } = data;
    let total = 0;
    total += messages?.count || 0;
    total += teams?.count || 0;
    total += testimonials?.count || 0;
    total += users?.count || 0;
    total += team_messages?.count || 0;
    return total;
  };
  const userHasNothingTodo = !totalCount(data);

  if (!Object.keys(data).length)
    return (
      <div
        style={{
          boxShadow:
            "0px 1px 8px 0px rgb(80 80 80 / 20%), 0px 3px 4px 0px rgb(80 80 80 / 14%), 0px 3px 3px -2px rgb(80 80 80 / 12%)",
          padding: 20,
          background: "white",
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <LinearBuffer message="We are looking for items you need to handle..." />
      </div>
    );

  const history = useHistory();
  const subtitle = userHasNothingTodo ? (
    <Typography>
      <span>🎊</span> Awesome! You have cleared all pending items. You currently
      have nothing to take care of.
      <br /> <Link to="/admin/add/event"> Create new events, </Link>
      <Link to="/admin/add/action"> add new actions,</Link> or{" "}
      <Link to="/admin/add/vendor"> vendors</Link> to build your community!
    </Typography>
  ) : (
    "Here are items you need to take care of"
  );
  return (
    <PapperBlock
      title="What to do next?"
      desc={subtitle}
      containerStyle={userHasNothingTodo ? { minHeight: 130, height: 130 } : {}}
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
          description={(count) => `You have ${count} un-forwarded messages`}
          onClick={() =>
            history.push({
              pathname: "/admin/read/team-admin-messages",
              state: { ids: team_messages && team_messages.data },
            })
          }
        />
        <SectionTemplate
          content={teams}
          name="teams"
          description={(count) => `You have ${count} unapproved teams`}
          onClick={() =>
            history.push({
              pathname: "/admin/read/teams",
              state: { ids: teams && teams.data },
            })
          }
        />
        <SectionTemplate
          content={testimonials}
          name="testimonials"
          description={(count) => `You have ${count} unapproved testimonials`}
          onClick={() =>
            history.push({
              pathname: "/admin/read/testimonials",
              state: { ids: testimonials && testimonials.data },
            })
          }
        />
        <SectionTemplate
          content={users}
          name="users"
          description={(count) =>
            `You have ${count} new registered users since your last sign in`
          }
          onClick={() =>
            history.push({
              pathname: "/admin/read/users",
              state: { ids: users && users.data },
            })
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

const SectionTemplate = ({ content, name, description, onClick, subtitle }) => {
  if (!content || !content.data || !content.data.length) return <></>;

  const { data } = content;
  const single = data && data.length < 10; // Need to style single digits differently, so check
  const nonClickStyling = onClick ? {} : { borderWidth: 0, cursor: "auto" };
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

        <Tooltip
          title={(subtitle && subtitle(data.length)) || ""}
          placement="top"
        >
          <Typography
            className="text"
            variant="body2"
            style={{
              display: "inline",
              paddingBottom: 7,
              ...nonClickStyling,
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
            {onClick && (
              <span
                style={{ marginLeft: 6 }}
                className="fa fa-long-arrow-right"
              />
            )}
          </Typography>
        </Tooltip>
      </div>
    </div>
  );
};
