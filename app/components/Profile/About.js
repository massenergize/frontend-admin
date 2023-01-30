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
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import LocalPhone from '@mui/icons-material/LocalPhone';
import DateRange from '@mui/icons-material/DateRange';
import LocationOn from '@mui/icons-material/LocationOn';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
// import GridList from '@mui/material/GridList';
// import GridListTile from '@mui/material/GridListTile';
// import GridListTileBar from '@mui/material/GridListTileBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Check from '@mui/icons-material/Check';
import AcUnit from '@mui/icons-material/AcUnit';
import Adb from '@mui/icons-material/Adb';
import AllInclusive from '@mui/icons-material/AllInclusive';
import AssistantPhoto from '@mui/icons-material/AssistantPhoto';
import imgData from 'dan-api/images/imgData';
import Type from 'dan-styles/Typography.scss';
import Timeline from '../SocialMedia/Timeline';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './profile-jss';

import { ImageListItem, ImageList, ImageListItemBar } from "@mui/material";

class About extends React.Component {
  render() {
    const { classes, data } = this.props;
    return (
      <Grid
        container
        alignItems="flex-start"
        justify="flex-start"
        direction="row"
        spacing={24}
      >
        <Grid item md={7} xs={12}>
          <div>
            <Timeline dataTimeline={data} />
          </div>
        </Grid>
        <Grid item md={5} xs={12}>
          {/* Profile Progress */}
          <div className={classes.progressRoot}>
            <Paper className={classes.styledPaper} elevation={4}>
              <Typography className={classes.title} variant="h5" component="h3">
                <span className={Type.light}>Profile Strength: </span>
                <span className={Type.bold}>Intermediate</span>
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
          <PapperBlock title="About Me" icon="ios-contact-outline" whiteBg noMargin desc="About">
            <Divider className={classes.divider} />
            <List dense className={classes.profileList}>
              <ListItem>
                <Avatar>
                  <DateRange />
                </Avatar>
                <ListItemText primary="Born" secondary="Jan 9, 1994" />
              </ListItem>
              <ListItem>
                <Avatar>
                  <LocalPhone />
                </Avatar>
                <ListItemText primary="Phone" secondary="(+62)8765432190" />
              </ListItem>
              <ListItem>
                <Avatar>
                  <LocationOn />
                </Avatar>
                <ListItemText primary="Address" secondary="Chicendo Street no.105 Block A/5A - Barcelona, Spain" />
              </ListItem>
            </List>
          </PapperBlock>
          <Divider className={classes.divider} />
          {/* ----------------------------------------------------------------------*/}
          {/* My Albums */}
          <PapperBlock title="My Albums (6)" icon="ios-images-outline" whiteBg desc="">
            <div className={classes.albumRoot}>
              <ImageList cellHeight={180} className={classes.gridList}>
                {
                  imgData.map((tile, index) => {
                    if (index >= 4) {
                      return false;
                    }
                    return (
                      <ImageListItem key={index.toString()}>
                        <img
                          src={tile.img}
                          className={classes.img}
                          alt={tile.title}
                        />
                        <ImageListItemBar
                          title={tile.title}
                          subtitle={
                            <span>
                              by:&nbsp;
                              {tile.author}
                            </span>
                          }
                          actionIcon={
                            <IconButton
                              className={classes.icon}
                            >
                              <InfoIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    );
                  })
                }
              </ImageList>
            </div>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
          </PapperBlock>
          {/* ----------------------------------------------------------------------*/}
          {/* My Connection Me */}
          <PapperBlock title="My Connection" icon="ios-contacts-outline" whiteBg desc="">
            <List dense className={classes.profileList}>
              <ListItem button>
                <Avatar className={classNames(classes.avatar, classes.orangeAvatar)}>H</Avatar>
                <ListItemText primary="Harry Wells" secondary="2 Mutual Connection" />
              </ListItem>
              <ListItem button>
                <Avatar className={classNames(classes.avatar, classes.purpleAvatar)}>J</Avatar>
                <ListItemText primary="John DOe" secondary="8 Mutual Connection" />
              </ListItem>
              <ListItem button>
                <Avatar className={classNames(classes.avatar, classes.pinkAvatar)}>V</Avatar>
                <ListItemText primary="Victor Wanggai" secondary="12 Mutual Connection" />
              </ListItem>
              <ListItem button>
                <Avatar className={classNames(classes.avatar, classes.greenAvatar)}>H</Avatar>
                <ListItemText primary="Baron Phoenix" secondary="10 Mutual Connection" />
              </ListItem>
            </List>
            <Divider className={classes.divider} />
            <Grid container justify="center">
              <Button color="secondary" className={classes.button}>
                See All
              </Button>
            </Grid>
          </PapperBlock>
          {/* ----------------------------------------------------------------------*/}
          {/* My Interests */}
          <PapperBlock title="My Interests" icon="ios-aperture-outline" whiteBg desc="">
            <Grid container className={classes.colList}>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.purpleAvatar)}>
                    <AcUnit />
                  </Avatar>
                  <ListItemText primary="Snow" secondary="100 Connected" />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.greenAvatar)}>
                    <Adb />
                  </Avatar>
                  <ListItemText primary="Android" secondary="120 Connected" />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.pinkAvatar)}>
                    <AllInclusive />
                  </Avatar>
                  <ListItemText primary="All Inclusive" secondary="999+ Connected" />
                </ListItem>
              </Grid>
              <Grid item md={6}>
                <ListItem>
                  <Avatar className={classNames(classes.avatar, classes.orangeAvatar)}>
                    <AssistantPhoto />
                  </Avatar>
                  <ListItemText primary="My Country" secondary="99+ Connected" />
                </ListItem>
              </Grid>
            </Grid>
          </PapperBlock>
          {/* ----------------------------------------------------------------------*/}
        </Grid>
      </Grid>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(About);
