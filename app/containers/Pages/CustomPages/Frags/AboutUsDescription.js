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

class AboutUsDescription extends React.Component {

  render() {
    const {classes} = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} >
              <h4>Add a description</h4>
              <TextField
              fullWidth
              multiline
              rows ={10}
              rowMax={19}
              placeholder="The Wayland community ... "
              margin="normal"
              variant="outlined"
              helperText="This extract will be shown on a section of the homepage"
            />
          </Paper>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(AboutUsDescription);