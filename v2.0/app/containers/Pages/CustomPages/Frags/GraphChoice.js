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

class GraphChoice extends React.Component {

  ejectSelectedGraphs(classes) {
    return this.props.selectedGraphs.map(item => {
      return (
        <Button key={item.id.toString()} onClick={() => { this.props.removeGraphFxn(item.id) }} style={{ background: 'rgb(225, 249, 215)', margin: 3, textTransform: 'capitalize' }} key={item} variant="contained" className={classes.button}>
          {item.name}
          <DeleteIcon className={classes.extendedIcon} />
        </Button>
      )
    })
  }
  findGraphObj = (id)=>{
    var graphs = this.props.avGraphs;
    for (var i = 0; i < graphs.length; i++) {
      if (graphs[i].id === id) {
        return graphs[i];
      }
    }
    return null;
  }
  
  handleSelection = (event) => {
    var id = Number(this.props.deCouple('id',event.target.value));
    this.props.addGraphFxn(this.findGraphObj(id));
  }
  ejectMenuItems = () => {
    const graphs = this.props.avGraphs;
    if (graphs.length !== 0) {
      return graphs.map(option => (
        <MenuItem key={option.id.toString()} id={option.id} value={option.id+"<==>"+option.name}>
          {option.name}
        </MenuItem>
      ))
    }
    else {
      return (
        <MenuItem >
          No Graphs available for this community yet.
        </MenuItem>
      )
    }
  }
  render() {
    const { classes } = this.props;
    const graphs = this.props.avGraphs;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ background: '#f0fff1' }}>
            <h4>What graphs would you like to appear on this community's homepage? </h4>
            {this.ejectSelectedGraphs(classes)}
            <TextField
              id="outlined-select-sections"
              select
              label="Choose A Graph"
              className={classes.textField}
              fullWidth
              onChange={(option) => { if (graphs.length !== 0) this.handleSelection(option) }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
              variant="outlined"
              helperText="Add the graphs that will be added to the homepage"
            >
              {this.ejectMenuItems()}
            </TextField>
          </Paper>
        </Grid>
      </div>
    )
  }

}

export default withStyles(styles)(GraphChoice);

