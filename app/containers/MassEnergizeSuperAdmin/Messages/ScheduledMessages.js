
import PapperBlock from "../../../components/PapperBlock/PapperBlock";
import Seo from "../../../components/Seo/Seo";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, makeStyles } from "@mui/styles";
import styles from "../../../components/Widget/widget-jss";

import { withRouter } from "react-router-dom";

function ScheduledMessages() {
  return (
    <div>
      <PapperBlock
        title="Scheduled Messages"
        desc="This page lists all scheduled messages."
      >
        <Seo name={"Scheduled Messages"} />
      </PapperBlock>
    </div>
  );
}


const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  users: state.getIn(["allUsers"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
const ScheduledMessagesWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduledMessages);
export default withStyles(styles)(withRouter(ScheduledMessagesWithProps));
