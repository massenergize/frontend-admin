import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles, vanish, uploadBox } from './../../Pages/CustomPages/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Type from 'dan-styles/Typography.scss';
import DeleteIcon from '@material-ui/icons/Close';
import { allCommunities } from './../../Pages/CustomPages/DataRetriever';
import Fab from '@material-ui/core/Fab';
import Public from '@material-ui/icons/Public';

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      selected_community: null,
      files:[]
    }
  }

  findCommunityObj = (name) => {
    var section = this.state.communities;
    for (var i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }
  handleCommunitiesChoice = (event) => {
    var obj = this.findCommunityObj(event.target.value);
    this.setState({
      selected_community: obj,
    });
  }
  componentDidMount = () => {
    this.callForCommunities();
  }
  callForCommunities = () => {
    const me = this;
    allCommunities().then(response => {
      me.setState({ communities: response.data })
    });
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
  handleFields = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    const { classes } = this.props;
    const { communities } = this.state;
    const community = this.state.selected_community ? this.state.selected_community.name : '';


    return (
      <div>
        <div style={{ margin: 30 }}></div>
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4} style={{ padding: 30 }}>
            <h3>All Actions</h3>
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
                <MenuItem key={option.id.toString()} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>


            <TextField
              name="title"
              onChange={(event) => { this.handleFields(event) }}
              id="outlined-multiline-flexible"
              label="Title "
              fullWidth
              cols="20"
              rowsMax="19"
              rows="10"
              placeholder="Add a title"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              helperText="Add a title "
            />
            <TextField
              name="email"
              onChange={(event) => { this.handleFields(event) }}
              id="outlined-multiline-flexible"
              label="Video URL "
              fullWidth
              cols="20"
              rowsMax="19"
              rows="10"
              placeholder="Add video URL"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              helperText="Contact Email"
            />
           
           <div style={uploadBox}>
              <Typography className={Type.textGrey} gutterBottom>
                Upload  images
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
            <TextField
              name="description"
              id="outlined-multiline-flexible"
              label="Description"
              fullWidth
              multiline
              onChange={(event) => this.handleFields(event)}
              cols="20"
              rowsMax="19"
              rows="10"
              placeholder="Write a description "
              className={classes.textField}
              margin="normal"
              helperText={`This will be shown somewhere on ${this.state.selected_community ? this.state.selected_community.name : '...'} about page`}
              variant="outlined"
            />
            <Fab
              onClick={() => { console.log( "I am the data",this.state) }}
              variant="extended"
              color="secondary"
              aria-label="Delete"
              className={classes.button}
            >
              Publish Content <span style={{ margin: 3 }}></span>

            </Fab>
          </Paper>
        </Grid>
      </div>
    )

  }
}
export default withStyles(styles)(AllActions)