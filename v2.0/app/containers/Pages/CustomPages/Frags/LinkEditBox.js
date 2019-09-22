import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles, vanish, uploadBox, marginTop5 } from './../styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@material-ui/icons/Close';

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