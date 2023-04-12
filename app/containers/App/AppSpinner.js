import React, { Component } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import purple from '@mui/material/colors/purple';
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
