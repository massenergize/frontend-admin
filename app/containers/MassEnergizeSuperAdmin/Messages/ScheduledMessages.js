import Seo from "../../../components/Seo/Seo";
import React, {  } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@mui/styles";
import styles from "../../../components/Widget/widget-jss";

import { withRouter, Link} from "react-router-dom";
import { apiCall } from "../../../utils/messenger";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import {
  convertToScheduledFor,
} from "../../../utils/common";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import { reduxLoadMetaDataAction, reduxLoadScheduledMessages, reduxToggleUniversalModal, reduxToggleUniversalToast } from "../../../redux/redux-actions/adminActions";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS, LOADING } from '../../../utils/constants';
import Loading from "dan-components/Loading";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { onTableStateChange } from "../../../utils/helpers";


function ScheduledMessages({
  classes,
  auth,
  messages,
  toggleDeleteConfirmation,
  toggleToast,
   meta,
   ...props
}) {

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
        name: "Creator",
        key: "creator",
        options: {
          filter: false,
        },
      },
      {
        name: "Subject",
        key: "subject",
        options: { filter: false },
      },
      {
        name: "Body",
        key: "body",
        options: {
          filter: false,
          customBodyRender: (text) => (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  text.substring(0, 40) + `${text.length > 40 ? "..." : ""}` ||
                  "",
              }}
            />
          ),
        },
      },
      {
        name: "Schedule",
        key: "schedule",
        options: { filter: false },
      },
      {
        name: "Edit",
        key: "edit",
        options: {
          filter: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/scheduled-message`}>
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
            </div>
          ),
        },
      },
    ];
  };

  const nowDelete = ({ idsToDelete, data }) => {
    const { putScheduledMessagesToRedux, updateTableMeta } = props;
    let itemsInRedux = messages|| []
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/messages.delete", { message_id: found })
        .then((response) => {
          if (response.success) {
            let updated = itemsInRedux?.filter(item=>item?.id !== found)
            putScheduledMessagesToRedux(updated)
              updateTableMeta({
                ...meta,
                ["scheduledMessages"]: {
                  ...meta["scheduledMessages"],
                  count: meta["scheduledMessages"].count - 1,
                },
              });
            toggleToast({
              open: true,
              message: "Message successfully deleted",
              variant: "success",
            });
          } else {
            toggleToast({
              open: true,
              message: "An error occurred while deleting the message",
              variant: "error",
            });
          }
        })
        .catch((e) => console.log("MESSAGE_DELETE_ERROR:", e));
    });
  };

  const makeDeleteUI = ({ idsToDelete }) => {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " scheduled message ? " : " scheduled messages? "}
      </Typography>
    );
  };
  
  const fashionData = (data) => {
    return (data || [])?.map((d) => {
      return [
        d.id,
        d?.user?.full_name,
        d.title,
        d.body,
        convertToScheduledFor(d.scheduled_at),
        d.id,
      ];
    });
  };
  if (messages === LOADING) return <Loading />;
  
  const dataForTable = fashionData(messages||[]);

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    count:meta?.scheduledMessages?.count,
    download: false,
    print: false,
    rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
    rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data;
      toggleDeleteConfirmation({
        show: true,
        component: makeDeleteUI({ idsToDelete }),
        onConfirm: () => nowDelete({ idsToDelete, data: dataForTable }),
        closeAfterConfirmation: true,
      });
      return false;
    },
        onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: dataForTable,
          metaData:meta?.scheduledMessages,
          updateReduxFunction:props?.putScheduledMessagesToRedux,
          reduxItems: messages,
          apiUrl: "/messages.listScheduled",
          pageProp: PAGE_PROPERTIES.SCHEDULED_MESSAGES,
          updateMetaData: props?.updateTableMeta,
          name: "scheduledMessages",
          meta: meta,
        }),
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={"/messages.listScheduled"}
          reduxItems={messages}
          updateReduxFunction={props?.putScheduledMessagesToRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.SCHEDULED_MESSAGES}
          updateMetaData={props?.updateTableMeta}
          name="scheduledMessages"
          meta={meta}
        />
      ),
    whenFilterChanges: (
        changedColumn,
        filterList,
        type,
        changedColumnIndex,
        displayData
      ) =>
        handleFilterChange({
          filterList,
          type,
          columns,
          page: PAGE_PROPERTIES.SCHEDULED_MESSAGES,
          updateReduxFunction: putMessagesInRedux,
          reduxItems: messages,
          url: "/messages.listScheduled",
          updateMetaData: props?.updateTableMeta,
          name: "adminMessages",
          meta: meta,
        })
  };
  return (
    <div>
      <Seo name={"Scheduled Messages"} />
      <METable
        page={PAGE_PROPERTIES.SCHEDULED_MESSAGES}
        classes={classes}
        tableProps={{
          title: "Scheduled Messages",
          data: dataForTable,
          columns: columns(),
          options: options,
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  messages: state.getIn(["scheduledMessages"]),
  meta: state.getIn(["paginationMetaData"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putScheduledMessagesToRedux:reduxLoadScheduledMessages,
      updateTableMeta:reduxLoadMetaDataAction

    },
    dispatch
  );
};
const ScheduledMessagesWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduledMessages);
export default withStyles(styles)(withRouter(ScheduledMessagesWithProps));
