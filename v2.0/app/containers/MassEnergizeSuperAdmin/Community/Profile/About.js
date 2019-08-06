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

class About extends React.Component {
  summarizeLocation = (location) => {
    if (!location) return 'No Address Provided';
    return `${location.address1}${location.address2}${location.state}${location.zip}${location.country}`;
  }

  getTags = tags => (tags.map(t => (t.name))).join(', ');


  render() {
    const { classes, community } = this.props;


    return (
      <Grid
        container
        alignItems="flex-start"
        justify="flex-start"
        direction="row"
        spacing={24}
      >

        <Grid item md={5} xs={12}>
          {/* Profile Progress */}
          <div className={classes.progressRoot}>
            <Paper className={classes.styledPaper} elevation={4}>
              <Typography className={classes.title} variant="h5" component="h3">
                <span className={Type.light}>Goals Set By Community Members </span>
                {/* <span className={Type.bold}>Intermediate</span> */}
              </Typography>
              <Grid container justify="center">
                <Chip
                  avatar={(
                    <Avatar>
                      <Check />
                    </Avatar>
                  )}
                  label="60% Progress"
                  className={classes.chip}
                  color="primary"
                />
              </Grid>
              <LinearProgress variant="determinate" className={classes.progress} value={60} />
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
                  <DateRange />
                </Avatar>
                <ListItemText primary="Last Updated" secondary={`${community.updated_at}`} />
              </ListItem>
            </List>
          </PapperBlock>
          <Divider className={classes.divider} />
          {/* ----------------------------------------------------------------------*/}
          {/* My Albums */}
          {/* <PapperBlock title="My Albums (6)" icon="ios-images-outline" whiteBg desc="">
            <div className={classes.albumRoot}>
              <GridList cellHeight={180} className={classes.gridList}>
                {
                  imgData.map((tile, index) => {
                    if (index >= 4) {
                      return false;
                    }
                    return (
                      <GridListTile key={index.toString()}>
                        <img src={tile.img} className={classes.img} alt={tile.title} />
                        <GridListTileBar
                          title={tile.title}
                          subtitle={(
                            <span>
                              by:&nbsp;
                              {tile.author}
                            </span>
                          )}
                          actionIcon={(
                            <IconButton className={classes.icon}>
                              <InfoIcon />
                            </IconButton>
                          )}
                        />
                      </GridListTile>
                    );
                  })
                }
              </GridList>
            </div>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
          </PapperBlock> */}
          {/* ----------------------------------------------------------------------*/}


          {/* ----------------------------------------------------------------------*/}
        </Grid>

        <Grid item md={7} xs={12}>
          <div>
            {/* <Timeline dataTimeline={data} /> */}
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
                  <ListItemText primary="Location" secondary={`${this.summarizeLocation(community.location)}`} />
                </ListItem>
              </Grid>
            </Grid>
          </PapperBlock>


          {/* My Connection Me */}
          <PapperBlock title="Top Actions" icon="ios-contacts-outline" whiteBg desc="">
            <List dense className={classes.profileList}>
              {
                community
                  && community.actions
                  && community.actions.map((a, i) => (
                    <ListItem button key={i}>
                      {/* <Avatar className={classNames(classes.avatar, classes.orangeAvatar)}>H</Avatar> */}
                      <ListItemText primary={`${a.title}`} secondary={`${this.getTags(a.tags)}`} />
                    </ListItem>
                  ))
              }
            </List>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
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
