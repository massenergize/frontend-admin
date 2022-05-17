import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import ImageThumbnail from "../thumbnail/ImageThumbnail";
import { blank } from "../../utils/values";
import { LoadMoreContainer } from "../../../../../Gallery/Gallery";
import {  ProgressCircleWithLabel } from "../../../../../Gallery/utils";

function Library({
  multiple,
  setSelectedContent,
  content,
  setShowSidePane,
  images,
  sourceExtractor,
  loadMoreFunction,
  loadingMore,
  limited,
  shouldWait,
  setShouldWait,
  awaitSeconds,
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
    if (!found) rest = [...rest, image];
    setShowSidePane(rest && rest.length > 0);
    setSelectedContent(rest);
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
      {!limited && (
        <div className="" style={{ width: "100%", textAlign: "center" }}>
          <LoadMoreContainer
            loading={loadingMore}
            style={{ width: "80%" }}
            loadMoreFunction={loadMoreFunction}
          />
        </div>
      )}
    </div>
  );
}

Library.propTypes = {};

export default Library;
