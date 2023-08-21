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
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
import { fetchOtherAdminsInMyCommunities } from "../../../../redux/redux-actions/adminActions";
import { bindActionCreators } from "redux";
import { sortByField } from "../../../../utils/helpers";

export const FilterBarForMediaLibrary = ({
  auth,
  communities,
  otherAdminsFromRedux,
  findOtherAdminsInMyCommunities,
  notify,
}) => {
  const [currentFilter, setCurrentFilter] = useState("keywords");
  const [usersQuery, setQuery] = useState({});
  const [otherAdmins, setOtherAdmins] = useState([]);
  const [options, setOptions] = useState([]);

  const isCommunityAdmin = auth?.is_community_admin && !auth?.is_super_admin;

  const buildQuery = (name, item) => {
    const obj = { ...usersQuery, [name]: item };
    setQuery(obj);
  };

  const getValue = (name, _default = null) => {
    if (!name) return null;
    return usersQuery[name] || _default;
  };

  const getCommunitiesToSelectFrom = () => {
    if (isCommunityAdmin) return auth?.admin_at;
    return communities || [];
  };

  
  useEffect(() => {
    if (!otherAdminsFromRedux) return;
    const values = Object.values(otherAdminsFromRedux);
    if (!values?.length) return;
    const asList = values?.map((group) => group.members || {});
    let data = Object.assign({}, ...asList);
    data = Object.values(data);
    data = sortByField(data, "full_name");
    setOtherAdmins(data);
  }, [otherAdminsFromRedux]);

  useEffect(() => {
    const otherAdminsListIsntAvailableYet =
      otherAdminsFromRedux === !otherAdminsFromRedux ||
      !Object.keys(otherAdminsFromRedux)?.length;

    if (!otherAdminsListIsntAvailableYet) return;

    const coms = getCommunitiesToSelectFrom()?.map((com) => com.id) || [];
    findOtherAdminsInMyCommunities(
      { community_ids: coms },
      (_, failed, error) => {
        if (failed) return notify(error, true);
      }
    );
  }, []);

  useEffect(() => {
    const opts = [
      {
        name: "My Uploads",
        key: "my-uploads",
        context: "Only images you have uploaded will show up",
      },
      {
        name: "Use Keywords",
        key: "keywords",
        context: "Keywords that describe the image",
      },
      {
        name: "From Other Admins",
        key: "from-others",
        context: "See what other admins have uploaded",
      },
      {
        name: "By Community",
        key: "by-community",
        context: "Show only community specific items",
      },
    ];

    setOptions(opts);
  }, []);

  const renderContextualOptions = (currentFilter) => {
    // NOTE: attaching these components to the options objects itself is the best way to implement it. But it causes dropdowns to conflict unless implemented this way (the way its done below).
    // When there is time, remember to look into it
    if (currentFilter === "by-community")
      return (
        <div>
          <MEDropdown
            onItemSelected={(items) => buildQuery(currentFilter, items)}
            value={getValue(currentFilter, [])}
            name="by-community"
            multiple
            labelExtractor={(item) => item?.name}
            valueExtractor={(item) => item?.id}
            data={getCommunitiesToSelectFrom()}
            placeholder="Select communities and 'Apply'"
          />
        </div>
      );

    if (currentFilter === "from-others")
      return (
        <div>
          <MEDropdown
            onItemSelected={(items) => buildQuery(currentFilter, items)}
            value={getValue(currentFilter, [])}
            name="from-others"
            labelExtractor={(item) => item?.full_name}
            valueExtractor={(item) => item?.id}
            multiple
            allowClearAndSelectAll
            allowChipRemove
            data={otherAdmins}
            placeholder="Select admins and 'Apply'"
          />
        </div>
      );

    if (currentFilter === "keywords")
      return (
        <WithKeywords
          keywords={getValue(currentFilter, "")}
          onChange={(e) => buildQuery(currentFilter, e.target.value)}
        />
      );
  };

  return (
    <div style={{ padding: "0px 27px" }}>
      <div className="me-ml-filter-root">
        <div style={{ padding: "10px 20px" }}>
          <Typography variant="body2">
            Use the options below to filter images
          </Typography>

          <RadioGroup
            defaultValue={"keywords"}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => setCurrentFilter(ev?.target.value)}
          >
            {options.map((option) => (
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

          {renderContextualOptions(currentFilter)}
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
  otherAdminsFromRedux: state.getIn(["otherAdmins"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findOtherAdminsInMyCommunities: fetchOtherAdminsInMyCommunities,
    },
    dispatch
  );
};

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
