import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Ionicon from 'react-ionicons';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import styles from './header-jss';
// import CommunitySwitch from './CommunitySwitch';
import {
  reduxGetAllTeams,
  reduxGetAllCommunityTeams,
  reduxGetAllActions,
  reduxLoadSelectedCommunity,
  reduxLoadAllCommunities,
  reduxCallFullCommunity,
  reduxGetAllCommunityActions
} from '../../redux/redux-actions/adminActions';

const elem = document.documentElement;

class Header extends React.Component {
  state = {
    open: false,
    fullScreen: false,
    turnDarker: false,
    showTitle: false
  };

  // Initial header style
  flagDarker = false;

  flagTitle = false;

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
    const newFlagTitle = (scroll > 40);
    if (this.flagDarker !== newFlagDarker) {
      this.setState({ turnDarker: newFlagDarker });
      this.flagDarker = newFlagDarker;
    }
    if (this.flagTitle !== newFlagTitle) {
      this.setState({ showTitle: newFlagTitle });
      this.flagTitle = newFlagTitle;
    }
  }

  openFullScreen = () => {
    this.setState({ fullScreen: true });
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  closeFullScreen = () => {
    this.setState({ fullScreen: false });
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  turnMode = mode => {
    const { changeMode } = this.props;
    if (mode === 'light') {
      changeMode('dark');
    } else {
      changeMode('light');
    }
  };

  handleCommunityChange = (id) => {
    const { pathname } = window.location;
    const page = pathname.split('/').slice(-1)[0];
    switch (page) {
      case '':
        window.location = `/admin/community/${id}/profile`;
        break;
      case 'summary':
        break;
      case 'profile':
        window.location = `/admin/community/${id}/profile`;
        break;
      case 'actions':
        this.props.callCommunityActions(id);
        break;
      case 'teams':
        this.props.callTeamsForNormalAdmin(id);
        break;
      default:
    }
  }

  render() {
    const {
      classes,
      toggleDrawerOpen,
      margin,
      position,
      gradient,
      mode,
      title,
      openGuide,
      history,
      auth
    } = this.props;
    const {
      fullScreen,
      open,
      turnDarker,
      showTitle
    } = this.state;
    const setMargin = (sidebarPosition) => {
      if (sidebarPosition === 'right-sidebar') {
        return classes.right;
      }
      return classes.left;
    };

    const isTitle = title.length !== 0;


    return (
      <AppBar
        className={
          classNames(
            classes.appBar,
            classes.floatingBar,
            margin && classes.appBarShift,
            setMargin(position),
            turnDarker && classes.darker,
            gradient ? classes.gradientBg : classes.solidBg
          )
        }
      >
        <Toolbar disableGutters={!open}>
          <Fab
            size="small"
            className={classes.menuButton}
            aria-label="Menu"
            onClick={toggleDrawerOpen}
          >
            <MenuIcon />
          </Fab>
          <Hidden smDown>
            <div className={classes.headerProperties}>
              {isTitle && showTitle && (
                <Typography component="h2" className={classNames(classes.headerTitle, classes.show)}>
                  {title}
                </Typography>
              )
              }
              <div className={classNames(classes.headerAction)}>
                {fullScreen ? (
                  <Tooltip title="Exit Full Screen" placement="bottom">
                    <IconButton className={classes.button} onClick={this.closeFullScreen}>
                      <Ionicon icon="ios-qr-scanner" />
                    </IconButton>
                  </Tooltip>
                ) : (
                    <Tooltip title="Full Screen" placement="bottom">
                      <IconButton className={classes.button} onClick={this.openFullScreen}>
                        <Ionicon icon="ios-qr-scanner" />
                      </IconButton>
                    </Tooltip>
                  )}
                <Tooltip title="Turn Dark/Light" placement="bottom">
                  <IconButton className={classes.button} onClick={() => this.turnMode(mode)}>
                    <Ionicon icon="ios-bulb-outline" />
                  </IconButton>
                </Tooltip>
                <Button className={classes.button} onClick={openGuide}>
                  <Ionicon icon="ios-help-circle-outline" /> &nbsp; Need Help?
                </Button>
              </div>

            </div>
          </Hidden>
          {/* <CommunitySwitch actionToPerform={this.handleCommunityChange} /> */}

          <div className={classes.searchWrapper}>
            {/* <div className={classNames(classes.wrapper, classes.light)}> */}
            {/* <div className={classes.search}>
                <SearchIcon />
              </div>
              <SearchUi history={history} /> */}
            <h3 className={classes.howdy}>
              Howdy,
              {auth && ' ' + auth.preferred_name}
              {auth && (auth.is_super_admin ? ' (Super Admin) ' : ' (Community Admin) ')}
              <span role="img" aria-label="smiley">
                😊
              </span>
            </h3>
            {/* </div> */}
          </div>
          <Hidden xsDown>
            <span className={classes.separatorV} />
          </Hidden>
          <UserMenu />
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  margin: PropTypes.bool.isRequired,
  gradient: PropTypes.bool.isRequired,
  position: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired,
  openGuide: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(['auth']),
  allTeams: state.getIn(['allTeams']),
  allActions: state.getIn(['allActions']),
  community: state.getIn(['selected_community'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  callTeamsForSuperAdmin: reduxGetAllTeams,
  callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
  callAllActions: reduxGetAllActions,
  callCommunityActions: reduxGetAllCommunityActions,
  loadSelectedCommunity: reduxLoadSelectedCommunity,
  loadAllCommunities: reduxLoadAllCommunities,
  callFullCommunity: reduxCallFullCommunity,
}, dispatch);
const HeaderMapped = connect(mapStateToProps, mapDispatchToProps)(Header);
export default withStyles(styles)(HeaderMapped);
