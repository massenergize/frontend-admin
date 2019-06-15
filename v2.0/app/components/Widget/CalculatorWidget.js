import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Calculator from '../Calculator';
import styles from './widget-jss';

class CalculatorWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.rootCalculator}>
        <Calculator />
      </Paper>
    );
  }
}

CalculatorWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CalculatorWidget);
