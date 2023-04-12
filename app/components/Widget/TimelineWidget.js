import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './widget-jss';

const dataTimeline = [
  {
    time: '11:20',
    title: 'Updated Product',
    desc: 'Hello'
  },
  {
    time: 'Yesterday',
    title: 'You liked James products',
    desc: 'Hello'
  },
  {
    time: 'Yesterday',
    title: 'James just like your product',
    desc: 'Hello'
  },
  {
    time: '11 Oct 2018',
    title: 'Jenna commented on your product',
    desc: 'Hello'
  },
  {
    time: 'Last week',
    title: 'Jihan Doe just like your product',
    desc: 'Hello'
  },
];

class TimelineWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <PapperBlock whiteBg noMargin title="Recent Activity" icon="ios-time-outline" desc="">
        <div className={classes.activityWrap}>
          <List>
            {dataTimeline.map((item, index) => (
              <ListItem key={index.toString()} className={classes.activityList}>
                <ListItemIcon>
                  <div className={classes.timeDot}>
                    <time>{item.time}</time>
                    <span />
                  </div>
                </ListItemIcon>
                <ListItemText primary={item.title} className={classes.activityText} secondary={item.desc} />
              </ListItem>
            ))}
          </List>
        </div>
      </PapperBlock>
    );
  }
}

TimelineWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelineWidget);
