import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import classNames from 'classnames';
class AppSpinner extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <CircularProgress className={classes.progress} color="secondary" />
      </div>
    )
  }
}

export default AppSpinner
