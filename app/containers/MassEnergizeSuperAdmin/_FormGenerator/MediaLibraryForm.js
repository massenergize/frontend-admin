import {
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
// import MEDropDown from "./MEDropDown";
import MEDropdownPro from "../ME  Tools/dropdown/MEDropdownPro";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";

export default function MediaLibraryForm({ auth }) {
  const [copyright, setCopyright] = useState("No");
  const [underAge, setUnderAge] = useState("No");

  // --------------------------------------------------------------------
  const doesNotHaveCopyrightPermission = !copyright || copyright === "No";
  const hasUnderAgeContent = underAge === "Yes";
  const isSuperAdmin = !auth?.is_community_admin && auth?.is_super_admin;
  const isCommunityAdmin = auth?.is_community_admin && !auth?.is_super_admin;

  const getCommunitiesToSelectFrom = () => {
    if (isCommunityAdmin) return auth?.admin_at;
    return [];
  };

  return (
    <div style={{ padding: "25px 50px" }}>
      <Typography variant="h6">Hi {auth?.preferred_name || "..."},</Typography>
      <Typography variant="body2">
        Before you upload, there a few details you need to provide. Please not
        that the items marked (*) are compulsory.
      </Typography>
      <div style={{ padding: "20px 0px" }}>
        {/* <Typography variant="body2">Name of the uploader</Typography> */}
        <TextField
          style={{ width: "100%" }}
          label="You are marked as the uploader (autofilled) *"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ style: { padding: "12.5px 14px" } }}
          value={auth?.preferred_name || "..."}
          disabled
        />

        <div
          style={{
            margin: "10px 0px",
            border: "solid 2px antiquewhite",
            padding: 20,
            background: "#faebd74d",
            borderRadius: 6,
          }}
        >
          <Typography variant="h6">Copyright </Typography>
          <div style={{ marginTop: 10 }}>
            <Typography variant="body2">
              Do you have permission to use this item? As per the
              <Link to="#" style={{ marginLeft: 4 }}>
                <b>MassEnergize MOU</b>
              </Link>
              , you are required to have permission before uploading other
              people's content. If No, plese provide information about the owner
              of this item's copyright in the box that will be provided.
            </Typography>
            <RadioGroup
              value={copyright}
              name="copyright"
              style={{ display: "inline" }}
              onChange={(ev) => setCopyright(ev.target.value)}
            >
              <FormControlLabel
                value="Yes"
                name="copyright"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                name="copyright"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
            {doesNotHaveCopyrightPermission && (
              <TextField
                style={{ width: "100%", marginTop: 10 }}
                label="Who should this item be attributed to? *"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ style: { padding: "12.5px 14px" } }}
                // value="Frimpong Opoku"
              />
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Typography variant="h6">Underage Consent </Typography>
            <Typography variant="body2" style={{ marginTop: 10 }}>
              Do any of the items contain recognizable images or visible
              depictions of children <b>under the age of 13</b>? If yes, please
              provide consent information in the box shown below
            </Typography>
            <RadioGroup
              value={underAge}
              name="copyright"
              style={{ display: "inline", marginBottom: 6 }}
              onChange={(ev) => setUnderAge(ev.target.value)}
            >
              <FormControlLabel
                value="Yes"
                name="copyright"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                name="copyright"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
            {hasUnderAgeContent && (
              <TextField
                style={{ width: "100%", marginTop: 10 }}
                label="Add information of guardians"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ style: { padding: "12.5px 14px" } }}
                // value="Frimpong Opoku"
              />
            )}
          </div>
        </div>
        <div>
          <MEDropdown
            data={["Action", "Event", "Vendor"]}
            placeholder="What are you uploading this image for? (Event, Action, Vendor, Testimonial etc...)"
          />
          <Typography
            variant="body2"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            Tags: Add words that describe what this item is about. Separate each
            with a comma(,) (E.g. climate,solar,green etc)
          </Typography>
          <TextField
            style={{ width: "100%" }}
            label="Add tags to your item"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { padding: "12.5px 14px" } }}
            value="Frimpong Opoku"
            disabled
          />

          {/* <MEDropdown
              multiple
              data={["Action", "Event", "Vendor"]}
              placeholder="Add a few tags that describe this image"
            /> */}
          {/* <LightAutoComplete
             
              // data={["Action", "Event", "Vendor"]}
              placeholder="Whats the light auto complete shit meerhn, fuck oss"
            /> */}
          <MEDropdown
            multiple
            labelExtractor={(item) => item?.name}
            valueExtractor={(item) => item?.id}
            data={getCommunitiesToSelectFrom()}
            placeholder="Which communities would you like this item to be available to?"
          />
        </div>
      </div>
    </div>
  );
}
