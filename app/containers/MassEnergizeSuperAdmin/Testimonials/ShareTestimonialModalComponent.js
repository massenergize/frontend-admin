import React, { useState } from "react";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { apiCall } from "../../../utils/messenger";

function ShareTestimonialModalComponent({ story, shared, close, afterResponse }) {
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.getIn(["auth"]));
  const isSuperAdmin = auth?.is_super_admin;
  const community = (auth?.admin_at || [])[0]; // Community Portal

  const onConfirm = () => {
    setLoading(true);
    const body = { testimonial_id: story.id, shared_with: [community.id], unshare: shared };
    apiCall("/testimonials.share", body)
      .then((response) => {
        setLoading(false);
        if (!response.success) return console.log("ERROR_SHARING_TESTIMONIAL", response?.error);
        afterResponse && afterResponse(response?.error, response?.data);
        close && close();
      })
      .catch((e) => {
        console.log("ERROR_SHARING_TEST_SYNT", e?.toString());
        afterResponse && afterResponse(e?.toString(), null);
        setLoading(false);
        close && close();
      });
  };
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
          <Button style={{ margin: 10 }} color="error" onClick={() => close()}>
            {isSuperAdmin ? "Cancel" : "No"}
          </Button>
          <Button
            onClick={() => onConfirm()}
            variant="outlined"
            style={{ margin: 10 }}
            color="primary"
            disabled={loading}
          >
            {loading && <i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />}
            {!loading && confirmation()}
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
      Do you want to {shared ? "unshare" : "share"} <b style={{ color: "black" }}>"{title || "..."}"</b> with{" "}
      <b style={{ color: "black" }}>"{name || "..."}"</b>?
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
