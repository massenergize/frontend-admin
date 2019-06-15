import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import 'dan-styles/vendors/react-clock/react-clock.css';
import styles from './widget-jss';

class DateWidget extends Component {
  state = {
    date: new Date(),
  }

  componentWillMount() {
    this.setTime();
  }

  componentDidMount() {
    setInterval(
      () => {
        this.setState({ date: new Date() });
        this.setTime();
      },
      1000
    );
  }

  onChange = date => this.setState({ date });

  setTime() {
    const date = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', };
    const currentTime = date.toLocaleTimeString([], timeOptions);

    this.setState({ currentTime });
  }

  render() {
    const { classes } = this.props;
    const { date, currentTime } = this.state;
    return (
      <Paper className={classes.wrapperDate}>
        <section className={classes.calendarWrap}>
          <Calendar
            onChange={this.onChange}
            value={date}
          />
        </section>
        <section className={classes.clockWrap}>
          <Clock
            value={date}
            renderSecondHand={false}
          />
          <h4 className={classes.today}>{currentTime}</h4>
        </section>
      </Paper>
    );
  }
}

DateWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateWidget);
