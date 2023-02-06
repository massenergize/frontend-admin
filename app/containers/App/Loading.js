import React, { Component } from 'react'
import { withStyles } from "@mui/styles";
import CircularProgress from '@mui/material/CircularProgress';
import purple from '@mui/material/colors/purple';
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
