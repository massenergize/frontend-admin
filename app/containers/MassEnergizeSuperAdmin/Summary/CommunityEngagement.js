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
function CommunityEngagement({ communities, auth, options, setOptions }) {
  const [specific, setSpecific] = useState(true);
  const isSuperAdmin = auth && auth.is_super_admin;

  const openImpactPage = (items) => {
    const [subdomain] = items || [];
    if (!subdomain) return;
    const url = `${getHost()}/${subdomain}`;
    window.open(url, "_blank");
  };

  const fetchFromBackendAfterFilters = () => {
    const body = {
      time_range: options.range,
      communities: options.communities,
    };
    apiCall("/summary.get.engagements", body).then((response) => {
      console.log("I think I am the response", response);
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
}) => {
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
          onClick={apply && apply()}
        >
          APPLY
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
            // marginLeft: "auto",
          }}
          onClick={() => hide && hide()}
        >
          HIDE
        </Button>
        {/* <Typography
         
          className="touchable-opacity"
          style={{
            marginLeft: "auto",
            fontWeight: "bold",
            border: "dotted 0px",
            borderBottomWidth: 2,
            color: "#d24646",
          }}
        >
          Hide
        </Typography> */}
      </div>
    </div>
  );
};
