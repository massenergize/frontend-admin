import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBack from '@mui/icons-material/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Edit from '@mui/icons-material/Edit';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Smartphone from '@mui/icons-material/Smartphone';
import LocationOn from '@mui/icons-material/LocationOn';
import Work from '@mui/icons-material/Work';
import Language from '@mui/icons-material/Language';
import Divider from '@material-ui/core/Divider';
import styles from './contact-jss';

const optionsOpt = [
  'Block Contact',
  'Delete Contact',
  'Option 1',
  'Option 2',
  'Option 3',
];

const ITEM_HEIGHT = 48;

class ContactDetail extends React.Component {
  state = {
    anchorElOpt: null,
  };

  handleClickOpt = event => {
    this.setState({ anchorElOpt: event.currentTarget });
  };

  handleCloseOpt = () => {
    this.setState({ anchorElOpt: null });
  };

  deleteContact = (item) => {
    const { remove } = this.props;
    remove(item);
    this.setState({ anchorElOpt: null });
  }

  render() {
    const {
      classes,
      dataContact,
      itemSelected,
      edit,
      favorite,
      showMobileDetail,
      hideDetail
    } = this.props;
    const { anchorElOpt } = this.state;
    return (
      <main className={classNames(classes.content, showMobileDetail ? classes.detailPopup : '')}>
        <section className={classes.cover}>
          <div className={classes.opt}>
            {/* <IconButton className={classes.favorite} aria-label="Favorite" onClick={() => favorite(dataContact.get(itemSelected))}>
              {dataContact.getIn([itemSelected, 'favorited']) ? (<Star />) : <StarBorder />}
            </IconButton>
            <IconButton aria-label="Edit" onClick={() => edit(dataContact.get(itemSelected))}>
              <Edit />
            </IconButton> */}
            {/* <IconButton
              aria-label="More"
              aria-owns={anchorElOpt ? 'long-menu' : null}
              aria-haspopup="true"
              className={classes.button}
              onClick={this.handleClickOpt}
            >
              <MoreVertIcon />
            </IconButton> */}
            {/* <Menu
              id="long-menu"
              anchorEl={anchorElOpt}
              open={Boolean(anchorElOpt)}
              onClose={this.handleCloseOpt}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200,
                },
              }}
            >
              {optionsOpt.map(option => {
                if (option === 'Delete Contact') {
                  return (
                    <MenuItem key={option} selected={option === 'Edit Profile'} onClick={() => this.deleteContact(dataContact.get(itemSelected))}>
                      {option}
                    </MenuItem>
                  );
                }
                return (
                  <MenuItem key={option} selected={option === 'Edit Profile'} onClick={this.handleCloseOpt}>
                    {option}
                  </MenuItem>
                );
              })}
            </Menu> */}
          </div>
          <IconButton
            onClick={hideDetail}
            className={classes.navIconHide}
            aria-label="Back"
          >
            <ArrowBack />
          </IconButton>
          <Hidden xsDown>
            {dataContact.getIn([itemSelected, 'profile_picture'])
              && (<Avatar alt={dataContact.getIn([itemSelected, 'full_name'])} src={dataContact.getIn([itemSelected, 'profile_picture']).url} className={classes.avatar} />)
            }
            {!dataContact.getIn([itemSelected, 'profile_picture']) && dataContact.getIn([itemSelected, 'full_name'])
              && (<Avatar className={classes.avatar}>{dataContact.getIn([itemSelected, 'full_name']).substring(0, 2).toUpperCase()}</Avatar>)
            }
            <Typography className={classes.userName} variant="h6">
              {dataContact.getIn([itemSelected, 'name'])}
              <Typography variant="caption">
                {dataContact.getIn([itemSelected, 'title'])}
              </Typography>
            </Typography>
          </Hidden>
        </section>
        <div>
          <Hidden smUp>
            <div className={classes.avatarTop}>
              <Avatar alt={dataContact.getIn([itemSelected, 'full_name'])} src={dataContact.getIn([itemSelected, 'avatar'])} className={classes.avatar} />
              <Typography variant="h5">
                {dataContact.getIn([itemSelected, 'name'])}
                <Typography>
                  {dataContact.getIn([itemSelected, 'title'])}
                </Typography>
              </Typography>
            </div>
          </Hidden>
          <List>
            <ListItem>
              <Avatar className={classes.blueIcon}>
                <LocalPhone />
              </Avatar>
              <ListItemText primary={dataContact.getIn([itemSelected, 'preferred_name'])} secondary="Preferred Name" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <Avatar className={classes.tealIcon}>
                <Email />
              </Avatar>
              <ListItemText primary={dataContact.getIn([itemSelected, 'email'])} secondary="Personal Email" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <Avatar className={classes.redIcon}>
                <LocationOn />
              </Avatar>
              <ListItemText primary={(dataContact.getIn([itemSelected, 'communities']) || []).join(', ')} secondary="Member Communities" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <Avatar className={classes.purpleIcon}>
                <Language />
              </Avatar>
              <ListItemText primary={dataContact.getIn([itemSelected, 'is_super_admin']) ? 'Super Admin' : dataContact.getIn([itemSelected, 'is_community_admin']) ? 'Community Admin' : 'Member'} secondary="Role" />
            </ListItem>
          </List>
        </div>
      </main>
    );
  }
}

ContactDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  showMobileDetail: PropTypes.bool.isRequired,
  dataContact: PropTypes.object.isRequired,
  itemSelected: PropTypes.number.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  favorite: PropTypes.func.isRequired,
  hideDetail: PropTypes.func.isRequired,
};

export default withStyles(styles)(ContactDetail);
