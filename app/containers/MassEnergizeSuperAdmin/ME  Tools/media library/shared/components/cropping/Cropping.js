import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function Cropping({
  cropLoot,
  maxWidth,
  maxHeight,
  ratioHeight = 3,
  ratioWidth = 4,
}) {
  const crop = {
    aspect: ratioWidth / ratioHeight,
    unit: "%",
    x: 5,
    y: 5,
  };
  const [dimensions, setDimensions] = useState(crop);
  const [croppedSource, setCroppedSource] = useState(null);
  const imageRef = useRef(null);

  /**
   * Update reference to image when it is fully loaded
   * @param {*} image
   */
  const onImageLoaded = (image) => {
    imageRef.current = image;
    return false;
  };

  const onCropComplete = (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(
        imageRef.current,
        crop,
        "new-cropped-file.jpeg"
      );
      setCroppedSource(croppedImageUrl);
    }
  };

  if (!cropLoot || !cropLoot.source)
    return (
      <div style={{ width: "100%", textAlign: "center", padding: 40 }}>
        <p>Nothing selected to crop yet...</p>
      </div>
    );

  const { image } = cropLoot;
  return (
    <div>
      <center>
        <ReactCrop
          src={image}
          crop={dimensions}
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={(newCrop) => setDimensions(newCrop)}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
        />
      </center>
    </div>
  );
}

export default Cropping;

/**
 * Return a base64 version of an image file provided, based on a crop frame
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 * @returns {base64String} Image
 */
const getCroppedImg = (image, crop) => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  image.setAttribute("crossOrigin", "Anonymous");
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
  // As Base64 string
  const base64Image = canvas.toDataURL("image/jpeg");

  const file = base64StringtoFile(base64Image, "new_image");

  return { src: base64Image, file };
};
/**
 *
 * Convert a base64 String back to a file object
 * @param {base64String} base64String
 * @param {String} filename
 * @returns {File} image File Object
 *
 */
const base64StringtoFile = (base64String, filename) => {
  var arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
