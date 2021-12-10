import React, { useState } from "react";
import PropTypes from "prop-types";
import broken from "./img_broken.png";
import loadingGif from "./loading-gif.gif";
import { getRandomItem, getRandomStringKey } from "../../utils/utils";
const animations = ["animate-img", "animate-img-slow", "animate-img-slowest"];

function ImageThumbnail({ onClick, imageSource, style = {} }) {
  const [showImage, setShowImage] = useState(false);
  const [src, setSrc] = useState(null);
  const noSelectionStyle = !onClick
    ? { boxShadow: "0 0 0", borderColor: "white" }
    : {};
  return (
    <div className="m-thumbnail">
      {/*  This is what actually loads the image, but is always invisible */}
      <img
        src={imageSource}
        style={{ width: 0, opacity: 0 }}
        onLoad={(e) => {
          setShowImage(true);
          setSrc(e.target.src);
        }}
        onError={() => {
          setShowImage(true);
          setSrc(broken);
        }}
      />
      {!showImage && (
        <img
          src={loadingGif}
          style={{
            objectFit: "contain",
            height: 60,
            width: 60,
            margin: 20,
          }}
          onError={(e) => (e.target.src = broken)}
        />
      )}
      {showImage && (
        <img
          onClick={() => onClick && onClick()}
          src={src}
          className={`m-thumb-image ${getRandomItem(animations)}`}
          style={{ ...style, ...noSelectionStyle }}
          onError={(e) => (e.target.src = broken)}
        />
      )}
    </div>
  );
}
ImageThumbnail.propTypes = {};
ImageThumbnail.defaultProps = {
  imageSource: "https://i.pravatar.cc/150",
};
export default ImageThumbnail;
