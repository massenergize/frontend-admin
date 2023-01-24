import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LocalPhone from '@mui/icons-material/LocalPhone';
import DateRange from '@mui/icons-material/DateRange';
import LocationOn from '@mui/icons-material/LocationOn';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './widget-jss';

function ProfileWidget(props) {
  const { classes } = props;
  return (
    <PapperBlock title="About Me" whiteBg noMargin desc="">
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
          <ListItemText primary="Address" secondary="Street no.105 Block A/5A - Barcelona, Spain" />
        </ListItem>
      </List>
    </PapperBlock>
  );
}

ProfileWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileWidget);
