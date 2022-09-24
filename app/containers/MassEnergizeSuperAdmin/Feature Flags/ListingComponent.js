import { Button, Typography } from "@material-ui/core";
import React from "react";

function ListingComponent({
  id,
  title = "Communities below have the Guest Authentication active",
}) {
  return (
    <div style={{ minWidth: 470, minHeight: 400, position: "relative" }}>
      <div>
        <Typography
          variant="h6"
          style={{
            padding: "10px 15px",
            border: "solid 0px #f6f6f6",
            borderBottomWidth: 2,
            fontSize: 15,
          }}
        >
          {title}
        </Typography>
      </div>
      <div style={{ overflowY: "scroll", maxHeight: 309, paddingBottom: 50 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <OneDisplayItem name={"Community - " + i} />
        ))}
      </div>

      <Button
        variant="raised"
        color="primary"
        style={{
          width: "100%",
          marginLeft: "auto",
          padding: 10,
          borderRadius: 0,
          position: "absolute",
          bottom: 0,
        }}
      >
        Close
      </Button>
    </div>
  );
}

export default ListingComponent;

const OneDisplayItem = ({ name }) => {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 5,
        alignItems: "center",
        width: "100%",
        border: "solid 0px #f6f6f6",
        borderBottomWidth: 1,
        padding: "10px 15px",
      }}
    >
      <Typography variant="body2" style={{}}>
        {name || "..."}
      </Typography>
      {/* <Button
        variant="raised"
        color="secondary"
        style={{
          marginLeft: "auto",
          borderRadius: 55,
          background: "#cb6565",
          marginRight: 10,
          marginBottom: 5,
          minWidth: 0,
          padding: "6px 13px",
        }}
      >
        <i className="fa fa-trash" />
      </Button> */}

      <small
        style={{ color: "#cb6565", fontWeight: "bold", marginLeft: "auto" }}
        className="touchable-opacity"
      >
        <i className="fa fa-trash" style={{ marginRight: "0px 12px" }} />{" "}
        <span>Remove</span>
      </small>
    </div>
  );
};
