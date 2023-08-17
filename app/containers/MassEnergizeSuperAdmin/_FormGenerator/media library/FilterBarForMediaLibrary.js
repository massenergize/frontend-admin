import {
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";

export const FilterBarForMediaLibrary = (props) => {
  const [currentFilter, setCurrentFilter] = useState("keywords");
  const [keywords, setKeywords] = useState("");

  const FILTER_OPTIONS = [
    {
      name: "My Uploads",
      key: "my-uploads",
      context: "Only images you have uploaded will show up",
    },
    {
      name: "Use Keywords",
      key: "keywords",
      context: "Enter keywords that describe the image you are looking for ",
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
      context: "See images that have been uploaded by other admins",
    },
    {
      name: "By Community",
      key: "by-community",
      context: "See images that belong to specific communities you manage",
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
                    {option.name}
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
        Items below are sorted by date. The most recent items show up first!
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterBarForMediaLibrary);

const WithKeywords = ({ keywords, onChange }) => {
  const renderChips = (data) => {
    const items = data?.split(",");
    const empty = !items?.length || items[0].trim() === "";
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
