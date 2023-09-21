import { Button, Link, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";

function MergeAndRemove({
  media,
  disposable,
  breakdown,
  close,
  mergeAndDelete,
  hash,
}) {
  const [loading, setLoading] = useState(false);
  const { usageSummary, usedBy } = breakdown || {};
  const merge = () => {
    setLoading(true);
    mergeAndDelete(hash, () => {
      setLoading(false);
      close && close();
    });
  };
  return (
    <div
      style={{
        minHeight: 500,
        maxHeight: 500,
        overflowY: "scroll",
        minWidth: 600,
        paddingBottom: 50,
      }}
    >
      <div style={{ padding: 20 }}>
        <img
          src={media?.url}
          style={{
            width: "100%",
            height: 150,
            objectFit: "contain",
            backgroundColor: "#e8e8e8",
          }}
        />
        <Typography
          style={{
            padding: "5px 10px",
            background: "#f9f9f9",
            fontWeight: "bold",
            margin: "15px 0px",
          }}
        >
          Other images that are the same ({disposable?.length})
        </Typography>
        {disposable?.map((dupe, index) => (
          <>
            <Link
              key={index?.toString()}
              href={dupe?.url}
              target="_blank"
              style={{ marginBottom: 10, display: "block" }}
            >
              <b>{dupe?.id}</b>: {dupe?.name}
            </Link>
          </>
        ))}
        <Typography
          style={{
            padding: "5px 10px",
            background: "#f9f9f9",
            fontWeight: "bold",
            margin: "15px 0px",
          }}
        >
          Where they are being used
        </Typography>

        <Typography>{usedBy ? usageSummary : "Not used anywhere"}</Typography>
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
          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              backgroundColor: "#ad4b4b",
              borderRadius: 0,
              padding: "10px 20px",
              fontSize: 14,
              margin: 0,
            }}
            onClick={() => close && close()}
          >
            Close
          </Button>
          <Tooltip title="When you merge & delete, only one image is going to be used in all use cases, all remaining will be deleted">
            <Button
              disabled={loading}
              variant="contained"
              color="secondary"
              className="touchable-opacity"
              style={{
                borderRadius: 0,
                padding: "10px 20px",
                fontSize: 14,
                margin: 0,
              }}
              onClick={() => merge()}
            >
              {loading && (
                <i
                  className=" fa fa-spinner fa-spin"
                  style={{ marginRight: 5 }}
                />
              )}
              <span style={{ fontWeight: "800" }}>Merge & Delete </span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default MergeAndRemove;
