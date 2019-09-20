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
const events = [
  { id: 1, name: "First Event", img: "" },
  { id: 2, name: "Second Event", img: "" },
  { id: 3, name: "Third Event", img: "" },
  { id: 4, name: "Fourth Event", img: "" },
  { id: 5, name: "Fifth Event", img: "" },
]

class EventChoices extends React.Component {

  findObj = (val) => {
    var section = events;
    for (var i = 0; i < section.length; i++) {
      if (section[i].name === val) {
        return section[i];
      }
    }
    return null;
  }


  handleChange = (event) => {
    var obj = this.findObj(event.target.value);
    this.props.addEventFxn(obj);
  }
  ejectEventCards = (classes) => {
    return this.props.events.map(item => {
      return (
        <Grid item xl={3} md={3} sm={4} xs={12}>
          <SimpleEventCard 
            title ={item.name}
            removeEventFxn ={this.props.removeEventFxn}
            id = {item.id}
          />
        </Grid>
      );
    });
  }
  render() {
    const { classes } = this.props;
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
              onChange={option => { this.handleChange(option) }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Choose any 3 event you would like to be displayed on the homepage of this community"
              margin="normal"
              variant="outlined"
            >
              {events.map(option => (
                <MenuItem key={option.name.toString()} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
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