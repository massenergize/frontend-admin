import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from "./dashboard-jss";
import SummaryChart from "./graph/ChartInfographic";
import ActionsChartWidget from "./graph/ActionsChartWidget";
import {
  reduxLoadSelectedCommunity,
  reduxCheckUser,
} from "../../../redux/redux-actions/adminActions";
import { Paper, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Snackbar from "@mui/material/Snackbar";
import { apiCallFile } from "../../../utils/messenger";
import ReportingActivities from "./ReportingActivities";
import CircularProgress from "@mui/material/CircularProgress";
import WhatNext from "./WhatNext";

// import LinearBuffer from '../../../components/Massenergize/LinearBuffer';
class SummaryDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loadingCSVs: [],
      success: false,
    };
  }

  async getCSV(endpoint) {
    let oldLoadingCSVs = this.state.loadingCSVs;
    this.setState({ loadingCSVs: oldLoadingCSVs.concat(endpoint) });
    const csvResponse = await apiCallFile("/downloads." + endpoint);

    oldLoadingCSVs = this.state.loadingCSVs;
    oldLoadingCSVs.splice(oldLoadingCSVs.indexOf(endpoint), 1);
    if (csvResponse.success) {
      this.setState({ success: true });
    } else {
      this.setState({ error: csvResponse.error });
    }
    this.setState({ loadingCSVs: oldLoadingCSVs });
    this.forceUpdate();
  }

  handleCloseStyle = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ error: null });
  };

  findCommunityObj = (name) => {
    const section = this.props.communities;
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  };

  chooseCommunity = (event) => {
    const obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    if (obj) {
      window.location = `/admin/community/${obj.id}/profile`;
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ success: false });
  };

  render() {
    const title = brand.name + " - Summary Dashboard";
    const description = brand.desc;
    const {
      classes,
      communities,
      selected_community,
      auth,
      summary_data,
      graph_data,
    } = this.props;
    const { error, loadingCSVs, success } = this.state;

    return (
      <div>
        {error && (
          <div>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={error != null}
              autoHideDuration={6000}
              onClose={this.handleCloseStyle}
            >
              <Alert
                onClose={this.handleCloseStyle}
                severity={"error"}
                sx={{ width: "100%" }}
              >
                <small style={{ marginLeft: 15, fontSize: 15 }}>
                  {`Unable to download: ${error}`}
                </small>
              </Alert>
            </Snackbar>
          </div>
        )}
        {success && (
          <div style={{ marginBottom: 20 }}>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={success}
              autoHideDuration={3000}
              onClose={this.handleClose}
            >
              <Alert
                onClose={this.handleClose}
                severity={"success"}
                sx={{ width: "100%" }}
              >
                <small style={{ marginLeft: 15, fontSize: 15 }}>
                  Your request has been received. Please check your email for
                  the file.
                </small>
              </Alert>
            </Snackbar>
          </div>
        )}

        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>

        <Grid container className={classes.root}>
          <SummaryChart data={summary_data} />
        </Grid>
        <br />
        <WhatNext />
        <Divider className={classes.divider} />

        {graph_data && <ActionsChartWidget data={graph_data || {}} />}
        <Grid container className={classes.colList}>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("users") && this.getCSV("users");
              }}
              className={`${classes.pageCard}`}
              elevation={2}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request All Users CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("users") && (
                  <CircularProgress size={20} thickness={2} color="secondary" />
                )}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("actions") && this.getCSV("actions");
              }}
              className={`${classes.pageCard}`}
              elevation={2}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request All Communities and Actions CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("actions") && (
                  <CircularProgress size={20} thickness={2} color="secondary" />
                )}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("communities") &&
                  this.getCSV("communities");
              }}
              className={`${classes.pageCard}`}
              elevation={2}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request All Communities CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("communities") && (
                  <CircularProgress size={20} thickness={2} color="secondary" />
                )}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid>
          <ReportingActivities
            super_admin_mode
            style={{ maxHeight: 600, overflowY: "scroll" }}
          />
        </Grid>
      </div>
    );
  }
}

SummaryDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.getIn(["communities"]),
  selected_community: state.getIn(["selected_community"]),
  summary_data: state.getIn(["summary_data"]),
  graph_data: state.getIn(["graph_data"]) || {},
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      selectCommunity: reduxLoadSelectedCommunity,
      ifExpired: reduxCheckUser,
    },
    dispatch
  );
const summaryMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryDashboard);

export default withStyles(styles)(summaryMapped);
