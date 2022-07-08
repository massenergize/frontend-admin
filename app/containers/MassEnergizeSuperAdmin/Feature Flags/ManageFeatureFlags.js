import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import MEChip from "../../../components/MECustom/MEChip";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import Loading from "dan-components/Loading";
import { Link } from "react-router-dom";
const hasExpired = (date) => {
  const now = new Date().getTime();
  date = new Date(date).getTime();
  return date < now;
};
function ManageFeatureFlags({ classes, flags }) {
  if (!flags) return <Loading />;
  flags = Object.entries(flags || {});
  const columns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Feature Name",
        key: "feature-name",
        options: { filter: false },
      },
      {
        name: "Is For Everyone",
        key: "is-for-everyone",
        options: {
          filter: false,
          customBodyRender: (isForEveryone) => {
            return (
              <MEChip
                label={isForEveryone ? "Yes" : "No"}
                className={`${
                  isForEveryone ? classes.yesLabel : classes.noLabel
                } touchable-opacity`}
              />
            );
          },
        },
      },
      {
        name: "Communities",
        key: "selected-communities",
        options: { filter: false },
      },
      {
        name: "Status",
        key: "status",
        options: {
          filter: true,
          customBodyRender: (status) => {
            const expired = status === "Expired"; // This is intentional
            return (
              <MEChip
                label={status}
                style={
                  expired
                    ? { background: "#c04f4f", padding: "0px 9px" }
                    : { padding: "0px 12px" }
                }
                className={`${
                  expired ? classes.yesLabel : classes.yesLabel
                } touchable-opacity`}
              />
            );
          },
        },
      },
      {
        name: "Expires On",
        key: "expiry-date",
        options: { filter: false },
      },
      {
        name: "Manage",
        key: "manage",
        options: {
          filter: false,
          customBodyRender: (data) => {
            return (
              <>
                <Link to={`/google.com`}>
                  <EditIcon size="small" variant="outlined" color="secondary" />
                </Link>
              </>
            );
          },
        },
      },
    ];
  };
  const fashionData = (data) => {
    return (data || []).map(([_, feature]) => {
      var comNames = (feature.communities || []).map((c) => c.name);
      comNames = comNames.join(", ");
      return [
        feature.id,
        feature.name,
        feature.on_for_everyone,
        smartString(comNames) || "---",
        hasExpired(feature.expires_on) ? "Expired" : "Active",
        getHumanFriendlyDate(feature.expires_on, false, false),
        feature.id,
      ];
    });
  };

  const options = {
    filterType: "dropdown",
    responsive: "stacked",
    print: false,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 100],
  };

  return (
    <div>
      <METable
        page={PAGE_PROPERTIES.FEATURE_FLAGS}
        classes={classes}
        tableProps={{
          title: "All Features",
          data: fashionData(flags),
          columns: columns,
          options: options,
        }}
      />
    </div>
  );
}

export default ManageFeatureFlags;
