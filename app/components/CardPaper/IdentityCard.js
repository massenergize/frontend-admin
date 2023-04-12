import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LocalPhone from '@mui/icons-material/LocalPhone';
import LocationOn from '@mui/icons-material/LocationOn';
import styles from './cardStyle-jss';

class IdentityCard extends React.Component {
  render() {
    const {
      classes,
      title,
      name,
      avatar,
      phone,
      address,
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="subtitle1" className={classes.title}>{title}</Typography>
          <Divider className={classes.divider} />
          <ListItem>
            <Avatar
              alt={name}
              src={avatar}
              className={classes.avatar}
            />
            <ListItemText primary="Name" secondary={name} />
          </ListItem>
          <ListItem>
            <Avatar className={classes.avatar}>
              <LocalPhone />
            </Avatar>
            <ListItemText primary="Phone" secondary={phone} />
          </ListItem>
          <ListItem>
            <Avatar className={classes.avatar}>
              <LocationOn />
            </Avatar>
            <ListItemText primary="Address" secondary={address} />
          </ListItem>
        </CardContent>
      </Card>
    );
  }
}

IdentityCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default withStyles(styles)(IdentityCard);
