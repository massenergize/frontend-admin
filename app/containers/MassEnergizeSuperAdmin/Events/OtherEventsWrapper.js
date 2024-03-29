import { withStyles } from "@mui/styles";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import EventsFromOtherCommunities from "./EventsFromOtherCommunities";
import styles from "../../../components/Widget/widget-jss";
import { reduxLoadAllOtherEvents, reduxLoadMetaDataAction, reduxSaveOtherEventState } from "../../../redux/redux-actions/adminActions";

function OtherEvents({
  putOtherEventsInRedux,
  otherCommunities,
  classes,
  otherEvents,
  otherEventsState,
  putEventsStateInRedux,
  meta,
  putMetaDataToRedux
}) {
  return (
    <div>
      <EventsFromOtherCommunities
        putOtherEventsInRedux={putOtherEventsInRedux}
        otherCommunities={otherCommunities}
        classes={classes}
        otherEvents={otherEvents}
        state={otherEventsState}
        putStateInRedux={putEventsStateInRedux}
        meta={meta}
        putMetaDataToRedux={putMetaDataToRedux}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    // auth: state.getIn(["auth"]),
    // allEvents: state.getIn(["allEvents"]),
    // community: state.getIn(["selected_community"]),
    otherCommunities: state.getIn(["otherCommunities"]),
    otherEvents: state.getIn(["otherEvents"]),
    otherEventsState: state.getIn(["otherEventsState"]),
    meta: state.getIn(["paginationMetaData"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // callForSuperAdminEvents: reduxGetAllEvents,
      // callForNormalAdminEvents: reduxGetAllCommunityEvents,
      // putEventsInRedux: loadAllEvents,
      // toggleDeleteConfirmation: reduxToggleUniversalModal,
      // toggleLive: reduxToggleUniversalModal,
      putOtherEventsInRedux: reduxLoadAllOtherEvents,
      putEventsStateInRedux: reduxSaveOtherEventState,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
}

const Wrapped = withStyles(styles)(OtherEvents);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Wrapped));
