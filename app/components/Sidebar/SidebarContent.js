import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import brand from 'dan-api/dummy/brand';
import logo from 'dan-images/logo.png';
import MainMenu from './MainMenu';
import styles from './sidebar-jss';
import { IS_PROD, BUILD_VERSION } from '../../config/constants';

class SidebarContent extends React.Component {
  state = {
    transform: 0,
  };

  componentDidMount = () => {
    // Scroll content to top
    const mainContent = document.getElementById('sidebar');
    mainContent.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    const mainContent = document.getElementById('sidebar');
    mainContent.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    const scroll = event.target.scrollTop;
    this.setState({
      transform: scroll
    });
  }

  render() {
    const {
      classes,
      turnDarker,
      drawerPaper,
      toggleDrawerOpen,
      loadTransition,
      leftSidebar,
      dataMenu,
      status,
      anchorEl,
      openMenuStatus,
      closeMenuStatus,
      changeStatus,
      isLogin
    } = this.props;
    const user = this.props.auth;
    const { transform } = this.state;
    const profile = user && user.profile_picture ? user.profile_picture.url : null;

    const setStatus = st => {
      switch (st) {
        case 'online':
          return classes.online;
        case 'idle':
          return classes.idle;
        case 'bussy':
          return classes.bussy;
        default:
          return classes.offline;
      }
    };
    return (
      <div
        className={classNames(
          classes && classes.drawerInner,
          !drawerPaper ? classes && classes.drawerPaperClose : ""
        )}
      >
        <div className={classes && classes.drawerHeader}>
          <NavLink
            to="/admin"
            className={classNames(
              classes && classes.brand,
              classes && classes.brandBar,
              turnDarker && classes && classes.darker
            )}
          >
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
          {isLogin && user && Object.keys(user).length > 0 && (
            <div
              className={classNames(classes.profile, classes.user)}
              style={{
                opacity: 1 - transform / 100,
                marginTop: transform * -0.3,
              }}
            >
              {user?.profile_picture && (
                <Avatar
                  alt={user?.preferred_name}
                  src={user?.profile_picture.url}
                  style={{ margin: 10 }}
                />
              )}
              {!user?.profile_picture && (
                <Avatar style={{ margin: 10 }}>
                  {user?.preferred_name?.substring(0, 2)}
                </Avatar>
              )}
              <div>
                <h4>{user?.preferred_name ? user?.preferred_name : "..."}</h4>
                <small>
                  {user?.is_super_admin ? "Super Admin" : "Community Admin "}
                </small>
                <p style={{ fontSize: "7px" }}>
                  {IS_PROD ? "Production " : "Development "}
                  Build version
                  {" " + BUILD_VERSION}
                </p>
              </div>
            </div>
          )}
        </div>
        <div
          id="sidebar"
          className={classNames(
            classes.menuContainer,
            leftSidebar && classes.rounded,
            isLogin && classes.withProfile
          )}
        >
          <MainMenu
            loadTransition={loadTransition}
            dataMenu={dataMenu}
            toggleDrawerOpen={toggleDrawerOpen}
          />
        </div>
      </div>
    );
  }
}

SidebarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerPaper: PropTypes.bool.isRequired,
  turnDarker: PropTypes.bool,
  toggleDrawerOpen: PropTypes.func,
  loadTransition: PropTypes.func,
  leftSidebar: PropTypes.bool.isRequired,
  dataMenu: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  anchorEl: PropTypes.object,
  openMenuStatus: PropTypes.func.isRequired,
  closeMenuStatus: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  isLogin: PropTypes.bool
};

SidebarContent.defaultProps = {
  turnDarker: false,
  toggleDrawerOpen: () => {},
  loadTransition: () => {},
  anchorEl: null,
  isLogin: true,
};


export default withStyles(styles)(SidebarContent);
