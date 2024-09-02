import React from "react";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

function ShareTestimonialModalComponent({ story, shared }) {
  const auth = useSelector((state) => state.getIn(["auth"]));
  const isSuperAdmin = auth?.is_super_admin;
  const community = (auth?.admin_at || [])[0]; // Community Portal

  const confirmation = () => {
    if (isSuperAdmin) return "Save Changes";
    if (shared) return "Yes, Unshare";
    return "Yes, Share";
  };
  return (
    <div style={{ padding: "0px 20px" }}>
      {isSuperAdmin ? (
        <SadminView auth={auth} isSuperAdmin={isSuperAdmin} story={story} />
      ) : (
        <CadminView shared={shared} community={community} auth={auth} isSuperAdmin={isSuperAdmin} story={story} />
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginLeft: "auto", marginBottom: 10 }}>
          <Button style={{ margin: 10 }} color="error">
            {isSuperAdmin ? "Cancel" : "No"}
          </Button>
          <Button variant="outlined" style={{ margin: 10 }} color="primary">
            {confirmation()}
          </Button>
        </div>
      </div>
    </div>
  );
}
const CadminView = ({ community, auth, isSuperAdmin, story, shared }) => {
  const { name } = community || {};
  const { title } = story || {};
  return (
    <p>
      Do you want to {shared ? "unshare" : "share"} <b>"{title || "..."}"</b> with <b>"{name || "..."}"</b>?
    </p>
  );
};

const SadminView = () => {
  return (
    <>
      <p>Select which of your communities to share this testimonial to</p>
      <LightAutoComplete data={[]} />
    </>
  );
};

export default ShareTestimonialModalComponent;
