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
import CropModal from '../CropModal/CropModal';
import isImage from './helpers/helpers.js';

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
      currentImage: null,
      files: this.props.files, // eslint-disable-line
      acceptedFiles: this.props.acceptedFiles, // eslint-disable-line
    };
    this.onDrop = this.onDrop.bind(this);
    this.onCropCompleted = this.onCropCompleted.bind(this);
    this.onCropCancelled = this.onCropCancelled.bind(this);
    this.addToState = props.addToState;
  }

  /* TODOs
    - go accross repo and determine the actual aspect ratios + extraInstructions that we want from different forms
       - welcome images -> extra instructions say to center the important stuff
    - remove console logs, code cleanup (including eslint warnings that were already here)
    - for the Modal, make sure that every way to exit it has the appropriate callback
    - test that the looping works in onDrop to sequentially crop images and ignore non-image files
    - figure out the "Can't perform a React state update on an unmounted component." warning
    - address the warnings about list items w/ key prop
  */


  onDrop(filesVal) {
    const { files } = this.state;
    const { filesLimit, name } = this.props;

    let oldFiles = files;
    const filesLimitVal = filesLimit || '3';
    oldFiles = oldFiles.concat(filesVal);

    if (oldFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: 'Cannot upload more than ' + filesLimitVal + ' items.',
      });
    } else {
      for (let i = 0; i < filesVal.length; i++) {
        if (isImage(filesVal[i])) {
          console.log(filesVal[i]);
          this.setState({
            currentImage: filesVal[i],
            isCropping: true,
          });
        } else {
          this.setState({ files: oldFiles });
          this.addToState(name || 'image', oldFiles);
        }
      }
    }
  }

  onCropCompleted(croppedImageFile) {
    const { files } = this.state;
    const { name } = this.props;
    let oldFiles = files;

    oldFiles = oldFiles.concat([croppedImageFile]);

    this.setState({
      files: oldFiles,
      isCropping: false,
      currentImage: null
    });
    this.addToState(name || 'image', oldFiles);
  }

  onCropCancelled() {
    this.setState({
      isCropping: false,
      currentImage: null,
      openSnackBar: true,
      errorMessage: 'You must click "Done" on the cropper to upload your image. Please try again.'
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
      imageAspectRatio,
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
      currentImage,
      openSnackBar,
      errorMessage
    } = this.state;

    console.log('Aspect ratio: ' + imageAspectRatio);
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

        {isCropping && (
          <CropModal
            imageFile={currentImage}
            aspectRatio={imageAspectRatio}
            onCropCompleted={this.onCropCompleted}
            onCropCancelled={this.onCropCancelled}
          />
        )}

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
  name: PropTypes.string.isRequired,
  addToState: PropTypes.func.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  imageAspectRatio: PropTypes.string,
  filesLimit: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

MaterialDropZone.defaultProps = {
  acceptedFiles: [],
  imageAspectRatio: null,
  showButton: false,
};

export default withStyles(styles)(MaterialDropZone);
