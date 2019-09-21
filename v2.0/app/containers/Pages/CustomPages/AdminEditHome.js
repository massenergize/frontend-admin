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
import IconQuickLinks from './Frags/IconLinks';
import AboutUsVideo from './Frags/AboutUsVideo';
import AboutUsDescription from './Frags/AboutUsDescription';
import GraphChoice from './Frags/GraphChoice';
import EventChoices from './Frags/EventChoices';
import { allCommunities, immediateEventQuest } from './DataRetriever';
class AdminEditHome extends React.Component {
  constructor(props) {
    super(props);
    this.trackSelectedFeatureEdit = this.trackSelectedFeatureEdit.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.addFeatures = this.addFeatures.bind(this);
    this.removeIconFeature = this.removeIconFeature.bind(this);
    this.state = {
      selected_icon_features: [],
      selected_graphs: [],
      selected_events: [],
      communities: [],
      events: [],
      selected_community: { id: null, name: "Choose Community" },
      files: []
    }
  }

  componentDidMount() {
    this.callForAllCommunities();
  }

  eventSearch = (id) => {
    const me = this;
    if (id !== null) {
      immediateEventQuest(id)
        .then(res => {
          me.setState({ events: res.data })
        });
    }
  }
  callForAllCommunities = () => {
    const me = this;
    allCommunities().then(res => {
      me.setState({ communities: res.data });
    });
  }
  handleEventSelection = (item) => {
    var old = this.state.selected_events;
    if (old.length !== 3) {
      this.setState({ selected_events: old.includes(item) ? [...old] : [...old, item] });
    }
  }
  handleGraphSelection = (item) => {
    var old = this.state.selected_graphs;
    this.setState({ selected_graphs: old.includes(item) ? [...old] : [...old, item] });
  }
  addFeatures = (item) => {
    var old = this.state.selected_icon_features;
    this.setState({ selected_icon_features: old.includes(item) ? [...old] : [...old, item] });
  }

  handleCommunitiesChoice = (event) => {
    var obj = this.findCommunityObj(event.target.value);
    this.setState({ selected_community: obj, selected_events: [], events: [] }); //also flash the event values just in case
    this.eventSearch(obj.id);
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
  removeIconFeature = (name) => {
    var f = this.state.selected_icon_features.filter(itm => itm.name !== name);
    this.setState({ selected_icon_features: f });
  }
  removeGraph = (item) => {
    var f = this.state.selected_graphs.filter(itm => itm !== item);
    this.setState({ selected_graphs: f });
  }
  removeEvent = (id) => {
    var f = this.state.selected_events.filter(itm => itm.id !== id);
    this.setState({ selected_events: f });
  }

  trackSelectedFeatureEdit = (obj) => {
    const selected = this.state.selected_icon_features;
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].name === obj.name) {
        selected[i] = { ...obj };
      }
    }
    this.setState({ selected_icon_features: selected });
  }


  render() {
    const communities = this.state.communities;
    const { classes } = this.props;
    const community = this.state.selected_community.name;
    //const { available_sections } = this.state;
    //const { selected_sections } = this.state;

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
                <MenuItem key={option.id.toString()} value={option.name}>
                  {option.name}
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
          </Paper>
          {/*  --------------------- DYNAMIC SECTION AREA ------------- */}
          <EventChoices
            avEvents={this.state.events}
            addEventFxn={this.handleEventSelection}
            removeEventFxn={this.removeEvent}
            events={this.state.selected_events}
          />
          <GraphChoice
            addGraphFxn={this.handleGraphSelection}
            selectedGraphs={this.state.selected_graphs}
            removeGraphFxn={this.removeGraph}
          />
          <AboutUsVideo />
          <IconQuickLinks
            trackChangeFxn={this.trackSelectedFeatureEdit}
            addFeaturesFxn={this.addFeatures}
            selectedFeatures={this.state.selected_icon_features}
            removeFeatureFxn={this.removeIconFeature}
          />
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AdminEditHome);