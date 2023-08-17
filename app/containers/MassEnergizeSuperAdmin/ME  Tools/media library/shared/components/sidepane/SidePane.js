import React, { useEffect, useState } from "react";
import ImageThumbnail from "../thumbnail/ImageThumbnail";
import { getRandomStringKey } from "../../utils/utils";
import MLButton from "../button/MLButton";

export default function SidePane({
  activeImage,
  setShowSidePane,
  sourceExtractor,
  sideExtraComponent,
  updateSelectedImages,
  changeTabTo,
}) {
  const [copy, setCopying] = useState(false);
  const url =
    (sourceExtractor && sourceExtractor(activeImage)) ||
    (activeImage && activeImage.url) ||
    "...";

  // useEffect(() => {}, [activeImage]);

  return (
    <div className="ml-sidepane-container elevate-float side-pane-slide-animation">
      <div style={{ position: "relative", height: "100%", padding: 15 }}>
        <h5 style={{ margin: 0, marginBottom: 10, fontSize: 18 }}>
          Image Details
        </h5>
        <ImageThumbnail
          style={{
            width: "100%",
            height: 200,
            objectFit: "contain",
            marginBottom: 15,
            background: "#f5f5f5",
          }}
          imageSource={url}
          key={getRandomStringKey()}
        />
        <div
          style={{
            overflowY: "scroll",
            maxHeight: "36vh",
            paddingBottom: 30,
            boxSizing: "border-box",
            paddingRight: 9,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <a
                href={url}
                target="_blank"
                className="touchable-opacity"
                style={{
                  color: "var(--app-cyan)",
                  // marginTop: 3,
                  fontSize: "0.875rem",
                  // color: "cornflowerblue",
                  padding: 0,
                  // background: "rgb(241 248 255)",
                  textDecoration: "none",
                  display: "block",
                  // width: "100%",
                  fontWeight: "bold",
                  marginRight: 15,
                  textDecoration: "underline",
                }}
              >
                Full Image Here
              </a>
              {/* <h6
                className="touchable-opacity"
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--app-cyan)",
                  textDecoration: "underline",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setCopying(!copy);
                }}
              >
                Copy URL
              </h6> */}
            </div>
            {/* {copy && (
              <textarea
                style={{
                  padding: 10,
                  width: "100%",
                  border: "solid 0px cornflowerblue",
                  borderBottomWidth: 2,
                  borderRadius: 3,
                  fontSize: "small",
                  marginTop: 5,
                  background: "#fafeff",
                  resize: "none",
                  marginBottom: 0,
                }}
                rows="4"
                value={url}
              />
            )} */}
          </div>
          {sideExtraComponent &&
            sideExtraComponent({
              image: activeImage,
              toggleSidePane: setShowSidePane,
              updateSelectedImages,
              changeTabTo,
            })}
        </div>

        <MLButton
          onClick={() => setShowSidePane(false)}
          // backColor="#245a93"
          backColor="#363738"
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
