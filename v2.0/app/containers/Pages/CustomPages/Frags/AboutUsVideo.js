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

class AboutUsVideo extends React.Component {

  render() {
    const {classes} = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ background: '#fbfff7' }}>
              <h4>Add A Link To Any Video </h4>
              <TextField
              onChange = {(event)=>{this.props.changeHandler(event)}}
              fullWidth
              placeholder="URL To Video "
              margin="normal"
              variant="outlined"
              helperText="This video will be shown on the homepage"
            />
          </Paper>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(AboutUsVideo);