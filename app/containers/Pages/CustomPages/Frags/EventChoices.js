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
import SimpleEventCard from './SimpleEventCard';

class EventChoices extends React.Component {

  findObj = (id) => {
    var events = this.props.avEvents;
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === Number(id)) {
        return events[i];
      }
    }
    return null;
  }


  handleChange = (event) => {
    var obj = this.findObj(this.props.deCouple('id',event.target.value));
    this.props.addEventFxn(obj);
  }
  ejectEventCards = (classes) => {
    return this.props.events.map((item, index) => {
      return (
        <Grid key={index.toString()} item xl={3} md={3} sm={4} xs={12}>
          <SimpleEventCard
            wholeObj={item}
            title={item.name}
            removeEventFxn={this.props.removeEventFxn}
            id={item.id}
          />
        </Grid>
      );
    });
  }

  ejectList = () => {
    const avEvents = this.props.avEvents;
    if (avEvents.length !== 0) {
      return avEvents.map(option => (
        <MenuItem key={option.name.toString()} value={option.id+"<==>"+option.name}>
          {option.name}
        </MenuItem>
      ));
    }
    else {
      return (
        <MenuItem value={"Nothing"}>
          No Events available for this community yet.
        </MenuItem>
      )
    }
  }
  render() {
    const { classes } = this.props;
    const events = this.props.avEvents;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid container xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ background: '#fafafa' }}>
            <h4>Choose any 3 events that should be displayed on the homepage of this community</h4>
            <TextField
              id="outlined-select-currency"
              select
              label="Choose Events"
              className={classes.textField}

              fullWidth
              onChange={option => { if (events.length !== 0) this.handleChange(option); }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Choose any 3 event you would like to be displayed on the homepage of this community"
              margin="normal"
              variant="outlined"
            >
              {this.ejectList()}
            </TextField>

            <Grid container >
              {this.ejectEventCards(classes)}
            </Grid>
          </Paper>
        </Grid>
      </div>
    )
  }
}
export default withStyles(styles)(EventChoices)