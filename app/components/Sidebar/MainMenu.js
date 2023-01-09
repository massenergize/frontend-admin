import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import Ionicon from 'react-ionicons';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styles from './sidebar-jss';
import { reduxSignOut } from '../../redux/redux-actions/adminActions';

class MainMenu extends React.Component {
  handleClick() {
    const { toggleDrawerOpen, loadTransition } = this.props;
    toggleDrawerOpen();
    loadTransition(false);
  }

  ejectSignOut() {
    const { classes } = this.props;
    return (
      <button style={{ borderBottomRightRadius: 55, borderTopRightRadius: 55, textTransform: 'capitalize', background: "#fff6f6", fontWeight: 500, width: '100%' }} onClick={() => { this.props.reduxSignOut(); }}>
        <Ionicon icon="md-log-out" style={{ float: 'left', marginRight: 21 }} />
        <span style={{ float: 'left', marginTop: 3, fontWeight: '700' }}>signout</span>
      </button>
    )
  }

  render() {
    const {
      classes,
      openSubMenu,
      open,
      dataMenu
    } = this.props;
    const getMenus = menuArray => menuArray.map((item, index) => {
      if (item.child) {
        return (
          <div key={index.toString()}>
            <ListItem
              button
              className={
                classNames(
                  classes.head,
                  item.icon ? classes.iconed : '',
                  open.indexOf(item.key) > -1 ? classes.opened : '',
                )
              }
              onClick={() => openSubMenu(item.key, item.keyParent)}
            >
              {item.icon && (
                <ListItemIcon className={classes.icon}>
                  <Ionicon icon={item.icon} />
                </ListItemIcon>
              )}
              <ListItemText classes={{ primary: classes.primary }} variant="inset" primary={item.name} />
              {open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              component="div"
              className={classNames(
                classes.nolist,
                (item.keyParent ? classes.child : ''),
              )}
              in={open.indexOf(item.key) > -1}
              timeout="auto"
              unmountOnExit
            >
              <List className={classes.dense} component="nav" dense>
                {getMenus(item.child, 'key')}
              </List>
            </Collapse>
          </div>
        ); 
      }
      if (item.title) {
        return (
          <ListSubheader
            disableSticky
            key={index.toString()}
            component="div"
            className={classes.title}
          >
            {item.name}
          </ListSubheader>
        );
      }
      return (
        <ListItem
          key={index.toString()}
          button
          exact
          className={classes.nested}
          activeClassName={classes.active}
          component={NavLink}
          to={item.link}
          onClick={() => this.handleClick()}
        >
          {item.icon && (
            <ListItemIcon className={classes.icon}>
              <Ionicon icon={item.icon} />
            </ListItemIcon>
          )}
          <ListItemText classes={{ primary: classes.primary }} inset primary={item.name}  />
          {item.badge && (
            <Chip color="primary" label={item.badge} className={classes.badge} />
          )}
        </ListItem>
      );
    });
    return (
      <div>
        {getMenus(dataMenu)}
        {this.ejectSignOut()}

      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  openSubMenu: PropTypes.func.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
};

const openAction = (key, keyParent) => ({ type: 'OPEN_SUBMENU', key, keyParent });
const reducer = 'ui';

const mapStateToProps = state => ({
  force: state, // force active class for sidebar menu
  open: state.getIn([reducer, 'subMenuOpen'])
});

const mapDispatchToProps = dispatch => ({
  openSubMenu: bindActionCreators(openAction, dispatch),
  reduxSignOut: bindActionCreators(reduxSignOut, dispatch)
});

const MainMenuMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);

export default withTheme()(withStyles(styles)(MainMenuMapped));
