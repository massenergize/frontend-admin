import React from 'react';
import PropTypes from 'prop-types';
import { closeAllAction } from 'dan-actions/UiActions';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import ExpandMore from '@mui/icons-material/ExpandMore';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ClickAwayListener } from "@mui/material";
import Paper from '@mui/material/Paper';
import Ionicon from 'react-ionicons';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import styles from './header-jss';

class MegaMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: [],
      openMenu: []
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
  }

  componentDidMount() {
    const { open } = this.props;
    setTimeout(() => {
      this.setState({ active: open });
    }, 50);
  }

  handleOpenMenu = (event, key, keyParent) => {
    const { openSubMenu } = this.props;
    openSubMenu(key, keyParent);
    setTimeout(() => {
      this.setState({
        openMenu: this.props.open, // eslint-disable-line
      });
    }, 50);
  };

  handleClose = event => {
    const { closeAll } = this.props;
    closeAll();
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ openMenu: [] });
  }

  handleActiveParent = key => {
    this.setState({
      active: [key],
      openMenu: []
    });
  }

  render() {
    const { classes, open, dataMenu } = this.props;
    const { active, openMenu } = this.state;
    const getMenus = (parent, menuArray) => menuArray.map((item, index) => {
      if (item.multilevel) {
        return false;
      }
      if (item.child) {
        return (
          <div key={index.toString()}>
            <Button
              aria-haspopup="true"
              buttonRef={node => {
                this.anchorEl = node;
              }}
              className={
                classNames(
                  classes.headMenu,
                  open.indexOf(item.key) > -1 ? classes.opened : '',
                  active.indexOf(item.key) > -1 ? classes.selected : ''
                )
              }
              onClick={(event) => this.handleOpenMenu(event, item.key, item.keyParent)}
            >
              {item.name}
              <ExpandMore className={classes.rightIcon} />
            </Button>
            <Popper
              open={openMenu.indexOf(item.key) > -1}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => {
                return (
                  <Fade
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{
                      transformOrigin:
                        placement === "bottom"
                          ? "center top"
                          : "center bottom",
                    }}
                  >
                    <Paper className={classes.dropDownMenu}>
                      <ClickAwayListener
                        onClickAway={this.handleClose}
                      >
                        <Grid container>
                          <Grid
                            item
                            md={3}
                            container
                            justify="center"
                          >
                            <span className={classes.bigIcon}>
                              <Ionicon icon={item.icon} />
                            </span>
                          </Grid>
                          <Grid item md={9}>
                            <List
                              role="menu"
                              component="nav"
                              className={classes.megaMenu}
                            >
                              {getMenus(item.key, item.child)}
                            </List>
                          </Grid>
                        </Grid>
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                );
              }}
            </Popper>
          </div>
        );
      }
      if (item.title) {
        return (
          <ListSubheader
            component="div"
            key={index.toString()}
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
          className={classes.megaItem}
          activeClassName={classes.active}
          component={NavLink}
          to={item.link}
          onClick={() => this.handleActiveParent(parent)}
        >
          <ListItemText primary={item.name} />
        </ListItem>
      );
    });
    return (
      <nav className={classes.mainMenu}>
        <div className={classes.megaMenu}>
          {getMenus(null, dataMenu)}
        </div>
      </nav>
    );
  }
}

MegaMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  openSubMenu: PropTypes.func.isRequired,
  closeAll: PropTypes.func.isRequired,
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
  closeAll: () => dispatch(closeAllAction),
});

const MegaMenuMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(MegaMenu);

export default (withStyles(styles)(MegaMenuMapped));
