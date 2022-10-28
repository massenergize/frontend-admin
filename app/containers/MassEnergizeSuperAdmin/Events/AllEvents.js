import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import MUIDataTable from "mui-datatables";
import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllEvents,
  reduxGetAllCommunityEvents,
  loadAllEvents,
  reduxToggleUniversalModal,
  reduxLoadAllOtherEvents,
  reduxSaveOtherEventState,
} from "../../../redux/redux-actions/adminActions";
import {
  findMatchesAndRest,
  getHumanFriendlyDate,
  getTimeStamp,
  makeDeleteUI,
  ourCustomSort,
  smartString,
} from "../../../utils/common";
import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Tabs,
  Typography,
} from "@material-ui/core";
import MEChip from "../../../components/MECustom/MEChip";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { concat } from "lodash";
import { Tab } from "@material-ui/core";
import EventsFromOtherCommunities from "./EventsFromOtherCommunities";
import CallMadeIcon from "@material-ui/icons/CallMade";
class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), loading: false, currentTab: 0 };
  }

  componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    const community = this.props.community ? this.props.community : {};
    if (user.is_super_admin) {
      this.props.callForSuperAdminEvents();
    }
    if (user.is_community_admin) {
      let com = community || user.admin_at[0];
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
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
      d.rank,
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d.is_global ? "Template" : d.community && d.community.name,
      { isLive: d.is_published, item: d },
      d.id,
      d.is_published ? "Yes" : "No",
      d.is_global,
      getHumanFriendlyDate(d.start_date_and_time, true, false),
      getHumanFriendlyDate(d.end_date_and_time, true, false),
    ]);
    return fashioned;
  }

  getColumns() {
    const { classes, putEventsInRedux, allEvents } = this.props;
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Date",
        key: "date",
        options: {
          filter: false,
          download: false,
        },
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
              {d.image && (
                <Avatar
                  alt={d.initials}
                  src={d.image.url}
                  style={{ margin: 10 }}
                />
              )}
              {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
            </div>
          ),
        },
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
        },
      },
      {
        name: "Rank",
        key: "rank",
        options: {
          filter: false,
        },
      },
      {
        name: "Tags",
        key: "tags",
        options: {
          filter: true,
          filterType: "textField",
        },
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: true,
          filterType: "multiselect",
        },
      },
      {
        name: "Live?",
        key: "is_live",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => {
            return (
              <MEChip
                onClick={() =>
                  this.props.toggleLive({
                    show: true,
                    component: this.makeLiveUI({ data: d.item }),
                    onConfirm: () => this.makeLiveOrNot(d.item),
                    closeAfterConfirmation: true,
                  })
                }
                label={d.isLive ? "Yes" : "No"}
                className={`${
                  d.isLive ? classes.yesLabel : classes.noLabel
                } touchable-opacity`}
              />
            );
          },
        },
      },
      {
        name: "Edit",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/event`}>
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
              &nbsp;&nbsp;
              <Link
                onClick={async () => {
                  const copiedEventResponse = await apiCall("/events.copy", {
                    event_id: id,
                  });
                  if (copiedEventResponse && copiedEventResponse.success) {
                    const newEvent =
                      copiedEventResponse && copiedEventResponse.data;
                    this.props.history.push(`/admin/edit/${newEvent.id}/event`);
                    putEventsInRedux([newEvent, ...(allEvents || [])]);
                  }
                }}
                to="/admin/read/events"
              >
                <FileCopy size="small" variant="outlined" color="secondary" />
              </Link>
              <Link to={`/admin/read/event/${id}/event-view?from=main`}>
                <CallMadeIcon
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              </Link>
            </div>
          ),
        },
      },
      {
        name: "Live",
        key: "hidden_live_or_not",
        options: {
          display: false,
          filter: true,
          searchable: false,
          download: true,
          sort: false,
        },
      },
      {
        name: "Live",
        key: "is_a_template",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: false,
        },
      },
      {
        name: "Start Date",
        key: "hidden_start_date",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true,
        },
      },
      {
        name: "End Date",
        key: "hidden_end_Date",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true,
        },
      },
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
    const community = item.community;
    apiCall("/events.update", {
      event_id: item.id,
      is_published: !status,
      name: item.name,
      community_id: (community && community.id) || null,
    });
  }

  makeLiveUI({ data }) {
    const name = data && data.name;
    const isON = data.is_published;
    return (
      <div>
        <Typography>
          <b>{name}</b> is {isON ? "live, " : "not live, "}
          would you like {isON ? " to take it offline" : " to take it live"}?
        </Typography>
      </div>
    );
  }

  customSort(data, colIndex, order) {
    const isComparingLive = colIndex === 7;
    const sortForLive = ({ a, b }) => (a.isLive && !b.isLive ? -1 : 1);
    var params = {
      colIndex,
      order,
      compare: isComparingLive && sortForLive,
    };
    return data.sort((a, b) => ourCustomSort({ ...params, a, b }));
  }

  nowDelete({ idsToDelete, data }) {
    const { allEvents, putEventsInRedux } = this.props;
    const itemsInRedux = allEvents;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/events.delete", { event_id: found });
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
    const title = brand.name + " - All Events";
    const description = brand.desc;
    const { columns, currentTab } = this.state;
    const {
      classes,
      putOtherEventsInRedux,
      otherCommunities,
      otherEvents,
      otherEventsState,
      putEventsStateInRedux,
      auth,
    } = this.props;
    const data = this.fashionData(this.props.allEvents || []);
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 25,
      customSort: this.customSort,
      rowsPerPageOptions: [10, 25, 100],
      downloadOptions: {
        filename: `All Events (${getTimeStamp()}).csv`,
        separator: ",",
      },
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const [found] = findMatchesAndRest(idsToDelete, (it) => {
          const f = data[it.dataIndex];
          return f[10]; // this index should be changed if anyone modifies (adds/removes) an item in fashioData()
        });
        const noTemplatesSelectedGoAhead = !found || !found.length;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: makeDeleteUI({
            idsToDelete,
            templates: found,
            noTemplates: noTemplatesSelectedGoAhead,
          }),
          onConfirm: () =>
            noTemplatesSelectedGoAhead && this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
          cancelText: noTemplatesSelectedGoAhead
            ? "No"
            : "Go Back and Remove Templates",
          noOk: !noTemplatesSelectedGoAhead,
        });
        return false;
      },
    };

    if (!data || !data.length) {
      return (
        <Grid
          container
          spacing={24}
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={12} md={6}>
            <Paper className={classes.root} style={{ padding: 15 }}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Events. This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    const tabs = {
      0: (
        <EventsFromYourCommunities
          classes={classes}
          page={PAGE_PROPERTIES.ALL_EVENTS}
          tableProps={{
            title: "All Events",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      ),
      1: (
        <EventsFromOtherCommunities
          putOtherEventsInRedux={putOtherEventsInRedux}
          otherCommunities={otherCommunities}
          classes={classes}
          otherEvents={otherEvents}
          state={otherEventsState}
          putStateInRedux={putEventsStateInRedux}
        />
      ),
    };

    const activeComponent = tabs[currentTab];

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Paper style={{ marginBottom: 10 }}>
          {/*  Only Show tabs when user is a cadmin. Sadmins already see everything */}
          {!(auth && auth.is_super_admin) && (
            <Tabs
              onChange={(_, v) => this.setState({ currentTab: v })}
              value={currentTab}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="From Your Communities" key={0} />

              <Tab label="Other Communities" key={1} />
            </Tabs>
          )}
        </Paper>
        {activeComponent}
      </div>
    );
  }
}

AllEvents.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allEvents: state.getIn(["allEvents"]),
    community: state.getIn(["selected_community"]),
    otherCommunities: state.getIn(["otherCommunities"]),
    otherEvents: state.getIn(["otherEvents"]),
    otherEventsState: state.getIn(["otherEventsState"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callForSuperAdminEvents: reduxGetAllEvents,
      callForNormalAdminEvents: reduxGetAllCommunityEvents,
      putEventsInRedux: loadAllEvents,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
      putOtherEventsInRedux: reduxLoadAllOtherEvents,
      putEventsStateInRedux: reduxSaveOtherEventState,
    },
    dispatch
  );
}

const EventsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllEvents);
export default withStyles(styles)(withRouter(EventsMapped));

const EventsFromYourCommunities = (props) => {
  return <METable {...props} />;
};
