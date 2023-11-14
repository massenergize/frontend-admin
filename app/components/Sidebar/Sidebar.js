import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import { connect } from 'react-redux';
import classNames from 'classnames';
import Hidden from '@mui/material/Hidden';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import dummy from 'dan-api/dummy/dummyContents';
import { bindActionCreators } from 'redux';
import styles from './sidebar-jss';
import SidebarContent from './SidebarContent';
import communityAdminMenu from '../../api/ui/communityAdminMenu';
import superAdminMenu from '../../api/ui/superAdminMenu';


class Sidebar extends React.Component {
  state = {
    status: dummy.user.status,
    anchorEl: null,
    turnDarker: false
  };

  // Initial header style
  flagDarker = false;

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagDarker = (scroll > 30);
    if (this.flagDarker !== newFlagDarker) {
      this.setState({ turnDarker: newFlagDarker });
      this.flagDarker = newFlagDarker;
    }
  }

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeStatus = status => {
    this.setState({ status });
    this.handleClose();
  }


  render() {
    const {
      classes,
      open,
      toggleDrawerOpen,
      loadTransition,
      leftSidebar,
      auth,
      featureFlags,
    } = this.props;
    const drawerWidth = 240;

    const { status, anchorEl, turnDarker } = this.state;
    const dataMenu = auth && auth.is_super_admin ? superAdminMenu : communityAdminMenu({flags:auth?.feature_flags});
    return (
      <Fragment>
        <Hidden lgUp>
          <SwipeableDrawer
            onClose={toggleDrawerOpen}
            onOpen={toggleDrawerOpen}
            open={!open}
            anchor={leftSidebar ? "left" : "right"}
          >
            <div className={classes && classes.swipeDrawerPaper}>
              <SidebarContent
                drawerPaper
                leftSidebar={leftSidebar}
                toggleDrawerOpen={toggleDrawerOpen}
                loadTransition={loadTransition}
                dataMenu={dataMenu}
                status={status}
                anchorEl={anchorEl}
                openMenuStatus={this.handleOpen}
                closeMenuStatus={this.handleClose}
                changeStatus={this.handleChangeStatus}
              />
            </div>
          </SwipeableDrawer>
        </Hidden>
        <Hidden mdDown>
          <Drawer
            variant="permanent"
            onClose={toggleDrawerOpen}
            classes={{
              paper: classNames(
                classes.drawer,
                classes.drawerPaper,
                !open ? classes.drawerPaperClose : ""
              ),
            }}
            open={open}
            anchor={leftSidebar ? "left" : "right"}
          >
            <SidebarContent
              auth={auth}
              drawerPaper={open}
              leftSidebar={leftSidebar}
              turnDarker={turnDarker}
              loadTransition={loadTransition}
              dataMenu={dataMenu}
              status={status}
              anchorEl={anchorEl}
              openMenuStatus={this.handleOpen}
              closeMenuStatus={this.handleClose}
              changeStatus={this.handleChangeStatus}
            />
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  leftSidebar: PropTypes.bool,
  dataMenu: PropTypes.array.isRequired,
};

Sidebar.defaultProps = {
  leftSidebar: true
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    featureFlags: state.getIn(["featureFlags"]),
  };
}
const SidebarMapped = connect(mapStateToProps, null)(Sidebar);
export default withStyles(styles)(SidebarMapped);
