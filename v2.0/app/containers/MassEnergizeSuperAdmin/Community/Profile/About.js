import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Icon from '@material-ui/core/Icon';
import DateRange from '@material-ui/icons/DateRange';
import LocationOn from '@material-ui/icons/LocationOn';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Email from '@material-ui/icons/Email';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { Link } from 'react-router-dom';
import Check from '@material-ui/icons/Check';
import AcUnit from '@material-ui/icons/AcUnit';
import Adb from '@material-ui/icons/Adb';
import AllInclusive from '@material-ui/icons/AllInclusive';
import AssistantPhoto from '@material-ui/icons/AssistantPhoto';
import imgData from 'dan-api/images/imgData';
import Type from 'dan-styles/Typography.scss';
// import Timeline from 'dan-components/SocialMedia/Timeline';
import PapperBlock from 'dan-components/PapperBlock/PapperBlock';
import styles from './profile-jss';
import { convertBoolean, getAddress, goHere } from '../../../../utils/common';
class About extends React.Component {
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

  actionsGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_number_of_actions;
      const att = goal.attained_number_of_actions;
      if (!targ) return 0;
      return Math.round((att * 100) / targ);
    }
    return 0;
  }

  userGoalPercentage() {
    const community = this.props.community ? this.props.community : 0;
    if (community !== 0) {
      const goal = community.goal ? community.goal : {};
      const targ = goal.target_number_of_households;
      const att = goal.attained_number_of_households;
      if (!targ) return 0;
      return Math.round((att * 100) / targ);
    }
    return 0;
  }

  render() {
    const { classes, community } = this.props;
    const goalsEditLink = `/admin/edit/${community ? community.id : null}/goal`;
    const communityEditLink = `/admin/edit/${community ? community.id : null}/community/community-admin`;
    const addRemoveCommuntyAdminLink = `/admin/edit/${community ? community.id : null}/community-admins`;


    return (
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
              <Typography className={classes.title} variant="h5" component="h3">
                <center><span className={Type.light} style={{ textAlign: 'center' }}>#Actions Goal</span></center>
                {/* <span className={Type.bold}>Intermediate</span> */}
              </Typography>
              <Grid container justify="center">
                <Chip
                  avatar={(
                    <Avatar>
                      <Check />
                    </Avatar>
                  )}
                  label={`${this.actionsGoalPercentage()}% Progress`}
                  className={classes.chip}
                  color="primary"
                />
              </Grid>
              <LinearProgress variant="determinate" className={classes.progress} value={this.actionsGoalPercentage()} />
            </Paper>
          </div>
          {/* ----------------------------------------------------------------------*/}
          {/* About Me */}
          <PapperBlock title="About Community" icon="ios-contact-outline" whiteBg noMargin desc={`${community ? community.about_community : ''}`}>
            <Divider className={classes.divider} />
            <List dense className={classes.profileList}>
              <ListItem>
                <Avatar>
                  <DateRange />
                </Avatar>
                <ListItemText primary="Admin Name" secondary={`${community.owner_name}`} />
              </ListItem>
              <ListItem>
                <Avatar>
                  <Email />
                </Avatar>
                <ListItemText primary="Admin Email" secondary={`${community.owner_email}`} />
              </ListItem>

              <ListItem>
                <Avatar>
                  <DateRange />
                </Avatar>
                <ListItemText primary="Date Registered" secondary={`${community.created_at}`} />
              </ListItem>
              <ListItem>
                <Avatar>
                  <LocalPhone />
                </Avatar>
                <ListItemText primary="Phone Number" secondary={`${community.owner_phone_number || 'No Phone Number Provided'}`} />
              </ListItem>
            </List>

            <Divider className={classes.divider} />

            <List dense className={classes.profileList}>
              {'Community Admins'}
              {community && community.admins &&
                (community.admins.map(a => (
                  <ListItem>
                    {a.profile_picture
                      && <Avatar alt={a.initials} src={a.profile_picture.url} style={{ margin: 10 }} />
                    }
                    {!a.profile_picture
                      && <Avatar style={{ margin: 10 }}>{a.preferred_name.substring(0, 2)}</Avatar>
                    }
                    <ListItemText primary={a.preferred_name} secondary={a.email} />
                  </ListItem>
                )))
              }
            </List>
            <Paper onClick={() => goHere(addRemoveCommuntyAdminLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                Add/Remove Administrators for Community
                {' '}
                <Icon style={{ paddingTop: 3, color: 'green' }}>forward</Icon>
              </Typography>
            </Paper>
          </PapperBlock>
          <Divider className={classes.divider} />

          {/* ----------------------------------------------------------------------*/}
        </Grid>


        <Grid item md={6} xs={12}>
          <div className={classes.progressRoot}>
            <Paper className={classes.styledPaper} elevation={4}>
              <Typography className={classes.title} variant="h5" component="h3">
                <center><span className={Type.light} style={{ textAlign: 'center' }}>#Household Goal</span></center>
              </Typography>
              <Grid container justify="center">
                <Chip
                  avatar={(
                    <Avatar>
                      <Check />
                    </Avatar>
                  )}
                  label={`${this.userGoalPercentage()}% Progress`}
                  className={classes.chip}
                  color="primary"
                />
              </Grid>
              <LinearProgress variant="determinate" className={classes.progress} value={this.userGoalPercentage()} />
            </Paper>
          </div>
          {/* ----------------------------------------------------------------------*/}
          {/* My Interests */}
          <PapperBlock title="More Details" icon="ios-aperture-outline" whiteBg desc="">

            <Grid container className={classes.colList}>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.purpleAvatar)}>
                    <AcUnit />
                  </Avatar>
                  <ListItemText primary="Subdomain" secondary={`${community.subdomain}`} />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.greenAvatar)}>
                    <AcUnit />
                  </Avatar>
                  <ListItemText primary="Is Geographically Focused" secondary={`${community.is_geographically_focused}`} />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.pinkAvatar)}>
                    <AcUnit />
                  </Avatar>
                  <ListItemText primary="Is Approved" secondary={`${community.is_approved}`} />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.orangeAvatar)}>
                    <LocationOn />
                  </Avatar>
                  <ListItemText primary="Location" secondary={`${getAddress(community.location)}`} />
                </ListItem>
              </Grid>
            </Grid>
            <Paper onClick={() => goHere(goalsEditLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                Edit Community Goal
                {' '}
                <Icon style={{ paddingTop: 3, color: 'green' }}>forward</Icon>
              </Typography>
            </Paper>
            <Paper onClick={() => goHere(communityEditLink)} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                Edit Community Info
                {' '}
                <Icon style={{ paddingTop: 3, color: 'green' }}>forward</Icon>
              </Typography>
            </Paper>
            
          </PapperBlock>
        </Grid>
      </Grid>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
  community: PropTypes.object.isRequired,
  // data: PropTypes.object.isRequired
};

export default withStyles(styles)(About);
