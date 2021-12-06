import React, { useState } from "react";
import PropTypes from "prop-types";

import ImageThumbnail from "../thumbnail/ImageThumbnail";
import { blank } from "../../utils/values";

function Library({
  multiple,
  setSelectedContent,
  content,
  setShowSidePane,
  images,
  sourceExtractor,
}) {
  const handleSelection = (image) => {
    setShowSidePane(true);
    if (!multiple) return setSelectedContent(image);
    const images = content || [];
    const found = images.find((img) => img.id === image.id);
    let rest = images.filter((img) => img.id !== image.id);
    if (!found) rest = [...rest, image];
    setSelectedContent(rest);
  };

  const checkIfSelected = (image) => {
    if (!multiple) return image.id === content.id;
    const images = content || [];
    return images.find((img) => img.id === image.id);
  };

  const getImageSource = (image) => {
    if (sourceExtractor) return sourceExtractor(image);
    return image.url;
  };

  if (!images || images.length == 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
          marginTop: "10%",
        }}
      >
        <img src={blank} style={{ height: 180 }} />
        <p style={{ color: "grey" }}>No images available to choose from</p>
      </div>
    );
  }
  return (
    <div>
      <div className="m-content-area" style={{ padding: 15 }}>
        {images.map((image, index) => {
          const selected = checkIfSelected(image);
          return (
            <div key={index.toString()} style={{ position: "relative" }}>
              <ImageThumbnail
                imageSource={getImageSource(image)}
                onClick={() => handleSelection(image)}
              />
              {selected && (
                <p className="ml-thumb-checkmark elevate-float">&#10004;</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Library.propTypes = {};

export default Library;
