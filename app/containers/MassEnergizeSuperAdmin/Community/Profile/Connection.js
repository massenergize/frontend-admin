import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ProfileCard from 'dan-components/CardPaper/ProfileCard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import styles from './profile-jss';

class Connection extends React.Component {
  render() {
    const { classes, data } = this.props;
    const { users, avatar } = data;
    return (
      <Paper elevation={0} style={{ padding: 30 }}>
        <Grid
          container
          alignItems="flex-start"
          justify="space-between"
          direction="row"
          spacing={16}
          className={classes.root}
        >

          {users
            && users.map((u, index) => (
              <Grid item md={12} sm={12} xs={12} key={index.toString()} style={{ marginTop: -50 }}>
                <ListItem button style={{ marginTop: 35 }}>
                  <Avatar className={classes.avatarRed}>
                    {
                      u.profile_picture
                        ? <img src={u.profile_picture.url} />
                        : <ImageIcon />
                    }
                  </Avatar>
                  <ListItemText primary={`${u.full_name}`} />
                  <ListItemText primary={`${u.email}`} />
                  {/* <ListItemText primary="Member" /> */}
                </ListItem>
                <Divider />
              </Grid>
            ))
          }

        </Grid>
      </Paper>
    );
  }
}

Connection.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Connection);
