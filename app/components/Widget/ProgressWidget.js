import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Type from 'dan-styles/Typography.scss';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Check from '@mui/icons-material/Check';
import { withStyles } from "@mui/styles";
import styles from './widget-jss';

function ProgressWidget(props) {
  const { classes } = props;
  return (
    <Paper className={classes.styledPaper} elevation={4}>
      <Typography className={classes.title} variant="h5" component="h3">
        <span className={Type.light}>Profile Strength: </span>
        <span className={Type.bold}>Intermediate</span>
      </Typography>
      <Grid container justify="center">
        <Chip
          avatar={(
            <Avatar>
              <Check />
            </Avatar>
          )}
          label="60% Progress"
          className={classes.chipProgress}
          color="primary"
        />
      </Grid>
      <LinearProgress variant="determinate" className={classes.progressWidget} value={60} />
    </Paper>
  );
}

ProgressWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressWidget);
