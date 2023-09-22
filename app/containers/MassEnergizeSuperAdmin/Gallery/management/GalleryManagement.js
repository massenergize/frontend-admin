import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import { Avatar, Button, Link, Paper, Typography } from "@mui/material";
import METable from "../../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../../ME  Tools/MEConstants";
import { bindActionCreators } from "redux";
import {
  fetchAllDuplicateMedia,
  reduxSetDuplicateSummary,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../../redux/redux-actions/adminActions";
import MergeAndRemove from "./MergeAndRemove";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { LOADING } from "../../../../utils/constants";
import { smartString, triggerFileDownload } from "../../../../utils/common";
import { apiCall, apiCallFile } from "../../../../utils/messenger";

const usageBreakdown = (usageObj) => {
  const items = Object.entries(usageObj || {});
  let count = 0;
  let str = "";
  items.forEach(([key, array]) => {
    const length = array.length;
    if (length) {
      if (str) str += `, ${key}(${length})`;
      else str = `${key}(${length})`;
      count += length;
    }
  });

  return { usedBy: count, usageSummary: str };
};
export const GalleryManagement = (props) => {
  const {
    toggleModal,
    summary,
    fetchSummary,
    updateDuplicates,
    toggleToast,
  } = props;
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const nowMounting = summary === LOADING;

  const getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
      },
    },
    {
      name: "Image",
      key: "image",
      options: {
        sort: false,
        filter: false,
        download: false,
        customBodyRender: (url) => (
          <div>
            <Avatar
              // alt={d.initials}
              src={url}
              style={{ margin: 10 }}
            />
          </div>
        ),
      },
    },
    {
      name: "Used By",
      key: "used-by",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Usage Summary",
      key: "key_contact",
      options: {
        filter: false,
      },
    },
    {
      name: "Ids of duplicates",
      key: "communities",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "Actions",
      key: "actions",
      options: {
        filter: false,
        download: false,
        sort: false,
        customBodyRender: (bag) => (
          <div>
            <Link
              onClick={(e) => {
                e.preventDefault();
                reviewAndMerge(bag);
              }}
              to={`#`}
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Review & Merge
            </Link>
          </div>
        ),
      },
    },
  ];

  const fashionData = () => {
    if (nowMounting) return [];
    const rows = Object.entries(summary);

    return rows.map(([hash, bag]) => {
      const { media, disposable, usage } = bag;
      const breakdown = usageBreakdown(usage);
      const { usedBy, usageSummary } = breakdown;
      let dupes = disposable?.map((m) => m.id);
      dupes = dupes.join(", ");
      dupes = smartString(dupes, 50);
      return [
        media?.id,
        media?.url,
        usedBy,
        !usageSummary ? "Not used anywhere" : usageSummary,
        dupes,
        { ...bag, hash, breakdown },
      ];
    });
  };

  const loadDuplicates = () => {
    setLoading(true);
    fetchSummary(() => setLoading(false));
  };

  useEffect(() => {
    if (!nowMounting) return;
    loadDuplicates();
  }, []);

  const downloadAsCSV = async () => {
    setDownloading(true);
    try {
      const response = await apiCallFile("/gallery.duplicates.summary.print");
      triggerFileDownload(
        response?.file,
        `summary_of_duplicates_${new Date().toISOString()}`
      );
      setDownloading(false);
    } catch (e) {
      setDownloading(false);
      console.log("ERROR_DOWNLOADING_CSV:", e?.toString());
    }
  };

  const mergeAndDelete = (hash, cb) => {
    apiCall("/gallery.duplicates.clean", { hash })
      .then((response) => {
        if (!response?.success)
          return console.log("ERROR_MERGING_DUPLICATES_BE:", response.error);

        delete summary[hash];
        updateDuplicates(summary);
        toggleToast({
          open: true,
          message: "Duplicates have been merged!",
          variant: "success",
        });
        cb && cb();
      })
      .catch((e) => {
        toggleToast({
          open: true,
          message: e?.toString(),
          variant: "error",
        });
        console.log("ERROR_MERGING_DUPLICATES:", e?.toString());
        cb && cb();
      });
  };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: 25,
    selectableRows: "none",
    search: false,
    print: false,
    download: false,
    filter: false,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const reviewAndMerge = (props) => {
    toggleModal({
      show: true,
      component: (
        <MergeAndRemove
          {...props}
          mergeAndDelete={mergeAndDelete}
          close={() => toggleModal({ show: false, component: null })}
        />
      ),
      closeAfterConfirmation: true,
      title: "Summary of duplicates",
      noTitle: false,
      fullControl: true,
      okText: "Merge & Remove Duplicates",
    });
  };

  if (loading)
    return (
      <LinearBuffer
        asCard
        lines={1}
        message="Please be patient, this may take a while. We are reviewing all platform media items for duplicates..."
      />
    );
  return (
    <div>
      <Paper elevation={2} style={{ marginBottom: 20 }}>
        <div style={{ padding: "20px 25px" }}>
          <Typography>
            The table below is a summary of all duplicate images that exist on
            the platform. Images that are the exact copy of the other are
            grouped and represented as one row. On each raw, relevant
            information on where the images are being used on the platform, as
            well as links for previews are provided. Click on<b> "View More"</b>{" "}
            for a thorough breakdown.
          </Typography>
        </div>

        <div
          style={{
            width: "100%",
            background: "#fcfcfc",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            onClick={() => loadDuplicates()}
            variant="contained"
            color="primary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: "10px 30px",
              fontSize: 14,
              margin: 0,
            }}
          >
            Refresh
          </Button>
          <Button
            disabled={downloading}
            onClick={() => downloadAsCSV()}
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: "10px 30px",
              fontSize: 14,
              margin: 0,
            }}
          >
            {downloading && (
              <i
                className=" fa fa-spinner fa-spin"
                style={{ marginRight: 5 }}
              />
            )}
            <span style={{ fontWeight: "800" }}>Download</span>
          </Button>
        </div>
      </Paper>

      <METable
        page={PAGE_PROPERTIES.DUPLICATE_MEDIA_MANAGEMENT}
        tableProps={{
          title: "Duplicates",
          data: fashionData(),
          columns: getColumns(),
          options,
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  summary: state.getIn(["duplicateSummary"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      toggleModal: reduxToggleUniversalModal,
      fetchSummary: fetchAllDuplicateMedia,
      updateDuplicates: reduxSetDuplicateSummary,
      toggleToast: reduxToggleUniversalToast,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryManagement);
