import {
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
export const FilterBarForMediaLibrary = ({ auth, communities }) => {
  const [currentFilter, setCurrentFilter] = useState("keywords");
  const [keywords, setKeywords] = useState("");

  const getCommunitiesToSelectFrom = () => {
    if (isCommunityAdmin) return auth?.admin_at;
    return communities || [];
  };

  const FILTER_OPTIONS = [
    {
      name: "My Uploads",
      key: "my-uploads",
      context: "Only images you have uploaded will show up",
    },
    {
      name: "Use Keywords",
      key: "keywords",
      context: "Keywords that describe the image",
      component: (
        <WithKeywords
          keywords={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      ),
    },
    {
      name: "From Other Admins",
      key: "from-others",
      context: "See what other admins have uploaded",
      component: (
        <div>
          <MEDropdown
            multiple
            data={["actions", "events", "something"]}
            placeholder="Select admins and 'Apply'"
          />
        </div>
      ),
    },
    {
      name: "By Community",
      key: "by-community",
      context: "Show only community specific items",
      component: (
        <div>
          <MEDropdown
            multiple
            labelExtractor={(item) => item?.name}
            valueExtractor={(item) => item?.id}
            data={communities}
            placeholder="Select communities and 'Apply'"
          />
        </div>
      ),
    },
  ];

  const getComponent = () => {
    return FILTER_OPTIONS.find((f) => f.key === currentFilter)?.component;
  };

  return (
    <div style={{ padding: "0px 27px" }}>
      <div
        className="me-ml-filter-root"
        // style={{
        //   padding: "15px 20px",
        //   background: "navajowhite",
        //   border: "solid 2px antiquewhite",
        // }}
      >
        <div style={{ padding: "10px 20px" }}>
          <Typography variant="body2">
            Use the options below to filter images
          </Typography>

          <RadioGroup
            defaultValue={"keywords"}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => setCurrentFilter(ev?.target.value)}
          >
            {FILTER_OPTIONS.map((option) => (
              <FormControlLabel
                name={option.key}
                key={option.key}
                value={option.key}
                control={<Radio />}
                label={
                  <Typography
                    variant="body2"
                    style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                  >
                    <Tooltip title={option.context} placement="top">
                      {option.name}
                    </Tooltip>
                  </Typography>
                }
              />
            ))}
          </RadioGroup>

          <div>{getComponent()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            style={{
              marginLeft: "auto",
              borderRadius: 0,
              borderBottomRightRadius: 3,
              borderTopLeftRadius: 6,
              fontWeight: "bold",
            }}
            variant="contained"
          >
            APPLY
          </Button>
        </div>
      </div>
      <Typography variant="body2" color="#b2b2b2">
        Items below are sorted by date. The most recent items show up first,
        from left, to right on each row!
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterBarForMediaLibrary);

const WithKeywords = ({ keywords, onChange }) => {
  const renderChips = (data) => {
    const items = data?.split(",").filter(Boolean);
    const empty = !items?.length;
    if (empty) return <></>;
    return items?.map((item) => (
      <Chip label={item?.trim()} style={{ margin: "5px 3px" }} />
    ));
  };
  return (
    <>
      <TextField
        onChange={onChange}
        label="Keywords here will be used to search image names, tags, and descriptions"
        placeholder="Add keywords separated by commas (E.g. Solar,Sun,green-house etc)"
        style={{ width: "100%", marginTop: 6 }}
        inputProps={{
          style: { padding: "12.5px 14px", width: "100%" },
        }}
      />
      <div style={{ marginTop: 6 }}>{renderChips(keywords)}</div>
    </>
  );
};
