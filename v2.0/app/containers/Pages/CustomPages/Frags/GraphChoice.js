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
const links = [
  "First Graph",
  "Second Graph",
  "Third Graph",
  "Fourth Graph"
];
class GraphChoice extends React.Component {

  ejectFeatures(classes) {
    return this.props.selectedGraphs.map(item => {
      return (
        <Button onClick={()=>{this.props.removeGraphFxn(item)}} style={{ margin: 5,textTransform:'capitalize' }} key={item} variant="contained" className={classes.button}>
          {item}
          <DeleteIcon className={classes.extendedIcon} />
        </Button>
      )
    })
  }
  handleSelection = (event) => {
   this.props.addGraphFxn(event.target.value);
  }
  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ background: '#f0fff1' }}>
            <h4>What graphs would you like to appear on this community's homepage? </h4>
            {this.ejectFeatures(classes)}
            <TextField
              id="outlined-select-sections"
              select
              label="Choose A Graph"
              className={classes.textField}
              fullWidth
              onChange={(option) => this.handleSelection(option)}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
              variant="outlined"
              helperText ="Add the graphs that will be added to the homepage"
            >
              {links.map(option => (
                <MenuItem key={option.toString()} id={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        </Grid>
      </div>
    )
  }

}

export default withStyles(styles)(GraphChoice);

