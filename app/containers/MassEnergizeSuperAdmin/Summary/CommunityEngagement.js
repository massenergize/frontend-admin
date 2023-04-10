import React, { useEffect, useState } from "react";
import { PapperBlock } from "dan-components";
import EngagementCard from "./EngagementCard";
import { Typography, Button, TextField } from "@mui/material";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getHost } from "../Community/utils";
import Loading from "dan-components/Loading";
import {
  loadUserEngagements,
  setEngagementOptions,
} from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { LOADING } from "../../../utils/constants";
import { useHistory, withRouter } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";

// ------------------------------------------------------------------------------------
export const TIME_RANGE = [
  // { name: "Last Visit", key: "last-visit" },
  { name: "Last Week", key: "last-week" },
  { name: "Last Month", key: "last-month" },
  { name: "Last Year", key: "last-year" },
  { name: "Custom Date", key: "custom" },
];
// ------------------------------------------------------------------------------------

function CommunityEngagement({
  communities,
  auth,
  options,
  setOptions,
  engagements,
  putEngagementsInRedux,
}) {
  const history = useHistory();
  const [specific, setSpecific] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSuperAdmin = auth && auth.is_super_admin && !auth.is_community_admin;
  const hasOnlyOneCommunity = communities.length === 1;

  const selectedCommunity = () => {
    const id = (options?.communities || [])[0];
    if (!id) return (communities || [])[0] || {};
    return (communities || []).find((c) => c.id === id) || {};
  };
  const first = selectedCommunity();

  // ----------------------------------------------------------------------
  const loadEngagements = ({ body }) => {
    apiCall("/summary.get.engagements", body).then((response) => {
      if (!response.success) return response.error;
      putEngagementsInRedux(response.data);
    });
  };
  useEffect(() => {
    if (options.mounted) return;
    loadEngagements({
      body: {
        time_range: "last-month",
        communities: first?.id && !isSuperAdmin ? [first.id] : [], // cadmin, only engagements for 1 community should load the first time page starts
      },
    });
  }, []);
  // ----------------------------------------------------------------------
  if (engagements === LOADING) return <Loading />;
  // ----------------------------------------------------------------------

  const openImpactPage = (items) => {
    const [subdomain] = items || [];
    if (!subdomain) return;
    const url = `${getHost()}/${subdomain}/impact`;
    window.open(url, "_blank");
  };

  const transferOptions = (options) => {
    const { startDate, endDate } = options || {};
    if (!startDate && !endDate) return options;
    return {
      // moment date objects needs to be changed to string before it can be transfered via router state
      ...options,
      startDate: moment.utc(options.startDate).format(),
      endDate: moment.utc(options.endDate).format(),
      startDateString: moment.utc(options.startDate).format("YYYY/MM/DD"),
      endDateString: moment.utc(options.endDate).format("YYYY/MM/DD"),
    };
  };
  const fetchFromBackendAfterFilters = ({ options }) => {
    const range = (options.range || [])[0];
    const isCustom = range === "custom";
    const dates = isCustom
      ? {
          start_time: moment.utc(options.startDate).format(), //"YYYY-MM-DD HH:MM"
          end_time: moment.utc(options.endDate).format(),
        }
      : {};
    const body = {
      time_range: range,
      communities: options.communities,
      ...dates,
    };
    setLoading(true);

    apiCall("/summary.get.engagements", body).then((response) => {
      if (!response.success) return response.error;
      setLoading(false);
      putEngagementsInRedux(response.data);
    });
  };
  const doneInteractions = engagements.done_interactions;
  const todoInteractions = engagements.todo_interactions;
  const signIns = engagements.sign_ins;
  const testimonials = engagements.testimonials;
  const rangeValue = options.range || [];

  const muiOverride = {
    sx: {
      boxShadow: "none",
      ".MuiOutlinedInput-notchedOutline": { border: 0 },
    },
  };
  return (
    <div>
      <MEPaperBlock
        customHeader={
          <>
            <div style={{ marginBottom: 15 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Typography
                  variant="h3"
                  style={{
                    fontSize: 24,
                    color: "#8E24AA",
                    fontWeight: "bold",
                    marginRight: 20,
                  }}
                >
                  Community Engagement Summary for{" "}
                  {hasOnlyOneCommunity ? <span>{first?.name}</span> : <></>}
                </Typography>

                {!hasOnlyOneCommunity && (
                  <MEDropdown
                    generics={muiOverride}
                    multiple={false}
                    data={communities}
                    valueExtractor={(c) => c.id}
                    labelExtractor={(c) => c.name}
                    containerStyle={{ width: "18%", marginTop: 0 }}
                    defaultValue={[first.id]}
                    onItemSelected={(selection) => {
                      const item = selection && selection[0];
                      const op = {
                        ...options,
                        communities: selection,
                        mounted: true,
                      }; // It uses previous selection of communities
                      setOptions(op);
                      fetchFromBackendAfterFilters({ options: op });
                    }}
                  />
                )}

                <Typography
                  variant="caption"
                  style={{
                    marginLeft: 5,
                    marginRight: 5,
                    fontSize: 14,
                    // color: "#8E24AA",
                    // fontWeight: "bold",
                  }}
                >
                  Time Range
                </Typography>
                <MEDropdown
                  generics={muiOverride}
                  multiple={false}
                  data={TIME_RANGE}
                  valueExtractor={(t) => t.key}
                  labelExtractor={(t) => t.name}
                  containerStyle={{ width: "15%", marginTop: 0 }}
                  defaultValue={rangeValue}
                  onItemSelected={(selection) => {
                    const item = selection && selection[0];
                    const op = {
                      ...options,
                      range: selection,
                      mounted: true,
                    }; // It uses previous selection of communities
                    setOptions(op);
                    if (item == "custom") return setSpecific(true);

                    fetchFromBackendAfterFilters({ options: op });
                  }}
                />
              </div>
              {loading && !specific && (
                <>
                  <LinearBuffer message="In a bit..." />
                  <br />
                </>
              )}
              <Typography variant="body" style={{ fontSize: "1rem" }}>
                Here is a summary of user engagements in your communities.
              </Typography>
            </div>
          </>
        }
      >
        {specific && (
          <AddFilters
            hide={() => setSpecific(false)}
            communities={communities}
            isSuperAdmin={isSuperAdmin}
            options={options}
            setOptions={setOptions}
            apply={() => fetchFromBackendAfterFilters({ options })}
            loading={loading}
            firstCommunity={first}
          />
        )}
        <div style={{ display: "flex", flexDirection: "row", margin: "0px" }}>
          <EngagementCard
            color="#A38E6E"
            title="USER SIGN-INS"
            subtitle={signIns.count && "See involved users"}
            icon="fa-user"
            value={signIns.count}
            onClick={() =>
              history.push({
                pathname: "/admin/read/users",
                state: { ids: signIns?.data },
              })
            }
          />
          <EngagementCard
            theme="#EAFFEB"
            color="#82A36E"
            title="ACTIONS COMPLETED"
            subtitle={doneInteractions.count && "See involved actions"}
            icon="fa-check-circle"
            value={doneInteractions.count}
            onClick={() => {
              history.push({
                pathname: "/admin/read/action-engagements",
                state: {
                  ids: doneInteractions?.data,
                  type: "DONE",
                  options: transferOptions(options),
                },
              });
            }}
          />
          <EngagementCard
            color="#9BA1D8"
            theme="#EAEEFF"
            title="ACTIONS IN TODO"
            subtitle={todoInteractions.count && "See involved actions"}
            icon="fa-tasks"
            value={todoInteractions.count}
            onClick={() => {
              history.push({
                pathname: "/admin/read/action-engagements",
                state: {
                  ids: todoInteractions?.data,
                  type: "TODO",
                  options: transferOptions(options),
                },
              });
            }}
          />
          <EngagementCard
            color="rgb(216 155 155)"
            theme="rgb(255 234 234)"
            title="TESTIMONIALS"
            subtitle={testimonials.count && "See involved testimonials"}
            icon="fa-tasks"
            value={testimonials.count}
            onClick={() => {
              history.push({
                pathname: "/admin/read/testimonials",
                state: { ids: testimonials?.data },
              });
            }}
          />
        </div>
        <div>
          {/* <Typography variant="h6" color="primary">
            <b>IMPACT</b>
          </Typography> */}
          {hasOnlyOneCommunity && first ? (
            <Typography
              className="touchable-opacity"
              variant="body"
              style={{
                marginTop: 15,
                color: "#AB47BC",
                border: "dotted 0px #AB47BC",
                borderBottomWidth: 2,
                paddingBottom: 4,
                display: "inline-block",
              }}
              onClick={() => openImpactPage([first.subdomain])}
            >
              View the impact page for <b>{first.name}</b>
            </Typography>
          ) : (
            <MEDropdown
              placeholder="See impact in any of your communities from the dropdown below. (Click to select community)"
              data={communities}
              labelExtractor={(c) => c.name}
              valueExtractor={(c) => c.subdomain}
              onItemSelected={openImpactPage}
            />
          )}
        </div>
      </MEPaperBlock>
      {/* </PapperBlock> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
    options: state.getIn(["engagementOptions"]),
    engagements: state.getIn(["userEngagements"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setOptions: setEngagementOptions,
      putEngagementsInRedux: loadUserEngagements,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CommunityEngagement));

// ------------------------------------------------------------------
export const AddFilters = ({
  hide,
  communities,
  isSuperAdmin,
  options,
  setOptions,
  apply,
  loading,
}) => {
  communities = (communities || []).sort((a, b) => (a.name > b.name ? 1 : -1));
  options = options || {};
  const extraStyles = isSuperAdmin ? {} : { width: "auto", flex: "1" };
  const rangeValue = options.range || [];
  const comValue = options.communities;

  const handleCommunitySelection = (selection) => {
    const last = selection[selection.length - 1];
    const wantsAll = last === "all";
    if (wantsAll)
      return setOptions({ ...options, communities: ["all"], mounted: true });
    selection = selection.filter((f) => f !== "all");
    setOptions({ ...options, communities: selection, mounted: true });
  };

  const isCustomRange = ((options && options.range) || [])[0] === "custom";

  const handleDateSelection = (date, name) => {
    setOptions({ ...options, [name]: date, mounted: true });
  };
  const disableButton =
    !options ||
    !options.range ||
    !options.range.length ||
    !options.communities ||
    !options.communities.length;

  return (
    <div
      style={{ border: "dashed 2px #f3f3f3", marginTop: 13, marginBottom: 10 }}
    >
      {/* ---- DONT REMOVE YET----- */}
      {/* <div
        style={{
          display: "flex",
          flexDirection: isSuperAdmin ? "column" : "row",
          flex: "2",
          justifyContent: "center",
          padding: 14,
        }}
      >
        <MEDropdown
          multiple={false}
          data={TIME_RANGE}
          placeholder="Time Range"
          valueExtractor={(t) => t.key}
          labelExtractor={(t) => t.name}
          containerStyle={{ ...extraStyles, marginRight: 14 }}
          defaultValue={rangeValue}
          onItemSelected={(selection) =>
            setOptions({ ...options, range: selection, mounted: true })
          }
        />

        <MEDropdown
          multiple={true}
          containerStyle={extraStyles}
          placeholder="Select any of the communities you manage"
          data={[{ name: "All", id: "all" }, ...(communities || [])]}
          valueExtractor={(c) => c.id}
          labelExtractor={(c) => c.name}
          defaultValue={comValue}
          onItemSelected={handleCommunitySelection}
          showSelectAll={false}
        />
      </div> */}
      {isCustomRange && (
        <div style={{ padding: 14 }}>
          <Typography variant="body">
            Select your start, and end date below
          </Typography>
          <div style={{ marginTop: 16 }}>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              utils={MomentUtils}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <DatePicker
                  renderInput={(props) => (
                    <TextField style={{ marginRight: 10 }} {...props} />
                  )}
                  label="Start Date"
                  value={(options && options.startDate) || ""}
                  onChange={(date) => handleDateSelection(date, "startDate")}
                />
                <Typography style={{ marginRight: 10 }}>To</Typography>
                <DatePicker
                  onChange={(date) => handleDateSelection(date, "endDate")}
                  renderInput={(props) => <TextField {...props} />}
                  value={(options && options.endDate) || ""}
                  label="End Date"
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 8,
          background: "#fafafa",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          className="touchable-opacity"
          style={{
            borderRadius: 0,
            padding: 10,
            color: "white",
            width: 113,
            background: "green",
          }}
          onClick={() => {
            apply && apply();
            hide & hide();
          }}
          disabled={disableButton}
        >
          {loading && (
            <i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />
          )}{" "}
          {loading ? "APPL..." : " APPLY"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="touchable-opacity"
          style={{
            borderRadius: 0,
            padding: 10,
            color: "white",
            width: 113,
            background: "#d24646",
          }}
          onClick={() => hide && hide()}
        >
          HIDE
        </Button>
      </div>
    </div>
  );
};
