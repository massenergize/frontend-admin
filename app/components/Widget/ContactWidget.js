import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Hidden from '@mui/material/Hidden';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import PhoneIcon from '@mui/icons-material/Phone';
import Chat from '@mui/icons-material/Chat';
import Mail from '@mui/icons-material/Mail';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import Check from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/RemoveCircle';
import AccountBox from '@mui/icons-material/AccountBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistAddCheck from '@mui/icons-material/PlaylistAddCheck';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dataContact from 'dan-api/apps/contactData';
import messageStyles from 'dan-styles/Messages.scss';
import styles from './widget-jss';

/* Tab Container */
function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
/* END Tab Container */

/* Contact List */
function ContactList(props) {
  const getItem = dataArray => dataArray.map(data => (
    <ListItem
      button
      key={data.id}
    >
      <Avatar alt={data.name} src={data.avatar} className={props.classes.avatar} />
      <ListItemText primary={data.name} secondary={data.title} />
      <Hidden xsDown>
        <ListItemSecondaryAction>
          <Tooltip title="Chat">
            <IconButton className={props.classes.blueText} aria-label="Chat">
              <Chat />
            </IconButton>
          </Tooltip>
          <Tooltip title="Email">
            <IconButton className={props.classes.pinkText} aria-label="Email">
              <Mail />
            </IconButton>
          </Tooltip>
          <Tooltip title="Call">
            <IconButton className={props.classes.tealText} aria-label="Help">
              <PhoneIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </Hidden>
      <Hidden smUp>
        <ListItemSecondaryAction>
          <IconButton
            aria-label="More"
            aria-haspopup="true"
            onClick={props.openMenu}
          >
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </Hidden>
    </ListItem>
  ));
  return (
    <List>
      {getItem(dataContact)}
    </List>
  );
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired,
  openMenu: PropTypes.func.isRequired,
};

const ContactListStyled = withStyles(styles)(ContactList);
/* END Contact List */

/* Conversation List */
function MessagesList(props) {
  const { classes } = props;
  return (
    <List>
      <ListItem button component={NavLink} to="/app/pages/chat">
        <Avatar alt={dataContact[2].name} src={dataContact[2].avatar} className={classes.avatar} />
        <ListItemText primary={dataContact[2].name} className={classes.messages} secondary="" />
        <ListItemSecondaryAction>
          <Typography variant="caption">10:42 PM</Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button component={NavLink} to="/app/pages/chat">
        <Avatar alt={dataContact[5].name} src={dataContact[5].avatar} className={classes.avatar} />
        <ListItemText primary={dataContact[5].name} className={classes.messages} secondary="" />
        <ListItemSecondaryAction>
          <Typography variant="caption">11:17 AM</Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button component={NavLink} to="/app/pages/chat">
        <Avatar alt={dataContact[1].name} src={dataContact[1].avatar} className={classes.avatar} />
        <ListItemText primary={dataContact[1].name} className={classes.messages} secondary="" />
        <ListItemSecondaryAction>
          <Typography variant="caption">11 Oct</Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button component={NavLink} to="/app/pages/chat">
        <Avatar alt={dataContact[0].name} src={dataContact[0].avatar} className={classes.avatar} />
        <ListItemText primary={dataContact[0].name} className={classes.messages} secondary="" />
        <ListItemSecondaryAction>
          <Typography variant="caption">12 Oct</Typography>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

MessagesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const MessagesListStyled = withStyles(styles)(MessagesList);
/* END Conversation List */

/* Email List */
function NotifList(props) {
  const { classes, openMenu } = props;
  return (
    <List>
      <ListItem button className={messageStyles.messageInfo}>
        <Avatar className={messageStyles.icon}>
          <Info />
        </Avatar>
        <ListItemText primary="" secondary="12 Oct 2018" />
        <Hidden xsDown>
          <ListItemSecondaryAction>
            <Button variant="outlined" size="small" color="primary" className={classes.button}>
              Fix it
            </Button>
            <Button variant="outlined" size="small" className={classes.button}>
              Skip
            </Button>
          </ListItemSecondaryAction>
        </Hidden>
        <Hidden smUp>
          <ListItemSecondaryAction>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={openMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Hidden>
      </ListItem>
      <ListItem button className={messageStyles.messageSuccess}>
        <Avatar className={messageStyles.icon}>
          <Check />
        </Avatar>
        <ListItemText primary="" secondary="12 Oct 2018" />
        <Hidden xsDown>
          <ListItemSecondaryAction>
            <Button variant="outlined" size="small" color="primary" className={classes.button}>
              Fix it
            </Button>
            <Button variant="outlined" size="small" className={classes.button}>
              Skip
            </Button>
          </ListItemSecondaryAction>
        </Hidden>
        <Hidden smUp>
          <ListItemSecondaryAction>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={openMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Hidden>
      </ListItem>
      <ListItem button className={messageStyles.messageWarning}>
        <Avatar className={messageStyles.icon}>
          <Warning />
        </Avatar>
        <ListItemText primary="" secondary="12 Oct 2018" />
        <Hidden xsDown>
          <ListItemSecondaryAction>
            <Button variant="outlined" size="small" color="primary" className={classes.button}>
              Fix it
            </Button>
            <Button variant="outlined" size="small" className={classes.button}>
              Skip
            </Button>
          </ListItemSecondaryAction>
        </Hidden>
        <Hidden smUp>
          <ListItemSecondaryAction>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={openMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Hidden>
      </ListItem>
      <ListItem button className={messageStyles.messageError}>
        <Avatar className={messageStyles.icon}>
          <Error />
        </Avatar>
        <ListItemText primary="" secondary="12 Oct 2018" />
        <Hidden xsDown>
          <ListItemSecondaryAction>
            <Button variant="outlined" size="small" color="primary" className={classes.button}>
              Fix it
            </Button>
            <Button variant="outlined" size="small" className={classes.button}>
              Skip
            </Button>
          </ListItemSecondaryAction>
        </Hidden>
        <Hidden smUp>
          <ListItemSecondaryAction>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={openMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Hidden>
      </ListItem>
    </List>
  );
}

NotifList.propTypes = {
  classes: PropTypes.object.isRequired,
  openMenu: PropTypes.func.isRequired,
};

const NotifListStyled = withStyles(styles)(NotifList);
/* END Email List */

class ContactWidget extends React.Component {
  state = {
    value: 0,
    anchorEl: null,
    anchorElAction: null,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleOpenAction = event => {
    this.setState({ anchorElAction: event.currentTarget });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      anchorElAction: null
    });
  };

  render() {
    const { classes } = this.props;
    const { value, anchorEl, anchorElAction } = this.state;
    const open = Boolean(anchorEl);
    const openAct = Boolean(anchorElAction);
    return (
      <Fragment>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <Chat className={classes.blueText} />
            </ListItemIcon>
            <ListItemText variant="inset" primary="Chat" />
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <Mail className={classes.pinkText} />
            </ListItemIcon>
            <ListItemText variant="inset" primary="Email" />
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <PhoneIcon className={classes.tealText} />
            </ListItemIcon>
            <ListItemText variant="inset" primary="Call" />
          </MenuItem>
        </Menu>
        <Menu
          id="long-menu-act"
          anchorEl={anchorElAction}
          open={openAct}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <Check className={classes.tealText} />
            </ListItemIcon>
            <ListItemText variant="inset" primary="Fix it" />
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <PlaylistAddCheck />
            </ListItemIcon>
            <ListItemText variant="inset" primary="Skip" />
          </MenuItem>
        </Menu>
        <Paper className={classes.rootContact}>
          <AppBar position="static" color="default">
            <Hidden mdUp>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab icon={<AccountBox />} />
                <Tab icon={<Chat />} />
                <Tab icon={<NotificationsActive />} />
              </Tabs>
            </Hidden>
            <Hidden smDown>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Contacts" icon={<AccountBox />} />
                <Tab
                  label={(
                    <Badge className={classes.tabNotif} color="secondary" badgeContent={4}>
                      Messages
                    </Badge>
                  )}
                  icon={<Chat />}
                />
                <Tab
                  label={(
                    <Badge className={classes.tabNotif} color="secondary" badgeContent={4}>
                      Notifications
                    </Badge>
                  )}
                  icon={<NotificationsActive />}
                />
              </Tabs>
            </Hidden>
          </AppBar>
          {value === 0 && <TabContainer><ContactListStyled openMenu={this.handleOpen} /></TabContainer>}
          {value === 1 && <TabContainer><MessagesListStyled /></TabContainer>}
          {value === 2 && <TabContainer><NotifListStyled openMenu={this.handleOpenAction} /></TabContainer>}
        </Paper>
      </Fragment>
    );
  }
}

ContactWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactWidget);
