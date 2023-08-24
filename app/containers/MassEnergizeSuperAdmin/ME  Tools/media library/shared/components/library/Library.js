import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import ImageThumbnail from "../thumbnail/ImageThumbnail";
import { blank, DEFAULT_FILE_LIMIT } from "../../utils/values";
import { ProgressCircleWithLabel } from "../../../../../Gallery_depracated/utils";

function Library({
  multiple,
  setSelectedContent,
  content,
  setShowSidePane,
  images,
  sourceExtractor,
  // loadMoreFunction,
  loadingMore,
  limited,
  shouldWait,
  setShouldWait,
  awaitSeconds,
  fileLimit,
  renderBeforeImages,
}) {
  const handleSelection = (image) => {
    if (!multiple) {
      setSelectedContent([image]);
      setShowSidePane(true);
      return;
    }
    const images = content || [];
    const found = images.find((img) => img.id === image.id);
    let rest = images.filter((img) => img.id !== image.id);
    if (!found) rest = [image, ...rest];
    setShowSidePane(rest && rest.length > 0);
    const limit = fileLimit || DEFAULT_FILE_LIMIT;
    setSelectedContent(rest.slice(0, limit));
  };

  const checkIfSelected = (image) => {
    // if (!multiple) return image.id === content.id;
    const images = content || [];
    return images.find((img) => img.id === image.id);
  };

  const getImageSource = (image) => {
    if (sourceExtractor) return sourceExtractor(image);
    return image && image.url;
  };

  if (shouldWait) {
    setTimeout(() => {
      setShouldWait(false);
    }, awaitSeconds || 500);
    return <ProgressCircleWithLabel loading="loading images..." />;
  }

  if (!images || images.length == 0) {
    return (
      <div style={{ overflowY: "scroll" }}>
        {renderBeforeImages()}
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
      </div>
    );
  }
  return (
    <div>
      {renderBeforeImages()}
      {fileLimit && (
        <div style={{ padding: "10px 25px", fontWeight: "bold" }}>
          <small>
            You can select up to ({fileLimit}){" "}
            {fileLimit === 1 ? "image" : "images"}
          </small>
        </div>
      )}
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
                <p
                  onClick={() => handleSelection(image)}
                  className="ml-thumb-checkmark elevate-float touchable-opacity"
                >
                  &#10004;
                </p>
              )}
            </div>
          );
        })}
      </div>
      {/* {!limited && (
        <div className="" style={{ width: "100%", textAlign: "center" }}>
          <LoadMoreContainer
            loading={loadingMore}
            style={{ width: "80%" }}
            loadMoreFunction={loadMoreFunction}
          />
        </div>
      )} */}
    </div>
  );
}

Library.propTypes = {};

export default Library;
