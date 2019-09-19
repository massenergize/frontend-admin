import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles, vanish, uploadBox } from './styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FileUpload from '@material-ui/icons/CloudUpload'
import Button from '@material-ui/core/Button';
import Type from 'dan-styles/Typography.scss';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Close';

class AdminEditHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available_sections: [
        { id: 1, name: "Terms Of Service" },
        { id: 2, name: "Privacey Policy" },
        { id: 3, name: "Donate Bar" },
        { id: 4, name: "Graph Section" },
        { id: 5, name: "Donate Page Header" },
        { id: 6, name: "Welcome Images" },
        { id: 7, name: "Icon Quick Links" },
        { id: 8, name: "About Us Video" },
        { id: 9, name: "Donate Page Button" },
        { id: 10, name: "Home Header" },
        { id: 11, name: "About Us Description" },
      ],
      selected_sections: [],
      communities: ['Ghana Cedis', 'Dollars', 'Rupees', 'Rands'],
      selected_community: 'Choose Community',
      files: []
    }
  }

  findSectionObj = (val) => {
    var section = this.state.available_sections;
    for (var i = 0; i < section.length; i++) {
      if (section[i].name === val) {
        return section[i];
      }
    }
    return null;
  }
  handleCommunitiesChoice = (event) => {
    this.setState({ selected_community: event.target.value });
  }

  handleSectionChoice = (event) => {
    const wholeTray = this.findSectionObj(event.target.value);
    const oldValues = this.state.selected_sections;
    this.setState({ selected_sections: oldValues.includes(wholeTray) ? [...oldValues] : [...oldValues, wholeTray] });
  }
  showFileList() {
    const { files } = this.state;
    if (files.length === 0) return "You have not selected any files. ";
    var string = "";
    for (var i = 0; i < files.length; i++) {
      if (string !== "") {
        string += ", " + files[i].name;
      }
      else {
        string = files[i].name;
      }
    }
    return string;
  }
  removeSection = (id)=>{
    var sel = this.state.selected_sections; 
    this.setState({ selected_sections: sel.filter( itm => itm.id !== id) })
  }
  ejectSelectedSections(classes) {
    return this.state.selected_sections.map((item) => {
      return (
        <Fab
          onClick ={()=>{ this.removeSection(item.id)}}
          key={item.id.toString()}
          style={{ background: '#af0f0f', color: "white",margin:5 }}
          variant="extended"
          color="danger"
          aria-label="Delete"
          className={classes.button}
        >
          {item.name}
          <DeleteIcon className={classes.extendedIcon} />
        </Fab>
      );
    });
  }
  stringifySelected(){
    var string = ""; 
    var items = this.state.selected_sections;
   for( var i = 0; i < items.length; i ++){
      if(string !== ""){
        string += ", "+ items[i].name;
      }
      else{
        string = items[i].name;
      }
    }
    return string;
  }
  render() {
    const communities = this.state.communities;
    const { classes } = this.props;
    const community = this.state.selected_community;
    const { available_sections } = this.state;
    const { selected_sections } = this.state;
    
    return (
      <div>
        <div style={{ margin: 30 }}></div>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4}>
            <TextField
              id="outlined-select-currency"
              select
              label="Select Community"
              className={classes.textField}
              value={community}
              fullWidth
              onChange={option => { this.handleCommunitiesChoice(option) }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select the community"
              margin="normal"
              variant="outlined"
            >
              {communities.map(option => (
                <MenuItem key={option.toString()} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              placeholder="Name"
              margin="normal"
              variant="outlined"
              helperText="This will be the name of the homepage..."
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Description"
              fullWidth
              multiline
              cols="20"
              rowsMax="19"
              rows="10"
              value={"Write a description for Wayland Homepage ..."}
              className={classes.textField}
              margin="normal"
              helperText="This will be shown somewhere on the wayland homepage"
              variant="outlined"
            />
            <div style={uploadBox}>
              <Typography className={Type.textGrey} gutterBottom>
                Upload exactly <b> ( 3 ) </b> images
              </Typography>
              <Typography className={Type.textGreyLight} gutterBottom>
                {this.showFileList()}
              </Typography>
              <input
                onChange={info => { this.setState({ files: info.target.files }) }}
                style={vanish}
                accept="image/*"
                className={classes.inputUpload}
                id="raised-button-file"
                multiple
                type="file"
              />
              { /* eslint-disable-next-line */}
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  id="raised-button-file"
                  className={classes.button}
                >
                  Upload
                </Button>
              </label>
            </div>
            <Typography style={{ marginTop: 10 }} variant="h5" className={Type.medium} gutterBottom>Add Sections Of The Homepage Here</Typography>
            {/* -------Selected Sections -------- */}
            {this.ejectSelectedSections(classes)}
            <TextField
              id="outlined-select-sections"
              select
              label="Choose Sections"
              className={classes.textField}
              fullWidth
              onChange={option => { this.handleSectionChoice(option) }}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText={"Add Sections To The Wayland Home Page And Fill Them Below "}
              margin="normal"
              variant="outlined"
            >
              {available_sections.map(option => (
                <MenuItem key={option.id.toString()} id={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

          </Paper>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AdminEditHome);