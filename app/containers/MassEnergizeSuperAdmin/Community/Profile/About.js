import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from "@mui/styles";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Icon from '@mui/material/Icon';
import DateRange from '@mui/icons-material/DateRange';
import LocationOn from '@mui/icons-material/LocationOn';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Email from '@mui/icons-material/Email';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Check from '@mui/icons-material/Check';
import AcUnit from '@mui/icons-material/AcUnit';
import Type from 'dan-styles/Typography.scss';
import PapperBlock from 'dan-components/PapperBlock/PapperBlock';
import styles from './profile-jss';
import { getAddress, goHere } from '../../../../utils/common';
import Snackbar from '@mui/material/Snackbar';
import { apiCallFile } from '../../../../utils/messenger';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert } from '@mui/material';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loadingCSVs: [],
      success: false,
      wantImport: false
    };
  }


  async getCSV(endpoint) {
    const { community } = this.props;
    if (!community) {
      return;
    }

    let oldLoadingCSVs = this.state.loadingCSVs;
    this.setState({ loadingCSVs: oldLoadingCSVs.concat(endpoint) });

    // csv downloads can be for a particular community, or they can be for all communities in which case the endpoint ends with '.all'.  
    // In that case need to remove the '.all' from the endpoint to the API and not send the community ID in the body
    const body = {};
    const dotAll = endpoint.indexOf('.all');
    if (dotAll > 0) {
      endpoint = endpoint.substring(0,dotAll)
    } else {
      body.community_id = community.id;
    }
    const csvResponse = await apiCallFile('/downloads.' + endpoint, body);

    oldLoadingCSVs = this.state.loadingCSVs;
    oldLoadingCSVs.splice(oldLoadingCSVs.indexOf(endpoint), 1);
    if (csvResponse.success) {
      this.setState({success: true});
    } else {
      this.setState({ error: csvResponse.error });
    }
    this.setState({ loadingCSVs: oldLoadingCSVs });
    this.forceUpdate();
  }

  getTags = tags => (tags.map(t => (t.name))).join(', ');

  

  getGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_carbon_footprint_reduction;
      const att = goal.attained_carbon_footprint_reduction;
      if (!targ) return 0;
      return (att / targ) * 100;
    }
    return 0;
  }

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ error: null });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ success: false });
  };

  actionsGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_number_of_actions;
      if (!targ) return 0;      
      const att = goal.attained_number_of_actions + goal.organic_attained_number_of_actions;
      return Math.round((att * 100) / targ);
    }
    return 0;
  }

  userGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_number_of_households;
      if (!targ) return 0;
      const att = goal.attained_number_of_households + goal.organic_attained_number_of_households;
      return Math.round((att * 100) / targ);
    }
    return 0;
  }
  // TODO: Show this
  carbonGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_carbon_footprint_reduction;
      if (!targ) return 0;
      const att = goal.attained_carbon_footprint_reduction + goal.organic_attained_carbon_footprint_reduction;
      return Math.round((att * 100) / targ);
    }
    return 0;
  }

  async importContacts() {
    return <Redirect exact to="/admin/importcontacts"></Redirect>;
  }
  render() {
    const { classes, community } = this.props;
    const goalsEditLink = `/admin/edit/${community ? community.id : null}/goal`;
    const communityEditLink = `/admin/edit/${community ? community.id : null}/community/community-admin`;
    const addRemoveCommuntyAdminLink = `/admin/edit/${community ? community.id : null}/community-admins`;

    const { error, loadingCSVs, success } = this.state;
    if (this.state.wantImport) {
      return <Redirect exact to="/admin/importcontacts"></Redirect>;
    }
    return (
      <>
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
                  Your request has been received. Please check your email
                  for the file.
                </small>
              </Alert>
            </Snackbar>
          </div>
        )}

        <Grid
          container
          alignItems="flex-start"
          justify="flex-start"
          direction="row"
          spacing={24}
        >
          <Grid item md={6} xs={12}>
            {/* Profile Progress */}
            <div className={classes.progressRoot}>
              <Paper className={classes.styledPaper} elevation={4}>
                <Typography
                  className={classes.title}
                  variant="h5"
                  component="h3"
                >
                  <center>
                    <span
                      className={Type.light}
                      style={{ textAlign: "center" }}
                    >
                      #Actions Goal
                    </span>
                  </center>
                  {/* <span className={Type.bold}>Intermediate</span> */}
                </Typography>
                <Grid container justify="center">
                  <Chip
                    avatar={
                      <Avatar>
                        <Check />
                      </Avatar>
                    }
                    label={`${this.actionsGoalPercentage()}% Progress`}
                    className={classes.chip}
                    color="primary"
                  />
                </Grid>
                <LinearProgress
                  variant="determinate"
                  className={classes.progress}
                  value={this.actionsGoalPercentage()}
                />
              </Paper>
            </div>
            {/* ----------------------------------------------------------------------*/}
            {/* About Me */}
            <PapperBlock
              title="About Community"
              icon="ios-contact-outline"
              whiteBg
              noMargin
              desc={`${community ? community.about_community : ""}`}
            >
              <Divider className={classes.divider} />
              <List dense className={classes.profileList}>
                <ListItem>
                  <Avatar>
                    <DateRange />
                  </Avatar>
                  <ListItemText
                    primary="Admin Name"
                    secondary={`${community.owner_name}`}
                  />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <Email />
                  </Avatar>
                  <ListItemText
                    primary="Admin Email"
                    secondary={`${community.owner_email}`}
                  />
                </ListItem>

                <ListItem>
                  <Avatar>
                    <DateRange />
                  </Avatar>
                  <ListItemText
                    primary="Date Registered"
                    secondary={`${moment(community.created_at).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}`}
                  />
                </ListItem>
                <ListItem>
                  <Avatar>
                    <LocalPhone />
                  </Avatar>
                  <ListItemText
                    primary="Phone Number"
                    secondary={`${community.owner_phone_number ||
                      "No Phone Number Provided"}`}
                  />
                </ListItem>
              </List>

              <Divider className={classes.divider} />

              <List dense className={classes.profileList}>
                {"Community Admins"}
                {community &&
                  community.admins &&
                  community.admins.map((a) => (
                    <ListItem key={a.email}>
                      {a.profile_picture && (
                        <Avatar
                          alt={a.initials}
                          src={a.profile_picture.url}
                          style={{ margin: 10 }}
                        />
                      )}
                      {!a.profile_picture && (
                        <Avatar style={{ margin: 10 }}>
                          {a.preferred_name.substring(0, 2)}
                        </Avatar>
                      )}
                      <ListItemText
                        primary={a.preferred_name}
                        secondary={a.email}
                      />
                    </ListItem>
                  ))}
              </List>
            </PapperBlock>
            <Divider className={classes.divider} />

            {/* ----------------------------------------------------------------------*/}
          </Grid>

          <Grid item md={6} xs={12}>
            <div className={classes.progressRoot}>
              <Paper className={classes.styledPaper} elevation={4}>
                <Typography
                  className={classes.title}
                  variant="h5"
                  component="h3"
                >
                  <center>
                    <span
                      className={Type.light}
                      style={{ textAlign: "center" }}
                    >
                      #Household Goal
                    </span>
                  </center>
                </Typography>
                <Grid container justify="center">
                  <Chip
                    avatar={
                      <Avatar>
                        <Check />
                      </Avatar>
                    }
                    label={`${this.userGoalPercentage()}% Progress`}
                    className={classes.chip}
                    color="primary"
                  />
                </Grid>
                <LinearProgress
                  variant="determinate"
                  className={classes.progress}
                  value={this.userGoalPercentage()}
                />
              </Paper>
            </div>
            {/* ----------------------------------------------------------------------*/}
            {/* My Interests */}
            <PapperBlock
              title="More Details"
              icon="ios-aperture-outline"
              whiteBg
              desc=""
            >
              <Grid container className={classes.colList}>
                <Grid item md={6}>
                  <ListItem>
                    <Avatar
                      className={classNames(
                        classes.avatar,
                        classes.purpleAvatar
                      )}
                    >
                      <AcUnit />
                    </Avatar>
                    <ListItemText
                      primary="Subdomain"
                      secondary={`${community.subdomain}`}
                    />
                  </ListItem>
                </Grid>
                <Grid item md={6}>
                  <ListItem>
                    <Avatar
                      className={classNames(
                        classes.avatar,
                        classes.greenAvatar
                      )}
                    >
                      <AcUnit />
                    </Avatar>
                    <ListItemText
                      primary="Is Geographically Focused"
                      secondary={`${community.is_geographically_focused}`}
                    />
                  </ListItem>
                </Grid>
                <Grid item md={6}>
                  <ListItem>
                    <Avatar
                      className={classNames(
                        classes.avatar,
                        classes.pinkAvatar
                      )}
                    >
                      <AcUnit />
                    </Avatar>
                    <ListItemText
                      primary="Is Approved"
                      secondary={`${community.is_approved}`}
                    />
                  </ListItem>
                </Grid>
                <Grid item md={6}>
                  <ListItem>
                    <Avatar
                      className={classNames(
                        classes.avatar,
                        classes.orangeAvatar
                      )}
                    >
                      <LocationOn />
                    </Avatar>
                    <ListItemText
                      primary="Location"
                      secondary={`${getAddress(community.location)}`}
                    />
                  </ListItem>
                </Grid>
              </Grid>
              <Paper
                onClick={() =>
                  goHere(addRemoveCommuntyAdminLink, this.props.history)
                }
                className={`${classes.pageCard}`}
                elevation={1}
              >
                <Typography
                  variant="h5"
                  style={{ fontWeight: "600", fontSize: "1rem" }}
                  component="h3"
                >
                  Add/Remove Administrators for Community{" "}
                  <Icon style={{ paddingTop: 3, color: "green" }}>
                    forward
                  </Icon>
                </Typography>
              </Paper>
              {/* <Paper onClick={() => goHere(goalsEditLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                Edit Community Goal
                {' '}
                <Icon style={{ paddingTop: 3, color: 'green' }}>forward</Icon>
              </Typography>
            </Paper> */}
              <Paper
                onClick={() =>
                  goHere(communityEditLink, this.props.history)
                }
                className={`${classes.pageCard}`}
                elevation={1}
              >
                <Typography
                  variant="h5"
                  style={{ fontWeight: "600", fontSize: "1rem" }}
                  component="h3"
                >
                  Edit Community Info{" "}
                  <Icon style={{ paddingTop: 3, color: "green" }}>
                    forward
                  </Icon>
                </Typography>
              </Paper>
            </PapperBlock>
          </Grid>
        </Grid>
        <Grid container className={classes.colList}>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("users") && this.getCSV("users");
              }}
              className={`${classes.pageCard}`}
              elevation={1}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request Users CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("users") && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    color="secondary"
                  />
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
              elevation={1}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request Actions CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("actions") && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    color="secondary"
                  />
                )}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("teams") && this.getCSV("teams");
              }}
              className={`${classes.pageCard}`}
              elevation={1}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request Teams CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("teams") && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    color="secondary"
                  />
                )}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={`${classes.pageCard}`} elevation={1}>
              <Link
                to={{
                  pathname: "/admin/importcontacts",
                  communityId: community.id,
                }}
              >
                <Typography
                  variant="h5"
                  style={{ fontWeight: "600", fontSize: "1rem" }}
                  component="h3"
                >
                  Invite Users Through CSV Upload{" "}
                  <Icon style={{ paddingTop: 3, color: "green" }}>
                    arrow_upward
                  </Icon>
                  {loadingCSVs.includes("users") && (
                    <CircularProgress
                      size={20}
                      thickness={2}
                      color="secondary"
                    />
                  )}
                </Typography>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("actions.all") &&
                  this.getCSV("actions.all");
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
                {loadingCSVs.includes("actions.all") && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    color="secondary"
                  />
                )}
              </Typography>
            </Paper>
          </Grid>
          {/* Removing all-metrics download button for all users
          <Grid item xs={4}>
            <Paper
              onClick={() => {
                !loadingCSVs.includes("metrics") && this.getCSV("metrics");
              }}
              className={`${classes.pageCard}`}
              elevation={1}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "600", fontSize: "1rem" }}
                component="h3"
              >
                Request Metrics CSV{" "}
                <Icon style={{ paddingTop: 3, color: "green" }}>
                  arrow_downward
                </Icon>
                {loadingCSVs.includes("metrics") && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    color="secondary"
                  />
                )}
              </Typography>
            </Paper>
          </Grid>
          */}
        </Grid>
      </>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
  community: PropTypes.object.isRequired,
  // data: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter (About));
