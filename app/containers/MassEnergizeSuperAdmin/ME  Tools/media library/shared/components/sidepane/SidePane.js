import React, { useEffect } from "react";
import ImageThumbnail from "../thumbnail/ImageThumbnail";
import { getRandomStringKey } from "../../utils/utils";
import MLButton from "../button/MLButton";

export default function SidePane({
  activeImage,
  setShowSidePane,
  sourceExtractor,
}) {
  const url =
    (sourceExtractor && sourceExtractor(activeImage)) ||
    (activeImage && activeImage.url) ||
    "...";

  useEffect(() => {}, [activeImage]);

  return (
    <div className="ml-sidepane-container elevate-float side-pane-slide-animation">
      <div style={{ position: "relative", height: "100%", padding: 15 }}>
        <h5 style={{ margin: 0, marginBottom: 10, fontSize: 18 }}>
          IMAGE DETAILS
        </h5>
        <ImageThumbnail
          style={{ width: "100%", height: 200, objectFit: "contain" }}
          imageSource={url}
          key={getRandomStringKey()}
        />

        <h6 style={{ margin: 0, fontSize: 18 }}>URL</h6>
        <textarea
          style={{
            padding: 10,
            width: "100%",
            border: "solid 0px cornflowerblue",
            borderBottomWidth: 2,
            borderRadius: 3,
            fontSize: "medium",
            marginTop: 5,
            background: "#fafeff",
            resize: "none",
            marginBottom: 0,
          }}
          rows="4"
          value={url}
        />
        <a
          href={url}
          target="_blank"
          className="touchable-opacity"
          style={{
            fontSize: 13,
            color: "cornflowerblue",
            padding: "10px 15px",
            background: "rgb(241 248 255)",
            textDecoration: "none",
            display: "block",
            width: "100%",
          }}
        >
          See Full Image Here
        </a>

        <MLButton
          onClick={() => setShowSidePane(false)}
          backColor="#245a93"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            padding: "15px 40px",
          }}
        >
          HIDE
        </MLButton>
        {/* <button
          className="ml-footer-btn"
          style={{
            "--btn-color": "white",
            "--btn-background": "#245a93",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
          }}
        >
          HIDE
        </button> */}
      </div>
    </div>
  );
}
