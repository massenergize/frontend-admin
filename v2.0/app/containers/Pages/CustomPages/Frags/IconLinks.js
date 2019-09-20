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
  "Events",
  "Actions",
  "Testimonials",
  "Service Providers"
];
class IconLinks extends React.Component {

  ejectFeatures(classes) {
    return this.props.selectedFeatures.map(item => {
      return (
        <Button onClick={()=>{this.props.removeFeatureFxn(item)}} style={{ margin: 5 }} key={item} variant="contained" className={classes.button}>
          {item}
          <DeleteIcon className={classes.extendedIcon} />
        </Button>
      )
    })
  }
  handleSelection = (event) => {
    this.props.addFeaturesFxn(event.target.value);
  }
  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ background: 'floralwhite' }}>
            <h4>Select Which Features You Want To Link To</h4>
            {this.ejectFeatures(classes)}
            <TextField
              id="outlined-select-sections"
              select
              label="Choose Features"
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
              helperText ="Quick links for these features will be added on the home page"
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

export default withStyles(styles)(IconLinks);

