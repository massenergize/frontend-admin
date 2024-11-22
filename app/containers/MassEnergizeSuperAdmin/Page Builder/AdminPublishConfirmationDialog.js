import { Button } from "@mui/material";
import React from "react";
import { useApiRequest } from "../../../utils/hooks/useApiRequest";
import { APP_LINKS } from "../../../utils/constants";

function AdminPublishConfirmationDialog({ data, closeModal }) {
  const [publishHandler] = useApiRequest([{ key: "publishPage", url: "/custom.page.publish" }]);
  const [publishPage, _, error, loading, setError, setValue, setData] = publishHandler || [];

  const { page } = data || {};
  const startPublishing = () => {
    publishPage({ id: page?.id }, (response) => {
      if (response?.success) {
        window.location.href = `${APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}?pageId=${page?.id}`;
      }
      setError(response?.error || "An error occurred while publishing the page");
    });
    closeModal();
  };


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        padding: 15
      }}
    >
      <h2>Publish Confirmation</h2>
      <p style={{ margin: "10px 0px" }}>
        You are about to publish <b>"{page?.title || "..."}"</b>, are you sure?{" "}
      </p>
      <div
        style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}
      >
        {/* <div style={{}}> */}
        <Button
          disabled={loading}
          onClick={() => closeModal()}
          color="error"
          variant="outlined"
          style={{ marginRight: 10 }}
        >
          No
        </Button>
        <Button disabled={loading} onClick={() => startPublishing()} color="success" variant="contained">
          {loading ? <i className=" fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "Yes"}
        </Button>
        {/* </div> */}
      </div>

      {error && <small style={{ color: "#c85858", fontWeight: "bold", marginTop: 11 }}>{error}</small>}
    </div>
  );
}

export default AdminPublishConfirmationDialog;
