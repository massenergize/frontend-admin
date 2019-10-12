import React from 'react';
import { PropTypes } from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
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
import Public from '@material-ui/icons/Public';
import { styles, vanish, uploadBox } from './styles';
import {
 allCommunities, immediateEventQuest, immediateGraphQuest, formForJokes, iconTextDefaults 
} from './DataRetriever';
import VerificationModal from './Frags/VerificationModal';
class AdminEditHome extends React.Component {
  constructor(props) {
    super(props);
    this.trackSelectedFeatureEdit = this.trackSelectedFeatureEdit.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.addFeatures = this.addFeatures.bind(this);
    this.deCouple = this.deCouple.bind(this);
    this.closeSummary = this.closeSummary.bind(this);
    this.removeIconFeature = this.removeIconFeature.bind(this);
    this.publishContent = this.publishContent.bind(this);
    this.state = {
      about_video_url: '',
      name: '',
      description: '',
      selected_icon_features: [],
      selected_graphs: [],
      selected_events: [],
      communities: [],
      events: [],
      graphs: [],
      selected_community: { id: null, name: 'Choose Community' },
      files: [],
      summary_modal_is_open: false
    };
  }

  componentDidMount() {
    this.callForAllCommunities();
  }


  handleVideoUrl = (event) => {
    this.setState({ about_video_url: event.target.value.trim() });
  }

  handleName = (event) => {
    this.setState({ name: event.target.value.trim() });
  }

  handleDescription = (event) => {
    this.setState({ description: event.target.value.trim() });
  }

  graphSearch = (id) => {
    const me = this;
    immediateGraphQuest(id)
      .then(res => {
        me.setState({ graphs: res.data });
      });
  }

  eventSearch = (id) => {
    const me = this;
    immediateEventQuest(id)
      .then(res => {
        me.setState({ events: res.data });
      });
  }

  callForAllCommunities = () => {
    const me = this;
    allCommunities().then(res => {
      me.setState({ communities: res.data });
    });
  }

  handleEventSelection = (item) => {
    let old = this.state.selected_events;
    if (old.length !== 3) {
      this.setState({ selected_events: old.includes(item) ? [...old] : [...old, item] });
    }
  }

  handleGraphSelection = (item) => {
    let old = this.state.selected_graphs;
    this.setState({ selected_graphs: old.includes(item) ? [...old] : [...old, item] });
  }

  addFeatures = (item) => {
    let old = this.state.selected_icon_features;
    this.setState({ selected_icon_features: old.includes(item) ? [...old] : [...old, item] });
  }

  handleCommunitiesChoice = (event) => {
    let obj = this.findCommunityObj(event.target.value);
    this.setState({
      selected_community: obj,
      selected_events: [],
      events: [],
      graphs: [],
      selected_graphs: []
    }); // also flash the event values just in case
    this.eventSearch(obj.id);
    this.graphSearch(obj.id);
  }

  deCouple = (what, mesh) => {
    const arr = mesh.trim().split("<==>");
    if (what === "value") {
      return arr[1];
    }
    if (what === "id") {
      return arr[0];
    }
  }

  findCommunityObj = (name) => {
    let section = this.state.communities;
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }

  showFileList() {
    const { files } = this.state;
    if (files.length === 0) return 'You have not selected any files. ';
    let string = '';
    for (let i = 0; i < files.length; i++) {
      if (string !== '') {
        string += ', ' + files[i].name;
      } else {
        string = files[i].name;
      }
    }
    return string;
  }

  removeIconFeature = (name) => {
    let f = this.state.selected_icon_features.filter(itm => itm.name !== name);
    this.setState({ selected_icon_features: f });
  }

  removeGraph = (id) => {
    let f = this.state.selected_graphs.filter(itm => itm.id !== id);
    this.setState({ selected_graphs: f });
  }

  removeEvent = (id) => {
    let f = this.state.selected_events.filter(itm => itm.id !== id);
    this.setState({ selected_events: f });
  }

  trackSelectedFeatureEdit = (obj) => {
    const selected = this.state.selected_icon_features;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].name === obj.name) {
        selected[i] = { ...obj };
      }
    }
    this.setState({ selected_icon_features: selected });
  }

  searchForIconDefaults = (name) => {
    switch (name) {
      case 'Events':
        return iconTextDefaults.events;
      case 'Actions':
        return iconTextDefaults.actions;
      case 'Service Providers':
        return iconTextDefaults.service;
      case 'Testimonials':
        return iconTextDefaults.testimonials;
      default:
        break;
    }
  }

  cleanUpIconEdits = () => {
    const edits = this.state.selected_icon_features;
    let icons = [];
    for (let i = 0; i < edits.length; i++) {
      let ico = edits[i];
      let item = { ...ico };
      let DEFAULT = this.searchForIconDefaults(ico.name);
      if (ico.title.trim() === '') {
        item.title = DEFAULT.title;
      }
      if (ico.desc.trim() === '') {
        item.desc = DEFAULT.desc;
      }
      item.name = ico.name;
      icons.push(item);
    }
    return icons;
  }

  popIDs = (arr) => {
    let idArray = [];
    for (let i = 0; i < arr.length; i++) {
      idArray.push(arr[i].id);
    }
    return idArray;
  }

  publishContent = () => {
    const data = {
      chosen_community: this.state.selected_community.id,
      name: this.state.name,
      description: this.state.description,
      selected_icons: this.cleanUpIconEdits(this.state.selected_icon_features),
      selected_graphs: this.popIDs(this.state.selected_graphs),
      selected_events: this.popIDs(this.state.selected_events),
      images: this.state.files,
      about_video_url: this.state.about_video_url
    };
    console.log('I am the form data', data);
    // formForJokes(data);
  }

  openSummary = () => {
    this.setState({ summary_modal_is_open: true });
  }

  closeSummary = () => {
    this.setState({ summary_modal_is_open: false });
  }

  showSummary = () => {
    if (this.state.summary_modal_is_open) {
      return (
        <VerificationModal
          name={this.state.name}
          videoURL={this.state.about_video_url}
          community={this.state.selected_community}
          graphs={this.state.selected_graphs}
          events={this.state.selected_events}
          iconLinks={this.cleanUpIconEdits()}
          description={this.state.description}
          files={this.showFileList()}
          closeModal={this.closeSummary}
          publishContentFxn={this.publishContent}
        />
      );
    }
  }

  render() {
    const {communities} = this.state;
    const { classes } = this.props;
    const community = this.state.selected_community.name;
    // const { available_sections } = this.state;
    // const { selected_sections } = this.state;
    return (
      <div>
        {this.showSummary()}
        <div style={{ margin: 30 }} />
        <Grid item xl={12} md={12}>
          <Paper className={classes.root} elevation={4}>
            <Fab
              onClick={() => { this.openSummary(); }}
              variant="extended"
              color="secondary"
              aria-label="Delete"
              className={classes.button}
            >
              Finish Up 
              {' '}
              <span style={{ margin: 3 }}></span>
              <Public />
            </Fab>
            <TextField
              id="outlined-select-currency"
              select
              label="Select Community"
              className={classes.textField}
              value={community}
              fullWidth
              onChange={option => { this.handleCommunitiesChoice(option); }}
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
              onChange={(event) => { this.handleName(event); }}
              fullWidth
              placeholder="Name"
              margin="normal"
              variant="outlined"
              helperText="This will be the name of the homepage..."
            />
            <TextField
              onChange={(event) => { this.handleDescription(event); }}
              id="outlined-multiline-flexible"
              label="Description"
              fullWidth
              multiline
              cols="20"
              rowsMax="19"
              rows="10"
              placeholder="Write a description for Wayland Homepage ..."
              className={classes.textField}
              margin="normal"
              helperText="This will be shown somewhere on ... homepage"
              variant="outlined"
            />
            <div style={uploadBox}>
              <Typography className={Type.textGrey} gutterBottom>
                Upload exactly 
            {' '}
            <b> ( 3 ) </b>
            {' '}
            images
            </Typography>
              <Typography className={Type.textGreyLight} gutterBottom>
                {this.showFileList()}
              </Typography>
              <input
                onChange={info => { this.setState({ files: info.target.files }); }}
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
            deCouple={this.deCouple}
            avEvents={this.state.events}
            addEventFxn={this.handleEventSelection}
            removeEventFxn={this.removeEvent}
            events={this.state.selected_events}
          />
          <GraphChoice
            deCouple={this.deCouple}
            avGraphs={this.state.graphs}
            addGraphFxn={this.handleGraphSelection}
            selectedGraphs={this.state.selected_graphs}
            removeGraphFxn={this.removeGraph}
          />
          <AboutUsVideo changeHandler={this.handleVideoUrl} />
          <IconQuickLinks
            trackChangeFxn={this.trackSelectedFeatureEdit}
            addFeaturesFxn={this.addFeatures}
            selectedFeatures={this.state.selected_icon_features}
            removeFeatureFxn={this.removeIconFeature}
          />
          <Fab
            onClick={() => { this.openSummary(); window.scrollTo(0, 20); }}
            variant="extended"
            color="secondary"
            aria-label="Delete"
            style={{ margin: 20, float: 'right' }}
            className={classes.button}
          >
            Finish Up 
{' '}
<span style={{ margin: 3 }}></span>
            <Public />
          </Fab>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AdminEditHome);
