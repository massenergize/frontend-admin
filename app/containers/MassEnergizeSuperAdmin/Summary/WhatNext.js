import { Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { PapperBlock } from "dan-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
function WhatNext({ data }) {
  const {
    messages,
    teams,
    testimonials,
    users,
    team_messages,
    sign_ins,
    todo_interactions,
    done_interactions,
  } = data || {};
  if (!Object.keys(data).length) return <></>;

  const history = useHistory();
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
        <SectionTemplate
          content={sign_ins}
          name="Sign Ins"
          description={(count) =>
            `${count} ${
              count === 1 ? "sign-in" : "sign-ins"
            } in your communities`
          }
          subtitle={(_) =>
            `The number of sign-in activities in  any of the communities you manage, on the community portal`
          }
        />
        <SectionTemplate
          content={done_interactions}
          name="Actions Taken"
          description={(count) =>
            `${count} ${
              count === 1 ? "action" : "actions"
            } taken since your last visit`
          }
          subtitle={(_) =>
            `These are actions in any of the communities you manage that users have taken. Click to see which actions are involved`
          }
          onClick={() =>
            history.push({
              pathname: "/admin/read/actions",
              state: { ids: done_interactions && done_interactions.data },
            })
          }
        />
        <SectionTemplate
          content={todo_interactions}
          name="ACTIONS TO BE TAKEN (TODO)"
          description={(count) =>
            `${count} ${
              count === 1 ? "action" : "actions"
            } in todo list since your last visit`
          }
          subtitle={(_) =>
            `These are actions in any of the communities you manage, that are in user todo lists. Click to see which actions are involved`
          }
          onClick={() =>
            history.push({
              pathname: "/admin/read/actions",
              state: { ids: todo_interactions && todo_interactions.data },
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
