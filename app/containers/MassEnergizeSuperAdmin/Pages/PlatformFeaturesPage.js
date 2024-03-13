import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, FormControlLabel, Radio, Typography } from "@mui/material";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
import { DISABLED, ENABLED } from "./NudgeControlPage";

const OPTIONS = [
  { key: ENABLED, icon: "", name: "Enabled" },
  { key: DISABLED, icon: "", name: "Disabled" }
  // { key: PAUSED, icon: "f", name: "Pause Sending" }
  // { key: "custom", icon: "", name: "Custom (I want to stop some, pause some)" }
];
const FEATURES = [
  {
    options: OPTIONS,
    key: "guest-users",
    name: "Allow Guest Users",
    description:
      "Allow unknown users to fully use your community site without going through authentication (login & registration) process"
  },
  {
    options: OPTIONS,
    key: "home-page-carousel",
    name: "Homepage Image Carousel",
    description: "Replace the side-by-side image view on your homepage with an image carousel"
  },
  {
    options: OPTIONS,
    key: "user-generated-content",
    name: "User Generated Content",
    description: "Allow user generated content."
  }
];
function PlatformFeaturesPage() {
  const community = useCommunityFromURL();
  return (
    <MEPaperBlock>
      <Typography>
        Control all items related to nudges for <b>{community?.name || "..."}</b> on this page
      </Typography>

      {FEATURES.map(({ description, name, key: sectionKey, options }) => {
        return (
          <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="p">{description}</Typography>
            <div>
            
              {options.map(({ key, name, icon }) => {
                return (
                  <div>
                    <FormControlLabel
                      key={key}
                      control={
                        <Radio
                        // checked={isSelected(sectionKey, key)}
                        // onChange={() => selectOption(sectionKey, key, true)}
                        />
                      }
                      label={
                        <>
                          <i className={`fa ${icon}`} style={{ marginRight: 6, color: "#ab47bc" }} />
                          {name}
                        </>
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* {error && <p style={{ color: "#e64d4d", marginBottom: 5 }}>{error}</p>} */}

            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px 20px" }}
              // onClick={() => saveChanges(sectionKey, getValue(sectionKey))}
            >
              {false ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
            </Button>
          </div>
        );
      })}
    </MEPaperBlock>
  );
}

export default PlatformFeaturesPage;
