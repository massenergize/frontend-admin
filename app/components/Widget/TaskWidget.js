import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import PapperBlock from '../PapperBlock/PapperBlock';
import styles from './widget-jss';

class TaskWidget extends React.Component {
  state = {
    checked: [0],
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { classes } = this.props;
    const { checked } = this.state;
    return (
      <PapperBlock
        title="My Task"
        icon="ios-checkbox-outline"
        noMargin
        whiteBg
        colorMode
        desc="All Your to do list. Just check it whenever You done."
        className={classes.root}
      >
        <List className={classes.taskList}>
          {[0, 1, 2, 3, 4, 5, 6].map(value => (
            <Fragment key={value}>
              <ListItem
                key={value}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(value)}
                className={
                  classNames(
                    classes.listItem,
                    checked.indexOf(value) !== -1 ? classes.done : ''
                  )
                }
              >
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={`Task item ${value + 1}`} secondary={`Task description ${value + 1}`} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Fragment>
          ))}
        </List>
      </PapperBlock>
    );
  }
}

TaskWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskWidget);
