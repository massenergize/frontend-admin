import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import datas from 'dan-api/apps/connectionData';
import ProfileCard from 'dan-components/CardPaper/ProfileCard';
import styles from './profile-jss';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

class Connection extends React.Component {
  render() {
    const { classes, data } = this.props;
    const { users, avatar } = data;
    console.log("tuire ruier ueirueir ", users);
    return (
      <Paper elevation={0} style={{padding:30}}>
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
                      u.profile_picture ?
                        <img src={u.profile_picture.url} />
                        :
                        <ImageIcon />
                    }
                  </Avatar>
                  <ListItemText primary={`${u.full_name}`} />
                  <ListItemText primary={`${u.email}`} />
                  <ListItemText primary="Member" />
                </ListItem>
                <Divider />



                {/* <ProfileCard
                cover={u.cover}
                avatar={u.profile_picture ? u.profile_picture.url : avatar}
                name={u.full_name}
                title={u.preferred_name}
                connection="Member"
                isVerified={data.verified}
                btnText="See Full Profile"
                user={u}
              /> */}
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
