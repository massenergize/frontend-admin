import React from "react";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";

function ShareTestimonialModalComponent() {
  return (
    <div style={{ padding: "0px 20px" }}>
      {/* <CadminView /> */}
      <SadminView />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginLeft: "auto", marginBottom: 10 }}>
          <button style={{ margin: 10 }} className="btn btn-primary">
            Yes 
          </button>
          <button style={{ margin: 10 }} className="btn btn-danger">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
const CadminView = () => {
  return (
    <p>
      Are you sure you want to share this testimonial with <b>Wayland</b>?
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
