import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

import Paper from "@mui/material/Paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tooltip, Typography } from "@mui/material";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  loadAllEvents,
  reduxGetAllCommunityEvents,
  reduxGetAllEvents,
  reduxLoadMetaDataAction,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast
} from "../../../redux/redux-actions/adminActions";
import {
  fetchParamsFromURL,
  findMatchesAndRest,
  getHumanFriendlyDate,
  getTimeStamp,
  isEmpty,
  makeDeleteUI,
  ourCustomSort,
  smartString
} from "../../../utils/common";
import MEChip from "../../../components/MECustom/MEChip";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { getAdminApiEndpoint, getLimit, handleFilterChange, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS, FROM } from "../../../utils/constants";
import Loader from "../../../utils/components/Loader";
import Seo from "../../../components/Seo/Seo";
import CustomOptions from "../ME  Tools/table /CustomOptions";
import { EventNotSharedWithAnyone, EventSharedWithCommunity } from "./EventSharedStateComponents";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import EventNotificationSettings from "./notifcation-settings/EventNotificationSettingsOneCommunity";
import Feature from "../../../components/FeatureFlags/Feature";
import { FLAGS } from "../../../components/FeatureFlags/flags";
import StarsIcon from "@mui/icons-material/Stars";
import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import CallMadeIcon from "@mui/icons-material/CallMade";
import BellIcon from "@mui/icons-material/NotificationAdd";
import Envelope from "@mui/icons-material/Mail";

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns()
    };
  }

  componentDidMount() {
    const { from } = fetchParamsFromURL(window.location, "from");
    this.setState({ currentTab: from === FROM.OTHER_EVENTS ? 1 : 0 });

    const user = this.props.auth ? this.props.auth : {};
    const community = this.props.community ? this.props.community : {};
    if (user.is_super_admin) {
      this.props.callForSuperAdminEvents();
    }
    if (user.is_community_admin) {
      const com = community || user.admin_at[0];
      this.props.callForNormalAdminEvents(com.id);
    }
  }

  fashionData(data) {
    const fashioned = data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.start_date_and_time, true),
      {
        id: d.id,
        image: d.image,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
      },
      smartString(d.name),
      d,
      `${
        smartString(d.tags.map((t) => t.name).join(", "), 30) // limit to first 30 chars
      }`,
      d.is_global ? "Template" : d.community && d.community.name,
      {
        isLive: d.is_published,
        item: d
      },
      {
        id: d.id,
        ...d,
        is_on_home_page: d.is_on_home_page,
        eventObj: d
      },
      d.is_published ? "Yes" : "No",
      d.is_global,
      getHumanFriendlyDate(d.start_date_and_time, true, false),
      getHumanFriendlyDate(d.end_date_and_time, true, false)
    ]);
    return fashioned;
  }

  async copyEvent(id) {
    const { putEventsInRedux, allEvents } = this.props;
    const copiedEventResponse = await apiCall("/events.copy", {
      event_id: id
    });
    if (copiedEventResponse && copiedEventResponse.success) {
      const newEvent = copiedEventResponse && copiedEventResponse.data;
      this.props.history.push(`/admin/edit/${newEvent.id}/event`);
      putEventsInRedux([newEvent, ...(allEvents || [])]);
    }
  }

  showNotificationSettings(props) {
    const { toggleModal } = this.props;
    toggleModal({
      show: true,
      fullControl: true,

      // title: smartString(props?.name, 50) || "Notification Settings",
      noTitle: true,
      renderComponent: () => (
        <EventNotificationSettings
          {...props}
          close={() =>
            toggleModal({
              show: false,
              component: null
            })
          }
        />
      ),
      cancelText: "Close",
      noOk: true
    });
  }

  makeOptions(props) {
    const { id, is_on_home_page } = props;
    const COMMON_STYLES = {
      fontWeight: "bold",
      fontSize: ".8rem",
      padding: "10px 15px"
    };

    return [
      {
        key: "copy",
        name: "Copy",
        style: COMMON_STYLES,
        onClick: () => this.copyEvent(id)
      },
      {
        key: "edit",
        name: "Edit",
        style: COMMON_STYLES,
        onClick: () => this.props.history.push(`/admin/edit/${id}/event`)
      },
      {
        key: "homepage",
        name: !is_on_home_page ? "Add to Homepage" : "Remove from Homepage",
        style: COMMON_STYLES,
        onClick: () => {
          this.props.toggleLive({
            show: true,
            component: this.addToHomePageUI({ id }),
            onConfirm: () => this.addEventToHomePage(id),
            closeAfterConfirmation: true
          });
        }
      },
      {
        key: "nudge",
        name: "Notification Settings",
        style: COMMON_STYLES,
        onClick: () => this.showNotificationSettings(props)
      }
    ];
  }

  getColumns() {
    const { classes, auth, communities } = this.props;

    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false
        }
      },
      {
        name: "Date",
        key: "date",
        options: {
          filter: false,
          download: false
        }
      },
      {
        name: "Event",
        key: "event",
        options: {
          sort: false,
          filter: false,
          download: false,
          customBodyRender: (d) => (
            <div>
              {d.image && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />}
              {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
            </div>
          )
        }
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false
        }
      },
      {
        name: "Shared",
        key: "shared",
        options: {
          filter: false,
          customBodyRender: (d) => (
            <EventSharedState
              {...d || {}}
              classes={classes}
              history={this.props.history}
              toggleModalOnClick={(props) => this.props.toggleModal(props)}
            />
          )
        }
      },
      {
        name: "Tags",
        key: "tags",
        options: {
          filter: true,
          filterType: "multiselect"
        }
      },
      {
        name: "Community",
        key: "community",
        options: auth?.is_super_admin
          ? CustomOptions({
              data: communities,
              label: "community",
              endpoint: "/communities.listForSuperAdmin"
            })
          : {
              filter: true,
              filterType: "multiselect"
            }
      },
      {
        name: "Live?",
        key: "is_live",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => (
            <MEChip
              onClick={() =>
                this.props.toggleLive({
                  show: true,
                  component: this.makeLiveUI({ data: d.item }),
                  onConfirm: () => this.makeLiveOrNot(d.item),
                  closeAfterConfirmation: true
                })
              }
              label={d?.isLive ? "Yes" : "No"}
              className={`${d?.isLive ? classes.yesLabel : classes.noLabel} touchable-opacity`}
            />
          )
        }
      },
      {
        name: "Options",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          sort: false,
          customBodyRender: (content) => {
            const { id, is_on_home_page, community } = content;
            const communityObjectThatHasFeatureFlag = this.props.communities?.find((com) => com?.id === community?.id);
            return (
              <Feature
                // disable Dropdown mode for now
                // communities={communityObjectThatHasFeatureFlag ? [communityObjectThatHasFeatureFlag] : null} // the feature should only be enabled for events that belong to communites that are enabled for the feature
                // name={FLAGS.EVENT_SPECIFIC_NOTIFICATION_SETTINGS}
                fallback={
                  <div style={{ display: "flex" }}>
                    <Tooltip title="Edit this event">
                      <Link to={`/admin/edit/${id}/event`}>
                        <EditIcon size="small" variant="outlined" color="secondary" />
                      </Link>
                      &nbsp;&nbsp;
                    </Tooltip>
                    <Tooltip title="Copy this event">
                      <Link
                        onClick={async () => {
                          const copiedEventResponse = await apiCall("/events.copy", {
                            event_id: id
                          });
                          if (copiedEventResponse && copiedEventResponse.success) {
                            const newEvent = copiedEventResponse && copiedEventResponse.data;
                            this.props.history.push(`/admin/edit/${newEvent.id}/event`);
                            putEventsInRedux([newEvent, ...(this.props.allEvents || [])]);
                          }
                        }}
                        to="/admin/read/events"
                      >
                        <FileCopy size="small" variant="outlined" color="secondary" />
                      </Link>
                    </Tooltip>
                    {auth && auth.is_super_admin && (
                      <Link to={`/admin/read/event/${id}/event-view?from=main`}>
                        <CallMadeIcon size="small" variant="outlined" color="secondary" />
                      </Link>
                    )}
                    <Tooltip
                      title={`${is_on_home_page ? "Remove" : "Add"} event ${
                        is_on_home_page ? "from" : "to"
                      } community's homepage`}
                    >
                      <Link
                        onClick={() => {
                          this.props.toggleLive({
                            show: true,
                            component: this.addToHomePageUI({ id }),
                            onConfirm: () => this.addEventToHomePage(id),
                            closeAfterConfirmation: true
                          });
                        }}
                      >
                        {is_on_home_page ? (
                          <StarsIcon
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "rgb(65 172 65)"
                            }}
                          />
                        ) : (
                          <StarsIcon
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#bcbcbc"
                            }}
                          />
                        )}
                      </Link>
                    </Tooltip>
                    <Tooltip title="Configure notifications for this event">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          this.showNotificationSettings(content);
                        }}
                      >
                        <Envelope size="small" variant="outlined" color="secondary" />
                      </Link>
                    </Tooltip>
                  </div>
                }
              >
                <div style={{ minWidth: 150 }}>
                  <MEDropdown
                    fullControl
                    data={this.makeOptions(content)}
                    labelExtractor={(it) => it.name}
                    valueExtractor={(it) => it.key}
                    placeholder="Options"
                  />
                </div>
              </Feature>
            );
          }
        }
      },
      {
        name: "Live",
        key: "hidden_live_or_not",
        options: {
          display: false,
          filter: true,
          searchable: false,
          download: true,
          sort: false
        }
      },
      {
        name: "Live",
        key: "is_a_template",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: false
        }
      },
      {
        name: "Start Date",
        key: "hidden_start_date",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true
        }
      },
      {
        name: "End Date",
        key: "hidden_end_Date",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true
        }
      }
    ];
  }

  makeLiveOrNot(item) {
    const putInRedux = this.props.putEventsInRedux;
    const data = this.props.allEvents || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putInRedux([...data]);
    const { community } = item;
    apiCall("/events.update", {
      event_id: item.id,
      is_published: !status,
      name: item.name,
      community_id: (community && community.id) || null
    });
  }

  makeLiveUI({ data }) {
    const name = data && data.name;
    const isON = data.is_published;
    return (
      <div>
        <Typography>
          <b>{name}</b> is
          {isON ? "live, " : "not live, "}
          would you like {isON ? " to take it offline" : " to take it live"}?
        </Typography>
      </div>
    );
  }

  addToHomePageUI({ id }) {
    const data = this.props.allEvents || [];
    const event = data?.find((item) => item.id?.toString() === id?.toString()) || {};
    return (
      <div>
        <Typography>
          would you like to {event?.is_on_home_page ? "remove" : "add"} <b>{event?.name}</b>{" "}
          {event?.is_on_home_page ? "from" : "to"} <b>{event?.community?.name}</b>
          {"'s "} community homepage?
        </Typography>
      </div>
    );
  }

  addEventToHomePage = (id) => {
    const { allEvents, putEventsInRedux } = this.props;
    const data = allEvents || [];
    const event = data?.find((item) => item.id?.toString() === id?.toString()) || {};
    const index = data.findIndex((a) => a.id?.toString() === id);

    const toSend = {
      event_id: id,
      community_id: event?.community?.id
    };

    // BHN - use end_date_and_time so ongoing events/campaigns can show on home page
    if (new Date(event?.end_date_and_time) < Date.now()) {
      this.props.toggleToast({
        open: true,
        message: "Event is out of date",
        variant: "error"
      });
      return;
    }

    apiCall("home_page_settings.addEvent", toSend).then((res) => {
      if (res.success) {
        event.is_on_home_page = res?.data?.status;
        data.splice(index, 1, event);
        putEventsInRedux([...data]);
        this.props.toggleToast({
          open: true,
          message: res.data?.msg,
          variant: res?.data?.msg?.includes("removed") ? "warning" : "success"
        });
      } else {
        this.props.toggleToast({
          open: true,
          message: res?.error,
          variant: "error"
        });
      }
    });
  };

  customSort(data, colIndex, order) {
    // this specifying the column index as a number leads to bugs over and over again
    const isComparingLive = colIndex === 7;
    const sortForLive = ({ a, b }) => (a.isLive && !b.isLive ? -1 : 1);
    const params = {
      colIndex,
      order,
      compare: isComparingLive && sortForLive
    };
    return data.sort((a, b) =>
      ourCustomSort({
        ...params,
        a,
        b
      })
    );
  }

  nowDelete({ idsToDelete, data }) {
    const { allEvents, putEventsInRedux, putMetaDataToRedux, meta } = this.props;
    const itemsInRedux = allEvents;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/events.delete", { event_id: found }).then((response) => {
        if (response.success) {
          putMetaDataToRedux({
            ...meta,
            events: {
              ...meta.events,
              count: meta.events.count - 1
            }
          });
          this.props.toggleToast({
            open: true,
            message: "Event(s) successfully deleted",
            variant: "success"
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the event(s)",
            variant: "error"
          });
        }
      });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putEventsInRedux(rem);
  }

  fetchOtherEvents() {
    const { community_ids, exclude } = this.state;
    const { putOtherEventsInRedux } = this.props;
    const ids = (community_ids || []).map((it) => it.id);
    this.setState({ loading: true });
    apiCall("/events.others.listForCommunityAdmin", {
      community_ids: ids,
      exclude: exclude || false,
      limit: getLimit(PAGE_PROPERTIES.ALL_EVENTS.key),
      params: JSON.stringify({}),
      page: 1
    })
      .then((response) => {
        this.setState({ loading: false });
        if (response.success) return putOtherEventsInRedux(response.data);
      })
      .catch((e) => {
        this.setState({ loading: false });
        console.log("OTHER_EVENTS_BE_ERROR:", e.toString());
      });
  }

  render() {
    const { columns } = this.state;
    const { classes } = this.props;
    const { allEvents, putEventsInRedux, auth, meta, putMetaDataToRedux } = this.props;
    const data = this.fashionData(allEvents || []);
    const metaData = meta && meta.events;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      count: metaData && metaData.count,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      confirmFilters: true,
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putEventsInRedux,
          reduxItems: allEvents,
          apiUrl: getAdminApiEndpoint(auth, "/events"),
          pageProp: PAGE_PROPERTIES.ALL_EVENTS,
          updateMetaData: putMetaDataToRedux,
          name: "events",
          meta
        }),
      customSearchRender: (searchText, handleSearch, hideSearch) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/events")}
          reduxItems={allEvents}
          updateReduxFunction={putEventsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_EVENTS}
          updateMetaData={putMetaDataToRedux}
          name="events"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => (
        <ApplyFilterButton
          url={getAdminApiEndpoint(auth, "/events")}
          reduxItems={allEvents}
          updateReduxFunction={putEventsInRedux}
          columns={columns}
          limit={getLimit(PAGE_PROPERTIES.ALL_EVENTS.key)}
          applyFilters={applyFilters}
          updateMetaData={putMetaDataToRedux}
          name="events"
          meta={meta}
        />
      ),
      whenFilterChanges: (changedColumn, filterList, type) =>
        handleFilterChange({
          filterList,
          type,
          columns,
          page: PAGE_PROPERTIES.ALL_EVENTS,
          updateReduxFunction: putEventsInRedux,
          reduxItems: allEvents,
          url: getAdminApiEndpoint(auth, "/events"),
          updateMetaData: putMetaDataToRedux,
          name: "events",
          meta
        }),
      customSort: this.customSort,
      downloadOptions: {
        filename: `All Events (${getTimeStamp()}).csv`,
        separator: ","
      },
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const [found] = findMatchesAndRest(idsToDelete, (it) => {
          const f = data[it.dataIndex];
          return f[10]; // this index should be changed if anyone modifies (adds/removes) an item in fashioData()
        });
        const noTemplatesSelectedGoAhead = !found || !found.length;
        this.props.toggleModal({
          show: true,
          component: makeDeleteUI({
            idsToDelete,
            templates: found,
            noTemplates: noTemplatesSelectedGoAhead
          }),
          onConfirm: () =>
            noTemplatesSelectedGoAhead &&
            this.nowDelete({
              idsToDelete,
              data
            }),
          closeAfterConfirmation: true,
          cancelText: noTemplatesSelectedGoAhead ? "No" : "Go Back and Remove Templates",
          noOk: !noTemplatesSelectedGoAhead
        });
        return false;
      }
    };

    if (isEmpty(metaData)) {
      return <Loader />;
    }

    return (
      <div>
        <Seo name="All Events" />
        <Paper style={{ marginBottom: 10 }}>
          <METable
            classes={classes}
            page={PAGE_PROPERTIES.ALL_EVENTS}
            tableProps={{
              title: "All Events",
              data,
              columns,
              options
            }}
          />
        </Paper>
      </div>
    );
  }
}

AllEvents.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allEvents: state.getIn(["allEvents"]),
    community: state.getIn(["selected_community"]),
    meta: state.getIn(["paginationMetaData"]),
    communities: state.getIn(["communities"])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callForSuperAdminEvents: reduxGetAllEvents,
      callForNormalAdminEvents: reduxGetAllCommunityEvents,
      putEventsInRedux: loadAllEvents,
      toggleModal: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction
    },
    dispatch
  );
}

const EventsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllEvents);
export default withStyles(styles)(withRouter(EventsMapped));

const EventSharedState = (props) => {
  const { shared_to, name, classes, toggleModalOnClick, publicity, communities_under_publicity, id, history } = props;

  const numberOfSharers = shared_to?.length || 0;
  const commonClasses = "touchable-opacity";

  const closeModal = () => {
    toggleModalOnClick && toggleModalOnClick({ show: false });
  };

  const notSharedYetDialog = () => {
    toggleModalOnClick &&
      toggleModalOnClick({
        show: true,
        title: smartString(name, 50),
        component: (
          <EventNotSharedWithAnyone
            publicity={publicity}
            shareable_to={communities_under_publicity}
            closeModal={closeModal}
            history={history}
            id={id}
          />
        ),
        cancelText: "Close",
        noOk: true // okText: "Change Event Settings",
      });
  };
  const sharedWithDialog = () => {
    toggleModalOnClick &&
      toggleModalOnClick({
        show: true,
        title: smartString(name, 50),
        component: (
          <EventSharedWithCommunity
            publicity={publicity}
            shared_to={shared_to}
            id={id}
            shareable_to={communities_under_publicity}
            closeModal={closeModal}
            history={history}
          />
        ),
        noOk: true,
        cancelText: "Close" // okText: "ADD/REMOVE COMMUNITIES",
      });
  };

  const yesProps = {
    className: `${classes.yesLabel} ${commonClasses}`,
    onClick: () => sharedWithDialog()
  };

  //   const Wrapper = ({ children, style }) => (
  //     <Typography style={style || {}} variant="body1">
  //       {children}
  //     </Typography>
  //   );

  if (numberOfSharers === 0) {
    return <MEChip label="No" className={`${classes.noLabel} ${commonClasses}`} onClick={() => notSharedYetDialog()} />;
  }
  if (numberOfSharers === 1) return <MEChip label="Yes" {...yesProps} />;
  if (numberOfSharers > 9) {
    return <MEChip {...yesProps}>({numberOfSharers})</MEChip>;
  }
  return (
    <MEChip {...yesProps} style={{ padding: "0px 15px" }}>
      Yes(
      {numberOfSharers})
    </MEChip>
  );

  //   <Wrapper style={{ color: "rgb(65 169 65)" }}>
  //       <b>Yes({numberOfSharers})</b>
  //     </Wrapper>
};
