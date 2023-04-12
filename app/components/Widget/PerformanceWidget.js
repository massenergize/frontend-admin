import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Check from '@mui/icons-material/Check';
import Type from 'dan-styles/Typography.scss';
import styles from 'dan-components/Profile/profile-jss';

class PerformanceWidget extends React.Component {
  render() {
    const { classes } = this.props;
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
            className={classes.chip}
            color="primary"
          />
        </Grid>
        <LinearProgress variant="determinate" className={classes.progress} value={60} />
      </Paper>
    );
  }
}

PerformanceWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PerformanceWidget);
