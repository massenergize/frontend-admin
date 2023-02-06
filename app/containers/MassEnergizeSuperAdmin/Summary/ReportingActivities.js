import { connect } from "react-redux";
import React from "react";
import { bindActionCreators } from "redux";
import { PapperBlock } from "dan-components";
import { Paper, Typography } from "@mui/material";
import { LOADING } from "../../../utils/constants";
import Loading from "dan-components/Loading";
import { makeTimeAgo } from "../../../utils/common";
function ReportingActivities({
  activities,
  style,
  super_admin_mode,
  community_admin_mode,
}) {
  if (activities === LOADING)
    return (
      <PapperBlock
        title="Activities"
        style={{ padding: 20, textAlign: "center" }}
      >
        {" "}
        <Loading />
      </PapperBlock>
    );

  if (!activities)
    return (
      <PapperBlock title="Activities" style={{ padding: 20 }}>
        <Typography>Sorry, we could not load activities...</Typography>
      </PapperBlock>
    );

  const footages = activities.footages || [];
  return (
    <PapperBlock
      title="Activities"
      whiteBg
      desc="Want to know what's been happening?"
    >
      <div style={{ ...(style || {}) }}>
        {footages.map((act, index) => {
          return (
            <React.Fragment key={index}>
              <OneActivity
                {...act}
                activityTypes={activities.activityTypes} // Signed in, Deleted, Updated etc
                itemTypes={activities.types} // A record of Action/event, testimonial etc
                super_admin_mode={super_admin_mode}
              />
            </React.Fragment>
          );
        })}
      </div>
    </PapperBlock>
  );
}

const mapStateToProps = (state) => {
  return {
    activities: state.getIn(["activities"]),
  };
};

export default connect(mapStateToProps)(ReportingActivities);

const OneActivity = ({
  activityTypes,
  actor,
  item_type,
  activity_type,
  notes,
  created_at,
  super_admin_mode,
  by_super_admin,
}) => {
  const activityType = (activityTypes || {})[activity_type] || {};
  const name = actor.preferred_name || actor.full_name || "...";

  const extra = super_admin_mode ? { fontSize: 15 } : {};
  const byASadmin = !super_admin_mode && by_super_admin; // To mark activities that show what superadmins have been doing to your community
  return (
    <Typography variant="caption" style={{ marginBottom: 5, ...extra }}>
      {byASadmin && (
        <i
          className="fas fa-shield"
          style={{ marginRight: 4, color: "#fb8c00" }}
        />
      )}
      <span>
        <b>{name}</b>
      </span>
      <span
        style={{
          color: "blue",
          margin: "0px 4px",
          color: activityType.color || "black",
        }}
      >
        <b>{activityType.action_word || "... "}</b>
      </span>
      <span>({(item_type || "...").toLowerCase()})</span>

      <span style={{ margin: "0px 4px" }}>
        <i>{makeTimeAgo(created_at)}</i>
        {notes && (
          <>
            <br />
            <i style={{ marginLeft: 4, color: "#c6c6c6" }}>{notes}</i>
          </>
        )}
      </span>

      {byASadmin && <i style={{ color: "#e47f00" }}> - Super Admin</i>}
    </Typography>
  );
};
