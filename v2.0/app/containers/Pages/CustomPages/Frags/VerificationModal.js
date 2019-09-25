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
import SimpleEventCard from './SimpleEventCard';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { verificationContainer, verficationPaper, closeButton, summaryH3 } from './../styles';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Fab from '@material-ui/core/Fab';
import Public from '@material-ui/icons/Public';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

class VerificationModal extends React.Component {

  ejectName = (classes) => {
    const name = this.props.name;
    if (name !== "") {
      return (
        <p>
          <b>Name</b>
          <ArrowForward style={{ color: 'green' }} />
          {name}
          <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
        </p>
      )
    }
    else {
      return this.unavailable("Name", classes);
    }
  }
  ejectDescription = (classes) => {
    const desc = this.props.description;
    if (desc !== "") {
      return (
        <p>
          <b>About Us </b>
          <ArrowForward style={{ color: 'green' }} /><br />
          <span>
            {desc}
          </span>
          <CheckCircle style={{ marginLeft: 2, color: 'green' }} /><br />
        </p>
      )
    }
    else {
      return this.unavailable("About Us", classes);
    }
  }
  ejectVideoURL = (classes) => {
    const URL = this.props.videoURL;
    if (URL !== "") {
      return (
        <p>
          <b>About Video Url </b>
          <ArrowForward style={{ color: 'green' }} />
          {URL}
          <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
        </p>
      )
    }
    else {
      return this.unavailable("About Us Video URL ", classes);
    }
  }
  ejectImages = (classes) => {
    const DEFAULT = "You have not selected any files.";
    const files = this.props.files;
    if (files.trim() !== DEFAULT) {
      return (
        <p>
          <b>Chosen Images </b>
          <ArrowForward style={{ color: 'green' }} />
          {files}
          <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
        </p>
      )
    }
    else {
      return this.unavailable("Chosen Images", classes);
    }
  }
  ejectEvents = (classes) => {
    const events = this.props.events;
    if (events.length > 0) {
      return events.map((item, index) => {
        return (
          <p key={item.id.toString()}>

            {index + 1 + ". " + item.name}
            <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
          </p>
        )
      })
    }
    else {
      return this.unavailable("Top 3 Events", classes);
    }
  }
  ejectGraphs = (classes) => {
    const graphs = this.props.graphs;
    if (graphs.length > 0) {
      return graphs.map((item, index) => {
        return (
          <p key={item.id.toString()}>

            {index + 1 + ". " + item.name}
            <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
          </p>
        )
      })
    }
    else {
      return this.unavailable("Chosen Graphs", classes);
    }
  }
  ejectQuickLinks = (classes) => {
    const ico = this.props.iconLinks;
    if (ico.length > 0) {
      return ico.map((item, index) => {
        return (
          <p key={item.name.toString()}>
            <small>
              <b>{item.title} </b>
              <CheckCircle style={{ marginLeft: 2, color: 'green' }} />
            </small><br />
            <small>{item.desc}</small>
          </p>
        )
      })
    }
    else {
      return this.unavailable("Quick Link Features ", classes);
    }
  }
  eventsHeaderIfNeeded = () => {
    if (this.props.events.length > 0) {
      return <p><b>Top 3 Events</b> <ArrowForward style={{ color: 'green' }} /></p>
    }
  }
  graphHeaderIfNeeded = () => {
    if (this.props.graphs.length > 0) {
      return <p><b>Chosen Graphs</b> <ArrowForward style={{ color: 'green' }} /></p>
    }
  }
  quickLinksHeaderIfNeeded = () => {
    if (this.props.iconLinks.length > 0) {
      return <p><b>Quick Link Features </b> <ArrowForward style={{ color: 'green' }} /></p>
    }
  }

  unavailable = (title, classes) => {
    return (
      <p>
        <b>{title}</b>
        <ArrowForward style={{ color: 'crimson' }} />
        <Button
          style={{ display: "inline-block", textTransform: 'capitalize', background: '#ffefef', color: 'darkred' }}
          variant="contained"
          component="span"
          id="raised-button-file"
          className={classes.button}
        >
          Not Specified
        </Button>
        <DeleteIcon style={{ marginLeft: 2, color: 'crimson' }} />
      </p>
    )
  }
  render() {
    const { classes } = this.props;
    const events = this.props.event;
    const community = this.props.community;
    return (
      <div style={verificationContainer}>
        <Grid item xl={12} md={12} style={{ margin: 30 }}>
          <Paper className={classes.root} elevation={4} style={verficationPaper}>
            <h3 style={summaryH3}>Features that will appear on <b>{community.id !== null ? community.name : '...'}</b> homepage </h3>
            <Fab
              onClick={() => { this.props.closeModal() }}
              size="small"
              style={closeButton}
              aria-label="add"
              className={classes.button}
            >
              <DeleteIcon />
            </Fab>
            <div style={{ height: 470, maxHeight: 470, minHeight: 470, overflowY: 'scroll' }}>
              {this.ejectName(classes)}
              {this.ejectDescription(classes)}
              {this.ejectVideoURL(classes)}
              {this.ejectImages(classes)}
              {this.eventsHeaderIfNeeded()}
              {this.ejectEvents(classes)}
              {this.graphHeaderIfNeeded()}
              {this.ejectGraphs(classes)}
              {this.quickLinksHeaderIfNeeded()}
              {this.ejectQuickLinks(classes)}
            </div>
            <Fab
              onClick={() => { this.props.publishContentFxn() }}
              variant="extended"
              style={{ background: 'green', color: 'white' }}
              aria-label="Delete"
              className={classes.button}
            >
              Publish Content <span style={{ margin: 3 }}></span>
              <Public />
            </Fab>
          </Paper>
        </Grid>
        <center>
          <KeyboardArrowUp
            onClick={() => { window.scrollTo(0, 20) }}
            style={{ cursor:'pointer',position: 'absolute', bottom: '200px', width: 100, height: 100 }}
          />
        </center>
      </div>
    )
  }
}
export default withStyles(styles)(VerificationModal);