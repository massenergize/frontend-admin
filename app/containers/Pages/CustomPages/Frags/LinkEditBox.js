import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@mui/material/TextField';
import { withStyles } from "@mui/styles";
import { styles, vanish, uploadBox, marginTop5 } from './../styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@mui/icons-material/Close';

class LinkEditBox extends React.Component {


  handleTitleChange = (event)=>{
    const f = this.props.feature;
    var obj = {...f,title:event.target.value}; 
    this.props.trackChangeFxn(obj);
  }
  handleDescChange =(event)=>{
    const f = this.props.feature;
    var obj = {...f,desc:event.target.value};
    this.props.trackChangeFxn(obj);
  }
  render() {
    const f = this.props.feature;
    return (
      <div>
        <div style={{ marginTop: 5 }}></div>
        <div style={uploadBox} >
          <h5>{f.name}</h5>
          <p style={{color:'green'}}>You can leave everything empty here, we will cook something up.</p>
          <TextField
            fullWidth
            onChange ={(event)=>{this.handleTitleChange(event)}}
            placeholder="Events"
            value={f.title}
            margin="normal"
            variant="outlined"
            helperText="Title text of the section..."
          />
          <TextField
            style={{ marginTop: 6 }}
            fullWidth
            multiline
            rows={5}
            rowMax={5}
            onChange ={(event)=>{this.handleDescChange(event)}}
            placeholder="Checkout these upcoming events..."
            margin="normal"
            variant="outlined"
            value={f.desc}
            helperText="A few words about the section..."
          />
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(LinkEditBox)