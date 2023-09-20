import { Button, Link, Tooltip, Typography } from "@mui/material";
import React from "react";

function MergeAndRemove() {
  return (
    <div style={{ minHeight: 500, minWidth: 600 }}>
      <div style={{ padding: 20 }}>
        <img
          src="https://placehold.co/400"
          style={{ width: "100%", height: 150, objectFit: "contain" }}
        />
        <Typography
          style={{
            padding: "5px 10px",
            background: "#f9f9f9",
            fontWeight: "bold",
            margin: "10px 0px",
          }}
        >
          Other images that are the same (6)
        </Typography>
        {[2, 3, 4, 5, 4].map((item, index) => (
          <>
            <Link key={index?.toString()} to="#" style={{ marginBottom: 10 }}>
              First image here
              asdjfkas;djflaksdjf;laksjdf;laksjdf;alksdjf;alksdjf;laksjdf;
            </Link>
            <br />
          </>
        ))}
        <Typography
          style={{
            padding: "5px 10px",
            background: "#f9f9f9",
            fontWeight: "bold",
            margin: "10px 0px",
          }}
        >
          Where they are being used
        </Typography>

        <Typography>
          actions(45), events(3), teams(12), homepages(11)
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fcfcfc",
        }}
      >
        <div style={{ marginLeft: "auto" }}>
          <Tooltip title="When you merge & delete, only one image is going to be used in all use cases, all remaining will be deleted">
            <Button
              variant="contained"
              color="secondary"
              className="touchable-opacity"
              style={{
                borderRadius: 0,
                padding: "10px 20px",
                fontSize: 14,
                margin: 0,
              }}
            >
              Merge & Delete
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default MergeAndRemove;
