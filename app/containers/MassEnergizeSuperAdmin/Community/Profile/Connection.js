import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import ProfileCard from 'dan-components/CardPaper/ProfileCard';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import amber from '@mui/material/colors/amber';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
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
