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
import CommunityEngagement from "./CommunityEngagement";
import { PapperBlock } from "dan-components";
import Feature from "../../../components/FeatureFlags/Feature";
import { FLAGS } from "../../../components/FeatureFlags/flags";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import ContinueWhereYouLeft from "./ContinueWhereYouLeft";
import { MetricsModal } from 'dan-components';

// import LinearBuffer from '../../../components/Massenergize/LinearBuffer';
class SummaryDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loadingCSVs: [],
      success: false,
      openModal: false,
    };
  }

  getCSV = async (endpoint) => {
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
  };

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

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };

  handleCloseModal = () => {
    this.setState({ openModal: false });
    this.setState({ success: true });
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
      featureFlags,
    } = this.props;
    const { error, loadingCSVs, success } = this.state;
    const { openModal } = this.state;
    const featureToEdit = null;

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
        <MetricsModal 
          openModal={openModal}
          closeModal={this.handleCloseModal} 
          communities={communities}
          featureToEdit={featureToEdit}
          featureFlags={featureFlags}
        />
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
        <ContinueWhereYouLeft />
        <Feature
          name={FLAGS.NEW_USER_ENGAGEMENT_VIEW}
          fallback={
            <>
              {graph_data && <ActionsChartWidget data={graph_data || {}} />}
              <Grid container md={12} columnGap={2} style={{ marginTop: 20 }}>
                <Grid md={8}>
                  <ReportingActivities
                    super_admin_mode
                    style={{ maxHeight: 300, overflowY: "scroll" }}
                  />
                </Grid>
                <Grid md={3}>
                  <CSVDownloads
                    loadingCSVs={loadingCSVs}
                    classes={classes}
                    getCSV={this.getCSV}
                    handleOpenModal={this.handleOpenModal}
                  />
                </Grid>
              </Grid>
            </>
          }
        >
          <Grid container columnGap={2} style={{ marginBottom: 15 }}>
            <Grid item xs={7} style={{ marginRight: 10 }}>
              <WhatNext />
              <CommunityEngagement />
            </Grid>
            <Grid item xs={4}>
              <CSVDownloads
                loadingCSVs={loadingCSVs}
                classes={classes}
                getCSV={this.getCSV}
                handleOpenModal={this.handleOpenModal}
              />
              <Grid>
                <ReportingActivities
                  super_admin_mode
                  style={{ maxHeight: 600, overflowY: "scroll" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Feature>

        {/* <Grid>
          <ReportingActivities
            super_admin_mode
            style={{ maxHeight: 600, overflowY: "scroll" }}
          />
        </Grid> */}
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
  featureFlags: state.getIn(["featureFlags"]),
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

const CSVDownloads = ({ loadingCSVs, classes, getCSV, handleOpenModal}) => {
  return (
    <MEPaperBlock
      subtitle="Download your data as CSV here"
      title="CSV Downloads"
    >
      <Grid container className={classes.colList}>
        <Grid item xs={12}>
          <Paper
            onClick={() => {
              !loadingCSVs.includes("users") && getCSV("users");
            }}
            className={`${classes.pageCard}`}
            elevation={1}
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
        <Grid item xs={12}>
          <Paper
            onClick={() => {
              !loadingCSVs.includes("actions") && getCSV("actions");
            }}
            className={`${classes.pageCard}`}
            elevation={1}
          >
            <Typography
              variant="h5"
              style={{ fontWeight: "600", fontSize: "1rem" }}
              component="h3"
            >
              Request All Actions CSV{" "}
              <Icon style={{ paddingTop: 3, color: "green" }}>
                arrow_downward
              </Icon>
              {loadingCSVs.includes("actions") && (
                <CircularProgress size={20} thickness={2} color="secondary" />
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            onClick={() => {
              !loadingCSVs.includes("communities") &&
                getCSV("communities");
            }}
            className={`${classes.pageCard}`}
            elevation={1}
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
        <Grid item xs={12}>
          <Paper
            onClick ={() => {handleOpenModal();}}
            className={`${classes.pageCard}`}
            elevation={1}
          >
            <Typography
              variant="h5"
              style={{ fontWeight: "600", fontSize: "1rem" }}
              component="h3"
            >
              Request All Metrics CSV{" "}
              <Icon style={{ paddingTop: 3, color: "green" }}>
                arrow_downward
              </Icon>
              {loadingCSVs.includes("metrics") && (
                <CircularProgress size={20} thickness={2} color="secondary" />
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </MEPaperBlock>
  );
};
