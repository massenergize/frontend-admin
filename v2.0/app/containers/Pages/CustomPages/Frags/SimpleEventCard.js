import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles, vanish, uploadBox } from './../styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@material-ui/icons/Close';
import imgApi from 'dan-api/images/photos';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
class SimpleEventCard extends React.Component {




  render() {
    const { classes } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <Paper className={classes.root} elevation={4} style={{ margin: 6, padding: 0 }}>
          <img src={imgApi[8]} style={{ width: "100%" }} />
          <div style={{ padding: 10 }}>
            <p>{this.props.title}</p>
            <Fab size="small"
              onClick = {()=>{this.props.removeEventFxn(this.props.id)}}
              style={{ background: '#ab0a29', color: 'white', position: 'absolute', top: 15, right: 20 }}
              aria-label="add"
              className={classes.button}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(SimpleEventCard);