import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import datas from 'dan-api/apps/connectionData';
import ProfileCard from 'dan-components/CardPaper/ProfileCard';
import styles from './profile-jss';

class Connection extends React.Component {
  render() {
    const { classes, data } = this.props;
    const { users, avatar } = data;

    return (
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        direction="row"
        spacing={16}
        className={classes.root}
      >
        { users
          && users.map((u, index) => (
            <Grid item md={4} sm={6} xs={12} key={index.toString()}>
              <ProfileCard
                cover={u.cover}
                avatar={u.profile_picture ? u.profile_picture.url : avatar}
                name={u.full_name}
                title={u.preferred_name}
                connection="Member"
                isVerified={data.verified}
                btnText="See Full Profile"
                user={u}
              />
            </Grid>
          ))
        }
      </Grid>
    );
  }
}

Connection.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Connection);
