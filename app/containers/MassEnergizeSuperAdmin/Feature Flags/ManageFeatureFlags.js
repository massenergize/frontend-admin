import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import MEChip from "../../../components/MECustom/MEChip";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import Loading from "dan-components/Loading";
import { Link } from "react-router-dom";

function ManageFeatureFlags({ classes, flags }) {
  if (!flags) return <Loading />;
  flags = Object.entries(flags || {});
  console.log("I think I am the flags bro", flags);
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
      },
      {
        name: "Status",
        key: "status",
        options: {
          filter: false,
          customBodyRender: (expired) => {
            return (
              <MEChip
                label={expired ? "Expired" : "Active"}
                style={
                  expired ? { background: "#c04f4f" } : { padding: "0px 12" }
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
        feature.is_expired,
        getHumanFriendlyDate(feature.expires_on, false, false),
        feature.id,
      ];
    });
  };

  const options = {
    filterType: "dropdown",
    responsive: "stacked",
    print: true,
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
