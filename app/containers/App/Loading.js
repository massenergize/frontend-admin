import React, { Component } from 'react'
import { withStyles } from "@mui/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import classNames from 'classnames';
import Outer from './../Templates/Outer';
import Spinner from './AppSpinner';
import AppSpinner from './AppSpinner';



class Loading extends Component {
  render() {
    return (
      <Outer>
        <AppSpinner />
      </Outer>

    )
  }
}

export default Loading;
