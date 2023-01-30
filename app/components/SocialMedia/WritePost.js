import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { withStyles } from "@mui/styles";
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Send from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import MenuItem from '@mui/material/MenuItem';
import ActionDelete from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import dummy from 'dan-api/dummy/dummyContents';
import isImage from '../Forms/helpers/helpers.js';
import styles from './jss/writePost-jss';

class WritePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privacy: 'public',
      files: [],
      message: ''
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(filesVal) {
    const { files } = this.state;
    let oldFiles = files;
    const filesLimit = 2;
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      console.log('Cannot upload more than ' + filesLimit + ' items.');
    } else {
      this.setState({ files: filesVal });
    }
  }

  handleChange = event => {
    this.setState({ privacy: event.target.value });
  };

  handleWrite = event => {
    this.setState({ message: event.target.value });
  };

  handlePost = (message, files, privacy) => {
    // Submit Post to reducer
    const { submitPost } = this.props;
    submitPost(message, files, privacy);
    // Reset all fields
    this.setState({
      privacy: 'public',
      files: [],
      message: ''
    });
  }

  handleRemove(file, fileIndex) {
    const { files } = this.state;
    const thisFiles = files;
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    thisFiles.splice(fileIndex, 1);
    this.setState({ files: thisFiles });
  }

  render() {
    const { classes } = this.props;
    let dropzoneRef;
    const { privacy, files, message } = this.state;
    const acceptedFiles = ['image/jpeg', 'image/png', 'image/bmp'];
    const fileSizeLimit = 3000000;
    const deleteBtn = (file, index) => (
      <div className={classNames(classes.removeBtn, 'middle')}>
        <IconButton onClick={() => this.handleRemove(file, index)}>
          <ActionDelete className="removeBtn" />
        </IconButton>
      </div>
    );
    const previews = filesArray => filesArray.map((file, index) => {
      const path = file.preview || '/pic' + file.path;
      if (isImage(file)) {
        return (
          <div key={index.toString()}>
            <figure><img src={path} alt="preview" /></figure>
            {deleteBtn(file, index)}
          </div>
        );
      }
      return false;
    });
    return (
      <div className={classes.statusWrap}>
        <Paper className={classes.inputMessage}>
          <Avatar alt="avatar" src={dummy.user.avatar} className={classes.avatarMini} />
          <textarea
            row="2"
            placeholder="What's on your mind?"
            value={message}
            onChange={this.handleWrite}
          />
          <Dropzone
            className={classes.hiddenDropzone}
            accept={acceptedFiles.join(',')}
            acceptClassName="stripes"
            onDrop={this.onDrop}
            maxSize={fileSizeLimit}
            ref={(node) => { dropzoneRef = node; }}
          />
          <div className={classes.preview}>
            {previews(files)}
          </div>
          <div className={classes.control}>
            <Tooltip id="tooltip-upload" title="Upload Photo">
              <IconButton
                className={classes.button}
                component="button"
                onClick={() => {
                  dropzoneRef.open();
                }}
              >
                <PhotoCamera />
              </IconButton>
            </Tooltip>
            <div className={classes.privacy}>
              <FormControl className={classes.formControl}>
                <Select
                  value={privacy}
                  onChange={this.handleChange}
                  name="privacy"
                  className={classes.selectEmpty}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="friends">Friends</MenuItem>
                  <MenuItem value="private">Only Me</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Tooltip id="tooltip-post" title="Post">
              <Fab onClick={() => this.handlePost(message, files, privacy)} size="small" color="secondary" aria-label="send" className={classes.sendBtn}>
                <Send />
              </Fab>
            </Tooltip>
          </div>
        </Paper>
      </div>
    );
  }
}

WritePost.propTypes = {
  classes: PropTypes.object.isRequired,
  submitPost: PropTypes.func.isRequired
};

export default withStyles(styles)(WritePost);
