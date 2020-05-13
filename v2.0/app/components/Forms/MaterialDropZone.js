import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FileIcon from '@material-ui/icons/Description';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Ionicon from 'react-ionicons';
import 'dan-styles/vendors/react-dropzone/react-dropzone.css';
import { isImage, getAspectRatioFloat } from './helpers/helpers.js';

const styles = theme => ({
  dropItem: {
    borderColor: theme.palette.divider,
    background: theme.palette.background.default,
    borderRadius: theme.rounded.medium,
    color: theme.palette.text.disabled,
    textAlign: 'center'
  },
  uploadIconSize: {
    width: 72,
    height: 72,
    display: 'inline-block',
    '& svg': {
      fill: theme.palette.secondary.main,
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    '& svg': {
      fill: theme.palette.common.white
    }
  },
  button: {
    marginTop: 20
  }
});

class MaterialDropZone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openSnackBar: false,
      errorMessage: '',
      isCropping: false,
      files: this.props.files, // eslint-disable-line
      acceptedFiles: this.props.acceptedFiles, // eslint-disable-line
    };
    this.onDrop = this.onDrop.bind(this);
    this.onCropCancelled = this.onCropCancelled.bind(this);
    this.addToState = props.addToState;
  }

  // TODO: address the warnings about list items w/ key prop and <ul> as descendant of <p>
  // TODO: figure out why bullet points are not displaying on my image upload instructions list
  // TODO: go accross repo and determine the actual aspect ratios that we want from different forms

  onDrop(filesVal) {
    const { files } = this.state;
    const { filesLimit, name, aspectRatio } = this.props;

    let oldFiles = files;
    const filesLimitVal = filesLimit || '3';
    oldFiles = oldFiles.concat(filesVal);

    if (oldFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: 'Cannot upload more than ' + filesLimitVal + ' items.',
      });
    } else if (aspectRatio) {
      /* TODO:
       - implement a helper function (in helpers.js) to turn the filesVal object into a URL or base64 string (figure out readAsDataURL error).
       - call said function here and store resulting URL/string in the state (add it to setState call below).
       - implement a new function onCropCompleted(img):
            - turns the cropper's result back into a file object (make another helper function?)
            - then adds the file to the state, sets isCropping = false, and calls addToState like below (why?)
       - implement the cropping component in render (the div is a placeholder).
            - pass component the image URL/string and onCropCancelled / onCropCompleted(img) as callbacks
      */
      this.setState({ isCropping: true });
    } else {
      this.setState({ files: oldFiles });
      this.addToState(name || 'image', oldFiles); // understand why this is necessary
    }
  }

  onCropCancelled() {
    this.setState({
      isCropping: false,
      openSnackBar: true,
      errorMessage: 'Your image must match the required aspect ratio. Please try again.'
    });
  }

  onDropRejected() {
    this.setState({
      openSnackBar: true,
      errorMessage: 'File too big, max size is 3MB',
    });
  }


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  handleRequestCloseSnackBar = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  handleRemove(file, fileIndex) {
    const thisFiles = this.state.files; // eslint-disable-line
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    thisFiles.splice(fileIndex, 1);
    this.setState({ files: thisFiles });
  }

  render() {
    const {
      classes,
      showPreviews,
      maxSize,
      aspectRatio,
      text,
      showButton,
      filesLimit,
      addToState,
      ...rest
    } = this.props;

    const {
      acceptedFiles,
      files,
      isCropping,
      openSnackBar,
      errorMessage
    } = this.state;

    // TODO: remove when done
    console.log('Aspect ratio: ' + aspectRatio + ' (' + getAspectRatioFloat(aspectRatio) + ')');
    console.log('In cropping state?: ' + isCropping);

    const deleteBtn = (file, index) => (
      <div className="middle">
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
            <div className="imageContainer col fileIconImg">
              <figure className="imgWrap"><img className="smallPreviewImg" src={path} alt="preview" /></figure>
              {deleteBtn(file, index)}
            </div>
          </div>
        );
      }
      return (
        <div key={index.toString()}>
          <div className="imageContainer col fileIconImg">
            <FileIcon className="smallPreviewImg" alt="preview" />
            {deleteBtn(file, index)}
          </div>
        </div>
      );
    });

    let dropzoneRef;
    return (
      <div>

        {isCropping && <div />}

        <Dropzone
          accept={acceptedFiles.join(',')}
          onDrop={this.onDrop}
          onDropRejected={this.onDropRejected}
          className={classNames(classes.dropItem, 'dropZone')}
          acceptClassName="stripes"
          rejectClassName="rejectStripes"
          maxSize={maxSize || 3000000}
          ref={(node) => { dropzoneRef = node; }}
          {...rest}
        >
          <div className="dropzoneTextStyle">
            <p className="dropzoneParagraph">{text}</p>
            <div className={classes.uploadIconSize}>
              <Ionicon icon="ios-cloud-upload-outline" fontSize="72px" />
            </div>
          </div>
        </Dropzone>
        {showButton && (
          <Button
            className={classes.button}
            fullWidth
            variant="contained"
            onClick={() => {
              dropzoneRef.open();
            }}
            color="secondary"
          >
            Click to upload file(s)
            <span className={classes.rightIcon}>
              <Ionicon icon="ios-cloud-upload-outline" fontSize="35px" />
            </span>
          </Button>
        )}
        <div className="row preview">
          {showPreviews && previews(files)}
        </div>
        <Snackbar
          open={openSnackBar}
          message={errorMessage}
          autoHideDuration={4000}
          onClose={this.handleRequestCloseSnackBar}
        />
      </div>
    );
  }
}

MaterialDropZone.propTypes = {
  files: PropTypes.array.isRequired,
  text: PropTypes.string.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  aspectRatio: PropTypes.string.isRequired,
  filesLimit: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

MaterialDropZone.defaultProps = {
  acceptedFiles: [],
  showButton: false,
};

export default withStyles(styles)(MaterialDropZone);
