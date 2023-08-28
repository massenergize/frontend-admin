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
import {
  fetchOtherAdminsInMyCommunities,
  setLibraryModalFiltersAction,
} from "../../../../redux/redux-actions/adminActions";
import { bindActionCreators } from "redux";
import { sortByField } from "../../../../utils/helpers";
import { apiCall } from "../../../../utils/messenger";

const FILTERS = {
  MOST_RECENT: { key: "most_recent" },
  MY_UPLOADS: { key: "my_uploads" },
  WITH_KEYWORDS: { key: "keywords" },
  FROM_OTHER_ADMINS: { key: "user_ids" },
  BY_COMMUNITY: { key: "target_communities" },
};

const NO_MOD_LIST = [FILTERS.MOST_RECENT.key, FILTERS.MY_UPLOADS.key];
export const FilterBarForMediaLibrary = ({
  auth,
  communities,
  otherAdminsFromRedux,
  findOtherAdminsInMyCommunities,
  notify,
  keepFiltersInRedux,
  filters,
  fetchWithQuery,
}) => {
  // const { currentFilter, usersQuery, queryStash } = filters;
  const [currentFilter, setCurrentFilter] = useState("most_recent");
  const [usersQuery, setQuery] = useState({});
  const [queryStash, setQueryStash] = useState(null);
  const [otherAdmins, setOtherAdmins] = useState([]); // list of other admins in a user's communities used in the dropdown
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false); // for when user clicks "apply"

  const isCommunityAdmin = auth?.is_community_admin && !auth?.is_super_admin;

  const requestBody = () => {
    return { [currentFilter]: usersQuery[currentFilter] };
  };

  const buildQuery = (name, item) => {
    const obj = { ...usersQuery, [name]: item };
    setQuery(obj);
  };

  const queryHasChanged = () => {
    const reqQuery = requestBody();
    if (!queryStash) return true;
    return JSON.stringify(queryStash) !== JSON.stringify(reqQuery);
  };

  const forBackend = (body) => {
    // Because some of the selections need to be modified in a way the backend expects
    if (NO_MOD_LIST.includes(currentFilter)) return body;

    let value = (body || {})[currentFilter];
    if (currentFilter === FILTERS.WITH_KEYWORDS.key)
      return { [currentFilter]: value?.split(",") };

    const item = (value || [])[0];
    if (currentFilter === FILTERS.FROM_OTHER_ADMINS.key && item === "all") {
      value = otherAdmins?.map((ad) => ad.id);
      return { [currentFilter]: value };
    }

    if (currentFilter === FILTERS.BY_COMMUNITY.key && item === "all") {
      value = getCommunitiesToSelectFrom()?.map((ad) => ad.id);
      return { [currentFilter]: value };
    }

    return body;
  };
  const handleApply = () => {
    const body = requestBody();
    setLoading(true);
    const readyForBackend = forBackend(body);
    fetchWithQuery(readyForBackend, (data, failed) => {
      setLoading(false);
      if (failed) return;
      setQueryStash(body);
    });
  };

  const removeKeyword = (word, data) => {
    let items = data.filter((w) => w !== word);
    setQuery({ ...usersQuery, keywords: items.join(",") });
  };
  const getValue = (name, _default = null) => {
    if (!name) return null;
    return usersQuery[name] || _default;
  };

  const getCommunitiesToSelectFrom = () => {
    if (isCommunityAdmin) return auth?.admin_at;
    return communities || [];
  };
  // console.log("OTHER ADMINS", otherAdmins);
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
    setCurrentFilter(filters?.currentFilter || FILTERS.MOST_RECENT.key);
    setQuery(filters?.usersQuery || { most_recent: true });
    setQueryStash(filters?.queryStash || null);
  }, []);

  useEffect(() => {
    keepFiltersInRedux({ ...filters, usersQuery, currentFilter, queryStash });
  }, [queryStash, usersQuery, currentFilter]);

  useEffect(() => {
    setCurrentFilter(filters?.currentFilter || FILTERS.MOST_RECENT.key);
    setQuery(filters?.usersQuery || { most_recent: true });
    setQueryStash(filters?.queryStash || null);
  }, []);

  useEffect(() => {
    keepFiltersInRedux({ ...filters, usersQuery, currentFilter, queryStash });
  }, [queryStash, usersQuery, currentFilter]);

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
        name: "My Community (Default)",
        key: FILTERS.MOST_RECENT.key,
        context:
          "Uploads from any of the communities you manage. Most recent items show up first!",
      },
      {
        name: "I Uploaded",
        key: FILTERS.MY_UPLOADS.key,
        context: "Items uploaded by you",
      },
      {
        name: "With Keywords",
        key: FILTERS.WITH_KEYWORDS.key,
        context: "Keywords that describe the image",
      },
      {
        name: "By Admins",
        key: FILTERS.FROM_OTHER_ADMINS.key,
        context: "See what other admins in your community have uploaded",
      },
      {
        name: "By Community",
        key: FILTERS.BY_COMMUNITY.key,
        context: "Show only community specific items",
      },
    ];

    setOptions(opts);
  }, []);

  const renderContextualOptions = (currentFilter) => {
    if (currentFilter == FILTERS.MY_UPLOADS.key)
      return (
        <Typography variant="body2" style={{ opacity: 0.6 }}>
          Only shows items uploaded by you
        </Typography>
      );
    if (currentFilter == FILTERS.MOST_RECENT.key)
      return (
        <Typography variant="body2" style={{ opacity: 0.6 }}>
          Shows recently uploaded items across all the communities you manage
        </Typography>
      );
    if (currentFilter === FILTERS.BY_COMMUNITY.key)
      return (
        <div>
          <MEDropdown
            onItemSelected={(items) => buildQuery(currentFilter, items)}
            value={getValue(currentFilter, [])}
            // name="by_community"
            multiple
            allowClearAndSelectAll
            labelExtractor={(item) => item?.name}
            valueExtractor={(item) => item?.id}
            data={getCommunitiesToSelectFrom()}
            placeholder="Select communities and 'Apply'"
          />
        </div>
      );

    if (currentFilter === FILTERS.FROM_OTHER_ADMINS.key)
      return (
        <div>
          <MEDropdown
            onItemSelected={(items) => buildQuery(currentFilter, items)}
            value={getValue(currentFilter, [])}
            // name="from_others"
            labelExtractor={(item) => item?.full_name}
            valueExtractor={(item) => item?.id}
            multiple
            allowClearAndSelectAll
            data={otherAdmins}
            placeholder="Select admins and 'Apply'"
          />
        </div>
      );

    if (currentFilter === FILTERS.WITH_KEYWORDS.key)
      return (
        <WithKeywords
          remove={removeKeyword}
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
            value={currentFilter}
            style={{ display: "flex", flexDirection: "row" }}
            onChange={(ev) => {
              const value = ev.target.value;
              if (NO_MOD_LIST.includes(value)) buildQuery(value, true);
              // updateInRedux("currentFilter", ev?.target.value);
              setCurrentFilter(value);
            }}
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
                    <Tooltip
                      title={option.context}
                      placement="top"
                      style={{ fontWeight: "bold" }}
                    >
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
            disabled={!queryHasChanged() || loading}
            onClick={() => handleApply()}
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
      <div style={{ margin: "10px 0px" }}>
        <Typography variant="h6">Images</Typography>
        <Typography
          variant="body2"
          style={{ opacity: "0.6", fontWeight: "400" }}
        >
          Items are arranged by date. The latest items are displayed first,
          moving from left to right in each row. Rows at the top represent more
          recent entries compared to those further down.
        </Typography>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  otherAdminsFromRedux: state.getIn(["otherAdmins"]),
  filters: state.getIn(["mlibFilters"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findOtherAdminsInMyCommunities: fetchOtherAdminsInMyCommunities,
      keepFiltersInRedux: setLibraryModalFiltersAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterBarForMediaLibrary);

const WithKeywords = ({ keywords, onChange, remove }) => {
  const renderChips = (data) => {
    const items = data?.split(",").filter(Boolean);
    const empty = !items?.length;
    if (empty) return <></>;
    return items?.map((item) => (
      <Chip
        label={item?.trim()}
        style={{ margin: "5px 3px" }}
        onDelete={() => remove(item, items)}
      />
    ));
  };
  return (
    <>
      <TextField
        onChange={onChange}
        value={keywords}
        label="Keywords here will be used to search image names, tags, and descriptions"
        placeholder="Add keywords separated by commas (E.g. Solar,Sun,green-house etc)"
        style={{ width: "100%", marginTop: 6 }}
        inputProps={{
          style: { padding: "12.5px 14px", width: "100%" },
        }}
      />
      <div style={{ marginTop: 6, textTransform: "capitalize" }}>
        {renderChips(keywords)}
      </div>
    </>
  );
};
