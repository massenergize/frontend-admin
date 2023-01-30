import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@mui/material/TextField';
import { withStyles } from "@mui/styles";
import { styles, vanish, uploadBox } from './../styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@mui/icons-material/Close';

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