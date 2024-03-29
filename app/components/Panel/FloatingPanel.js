import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
// import withWidth, { isWidthDown } from '@mui/material/withWidth';
import classNames from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandIcon from '@mui/icons-material/CallMade';
import MinimizeIcon from '@mui/icons-material/CallReceived';
import styles from './panel-jss';

import { useMediaQuery, useTheme } from "@mui/material";

class FloatingPanel extends React.Component {
  theme = useTheme();
  state = {
    expanded: false,
    matches: false,
  };

  componentDidMount() {
    this.setState({
      matches: useMediaQuery(this.theme.breakpoints.up("sm")),
    });
  }

  toggleExpand() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const {
      classes,
      openForm,
      closeForm,
      children,
      branch,
      title,
      extraSize,
      width,
    } = this.props;
    const { expanded,matches } = this.state;
    return (
      <div>
        <div
          className={classNames(
            classes.formOverlay,
            openForm && (matches || expanded)
              ? classes.showForm
              : classes.hideForm
          )}
        />
        <section
          className={classNames(
            !openForm ? classes.hideForm : classes.showForm,
            expanded ? classes.expanded : "",
            classes.floatingForm,
            classes.formTheme,
            extraSize && classes.large
          )}
        >
          <header>
            {title}
            <div className={classes.btnOpt}>
              <Tooltip title={expanded ? "Exit Full Screen" : "Full Screen"}>
                <IconButton
                  className={classes.expandButton}
                  onClick={() => this.toggleExpand()}
                  aria-label="Expand"
                >
                  {expanded ? <MinimizeIcon /> : <ExpandIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  className={classes.closeButton}
                  onClick={() => closeForm(branch)}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          </header>
          {children}
        </section>
      </div>
    );
  }
}

FloatingPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  openForm: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  branch: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  title: PropTypes.string,
  extraSize: PropTypes.bool,
};

FloatingPanel.defaultProps = {
  title: 'Add New Item',
  extraSize: false,
};

const FloatingPanelResponsive = (FloatingPanel);
export default withStyles(styles)(FloatingPanelResponsive);
