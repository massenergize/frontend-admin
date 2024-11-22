import React from "react";
import "./assets/css/pb-index.css";
import PBSidePanel from "./components/sidepanels/PBSidePanel";
import PBBottomSheet from "./components/bottom-sheet/PBBottomSheet";
import PBModal from "./components/modal/PBModal";
function PBCanvas({ children, publishedProps, notification, setNotification }) {
  const { published_at, published_link } = publishedProps || {};
  const IS_ERROR = notification && notification.type === "error";

  return (
    <div className="pb-canvas">
      {published_at && (
        <div
          style={{
            marginBottom: 10,
            width: "100%",
            padding: "7px 20px",
            background: "rgb(159 221 235 / 17%)",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <div style={{ marginLeft: "auto", fontSize: 14 }}>
            {published_at && (
              <small style={{ fontWeight: "bold", color: "rgb(43 177 207)" }}>
                Last Published <i className="fa fa-long-arrow-right" style={{ marginRight: 5 }} /> {published_at}
              </small>
            )}
            {published_link && (
              <a
                target="_blank"
                href={published_link}
                style={{ color: "rgb(43 177 207)", marginLeft: 10, fontWeight: "bold" }}
              >
                Preview Published
              </a>
            )}
          </div>
        </div>
      )}
      {notification && (
        <p className={`pb-canvas-notification pb-${IS_ERROR ? "dangerous" : "success"}-note`}>
          {notification?.message}{" "}
          <i
            className="fa fa-times touchable-opacity"
            style={{ marginLeft: "auto" }}
            onClick={() => setNotification(null)}
          />
        </p>
      )}

      {children}
    </div>
  );
}

export default PBCanvas;
