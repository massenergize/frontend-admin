import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class CropModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      name: this.props.name, // eslint-disable-line
      imageSrcURL: this.props.imageSrcURL, // eslint-disable-line
      crop: { aspect: this.props.aspect }, // eslint-disable-line
    };

    this.doCrop = this.doCrop.bind(this);
    this.cancelCrop = this.cancelCrop.bind(this);
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  }

  async doCrop() {
    const { onCropCompleted } = this.props;
    const { crop, name } = this.state;

    console.log(crop);

    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, name);
      onCropCompleted(croppedImageUrl);
    }

    this.setState({ isOpen: false });
  }

  cancelCrop() {
    const { onCropCancelled } = this.props;
    onCropCancelled();
    this.setState({ isOpen: false });
  }

  render() {
    const { crop, imageSrcURL, isOpen } = this.state;

    return (
      <Modal
        open={isOpen}
      >
        <div>
          <ReactCrop
            src={imageSrcURL}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onChange={this.onCropChange}
          />
          <Button onClick={this.cancelCrop}>Cancel</Button>
          <Button onClick={this.doCrop}>Done</Button>
        </div>
      </Modal>
    );
  }
}

CropModal.propTypes = {
  imageSrcURL: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  aspect: PropTypes.number.isRequired,
  onCropCompleted: PropTypes.func.isRequired,
  onCropCancelled: PropTypes.func.isRequired,
};

export default CropModal;
