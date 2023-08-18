import React, { PureComponent } from "react";
import classNames from "classnames";
import Chip from "@mui/material/Chip";
import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
// import { PapperBlock } from "dan-components";
import imgApi from "dan-api/images/photos";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import TableHead from "@mui/material/TableHead";
import messageStyles from "dan-styles/Messages.scss";
import { bindActionCreators } from "redux";
import styles from "./dashboard-jss";
import {
  reduxLoadSelectedCommunity,
  reduxCheckUser,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "./CommunitySwitch";
import SummaryChart from "./graph/ChartInfographic";
import ActionsChartWidget from "./graph/ActionsChartWidget";
import { PORTAL_HOST } from "../../../config/constants";
import { Paper } from "@mui/material";
import ReportingActivities from "./ReportingActivities";
import WhatNext from "./WhatNext";
import CommunityEngagement from "./CommunityEngagement";
import Feature from "../../../components/FeatureFlags/Feature";
import { FLAGS } from "../../../components/FeatureFlags/flags";
import PapperBlock from "../ME  Tools/paper block/MEPaperBlock";
import ContinueWhereYouLeft from "./ContinueWhereYouLeft";

class NormalAdminHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  findCommunityObj = (id) => {
    const { auth } = this.props;
    const section = auth ? auth.admin_at : [];
    for (let i = 0; i < section.length; i++) {
      if (section[i].id === id) {
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

  getStatus = (isApproved) => {
    switch (isApproved) {
      case false:
        return messageStyles.bgError;
      case true:
        return messageStyles.bgSuccess;
      default:
        return messageStyles.bgSuccess;
    }
  };

  handleCommunityChange = async (id) => {
    if (!id) return;
    const obj = this.findCommunityObj(id);
    this.props.selectCommunity(obj);
    if (obj) {
      window.location = `/admin/community/${obj.id}/profile`;
    }
  };

  showCommunitySwitch = () => {
    const { auth } = this.props;
    const user = auth || {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
    return <div />;
  };

  renderTable = (data, classes) => {
    const { history, mode } = this.props;
    return (
      <PapperBlock
        noMargin
        title="Communities You Manage"
        icon="ios-share-outline"
        whiteBg
        desc="A list of all the communities you manage"
      >
        <div className={classes.root}>
          <Table
            className={classNames(classes.tableLong, classes.stripped)}
            padding="dense"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="dense">Community Name</TableCell>
                <TableCell>Subdomain</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((n) => [
                <TableRow key={n.id}>
                  <TableCell padding="dense">
                    <div
                      className={classes.flex}
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link to={`/admin/community/${n.id}/profile`}>
                        <Avatar
                          alt={n.name}
                          src={n.logo ? n.logo.url : imgApi[21]}
                          className={classes.productPhoto}
                        />
                      </Link>
                      <Link
                        style={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          border: "dotted 0px #AB47BC",
                          borderBottomWidth: 2,
                          marginLeft: 15,
                          textDecoration: "none",
                          color: mode == "light" && "black",
                        }}
                        className="touchable-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`/admin/community/${n.id}/profile`);
                        }}
                      >
                        {n.name || ""}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        border: "dotted 0px #AB47BC",
                        borderBottomWidth: 2,
                        color: "#AB47BC",
                      }}
                      className="touchable-opacity"
                      variant="body"
                      onClick={() =>
                        window.open(`${PORTAL_HOST}/${n.subdomain}`, "_blank")
                      }
                    >
                      {n.subdomain}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        background: "#389b3c",
                        padding: 8,
                        textTransform: "uppercase",
                        fontSize: 11,
                      }}
                      label={n.is_approved ? "Verified" : "Not Verified"}
                      className={classNames(
                        classes.chip,
                        this.getStatus(n.is_approved)
                      )}
                    />
                  </TableCell>
                </TableRow>,
              ])}
            </TableBody>
          </Table>
        </div>
      </PapperBlock>
    );
  };

  render() {
    const title = brand.name + " - Summary Dashboard";
    const description = brand.desc;
    const { auth, summary_data, graph_data, classes } = this.props;
    const firstComm = (auth.admin_at || [])[0];
    const firstCommId = firstComm && firstComm.id;
    if (!firstCommId) {
      this.showCommunitySwitch();
    }
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <h1 style={{ color: "white" }}>
          Howdy Community Admin
          <span role="img" aria-label="smiley">
            😊
          </span>
        </h1>

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
              <Grid container columnGap={2} style={{ marginTop: 20 }}>
                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  item
                  className={classes.root}
                  md={7}
                  xs={12}
                >
                  {auth && !auth.is_super_admin && (
                    <Grid item className={classes.root}>
                      {this.renderTable(auth.admin_at || [], classes)}
                    </Grid>
                  )}
                </Grid>
                <Grid md={4}>
                  <ReportingActivities
                    style={{ maxHeight: 290, overflowY: "scroll" }}
                  />
                </Grid>
              </Grid>
            </>
          }
        >
          <>
            <WhatNext />
            <Grid container style={{ paddingRight: 20 }}>
              <Grid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 20,
                }}
                item
                className={classes.root}
                md={9}
                xs={12}
              >
                <CommunityEngagement />
                {auth && !auth.is_super_admin && (
                  <Grid item className={classes.root} style={{ marginTop: 20 }}>
                    {this.renderTable(auth.admin_at || [], classes)}
                  </Grid>
                )}
              </Grid>
              <Grid md={3}>
                <ReportingActivities
                  style={{ maxHeight: 615, overflowY: "scroll" }}
                />
              </Grid>
            </Grid>
          </>
        </Feature>
      </div>
    );
  }
}

NormalAdminHome.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  adminCommunities: state.getIn(["communities"]),
  selected_community: state.getIn(["selected_community"]),
  summary_data: state.getIn(["summary_data"]),
  graph_data: state.getIn(["graph_data"]) || {},
  mode: state.getIn(["ui", "type"]),
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
)(NormalAdminHome);

export default withStyles(styles)(withRouter(summaryMapped));
