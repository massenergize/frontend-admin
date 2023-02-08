import React, { useState } from "react";
import { PapperBlock } from "dan-components";
import EngagementCard from "./EngagementCard";
import { Typography, Button } from "@material-ui/core";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getHost } from "../Community/utils";
import { setEngagementOptions } from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
function CommunityEngagement({ communities, auth, options, setOptions }) {
  const [specific, setSpecific] = useState(true);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = auth && auth.is_super_admin;

  const openImpactPage = (items) => {
    const [subdomain] = items || [];
    if (!subdomain) return;
    const url = `${getHost()}/${subdomain}`;
    window.open(url, "_blank");
  };

  const fetchFromBackendAfterFilters = () => {
    const range = (options.range || [])[0];
    const isCustom = range === "custom";
    const dates = isCustom
      ? {
          start_time: moment.utc(options.startDate).format(),
          end_time: moment.utc(options.endDate).format(),
        }
      : {};
    const body = {
      time_range: options.range,
      communities: options.communities,
      ...dates,
    };
    console.log("This is where the body is", body);
    setLoading(true);
    return;
    apiCall("/summary.get.engagements", body).then((response) => {
      console.log("I think I am the response", response);
      setLoading(false);
    });
  };
  return (
    <div>
      <PapperBlock
        noMargin
        title="Community Engagement"
        icon="ios-share-outline"
        whiteBg
        desc=""
      >
        <Typography variant="body">
          Here is a summary of user engagements in all of your communities.
          <br />
          {!specific && (
            <span
              onClick={() => setSpecific(true)}
              className="touchable-opacity"
              style={{
                paddingBottom: 4,
                border: "dotted 0px",
                borderBottomWidth: 2,
                fontWeight: "bold",
                color: "rgb(156, 39, 176)",
              }}
            >
              Click for more specific results
            </span>
          )}
        </Typography>
        {specific && (
          <AddFilters
            hide={() => setSpecific(false)}
            communities={communities}
            isSuperAdmin={isSuperAdmin}
            options={options}
            setOptions={setOptions}
            apply={fetchFromBackendAfterFilters}
            loading={loading}
          />
        )}
        <div
          style={{ display: "flex", flexDirection: "row", margin: "10px 0px" }}
        >
          <EngagementCard
            color="#A38E6E"
            title="USER SIGN-INS"
            subtitle="See involved users"
            icon="fa-user"
          />
          <EngagementCard
            theme="#EAFFEB"
            color="#82A36E"
            title="ACTIONS COMPLETED"
            subtitle="See involved actions"
            icon="fa-check-circle"
          />
          <EngagementCard
            color="#9BA1D8"
            theme="#EAEEFF"
            title="ACTIONS IN TODO"
            subtitle="See involved actions"
            icon="fa-tasks"
          />
        </div>
        <div>
          <Typography variant="h6" color="primary">
            <b>IMPACT</b>
          </Typography>

          <MEDropdown
            placeholder="See impact in any of your communities from the dropdown below"
            data={communities}
            labelExtractor={(c) => c.name}
            valueExtractor={(c) => c.subdomain}
            onItemSelected={openImpactPage}
          />
        </div>
      </PapperBlock>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
    options: state.getIn(["engagementOptions"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setOptions: setEngagementOptions,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityEngagement);

// ------------------------------------------------------------------------------------
const TIME_RANGE = [
  { name: "Last Visit", key: "last-visit" },
  { name: "Last Week", key: "last-week" },
  { name: "Last Month", key: "last-month" },
  { name: "Custom Date & Time", key: "custom" },
];
// ------------------------------------------------------------------------------------

export const AddFilters = ({
  hide,
  communities,
  isSuperAdmin,
  options,
  setOptions,
  apply,
  loading,
}) => {
  // const [customRange, setCustomRange] = useState(true); // change to false before PR(BPR)

  options = options || {};
  const extraStyles = isSuperAdmin ? {} : { width: "auto", flex: "1" };
  const rangeValue = options.range || [];
  const comValue = options.communities || [];

  const handleCommunitySelection = (selection) => {
    const last = selection[selection.length - 1];
    const wantsAll = last === "all";
    if (wantsAll) return setOptions({ ...options, communities: ["all"] });
    selection = selection.filter((f) => f !== "all");
    setOptions({ ...options, communities: selection });
  };

  const isCustomRange = ((options && options.range) || [])[0] === "custom";
  console.log("these are th eoptions", options);

  // const handleRangeSelection = (selection) => {
  //   const item = selection[0];
  //   if (item === "custom") return setCustomRange(true);
  //   setOptions({ ...options, range: selection });
  //   setCustomRange(false);
  // };

  const handleDateSelection = (date, name) => {
    setOptions({ ...options, [name]: date });
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
      <div
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
            setOptions({ ...options, range: selection })
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
        />
      </div>
      {isCustomRange && (
        <div style={{ padding: 14 }}>
          <Typography variant="body">
            Select your start, and end date below
          </Typography>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            style={{ width: "100%" }}
          >
            <DateTimePicker
              style={{ marginRight: 10 }}
              label="Start Date"
              format="MM/DD/YYYY"
              value={(options && options.startDate) || ""}
              onChange={(date) => handleDateSelection(date, "startDate")}
            />
            <DateTimePicker
              onChange={(date) => handleDateSelection(date, "endDate")}
              value={(options && options.endDate) || ""}
              label="End Date"
              format="MM/DD/YYYY"
            />
          </MuiPickersUtilsProvider>
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
          onClick={() => apply && apply()}
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
