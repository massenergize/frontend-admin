import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import EditIcon from "@mui/icons-material/Edit";
import { Link, withRouter } from "react-router-dom";
import TextField from "@mui/material/TextField";

import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  loadAllTestimonials,
  reduxGetAllCommunityTestimonials,
  reduxLoadMetaDataAction,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";

import {
  getHumanFriendlyDate,
  isNotEmpty,
  ourCustomSort,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import MEChip from "../../../components/MECustom/MEChip";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import {
  getAdminApiEndpoint,
  getLimit,
  handleFilterChange,
  onTableStateChange,
} from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";

class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true,
    };
  }

  componentWillUnmount() {
    window.history.replaceState({}, document.title);
  }

  componentDidMount() {
    const {
      fetchTestimonials,
      location,
      putTestimonialsInRedux,
    } = this.props;
    const { state } = location;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;
    if (!comingFromDashboard) return fetchTestimonials();
    var content = {
      fieldKey: "testimonial_ids",
      apiURL: "/testimonials.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      reduxFxn: putTestimonialsInRedux,
      args:{
        limit:getLimit(PAGE_PROPERTIES.ALL_TESTIMONIALS)
      }
    };

    this.setState({ ignoreSavedFilters: true, saveFilters: false, ids });

    fetchTestimonials((data, failed) => {
      if (failed)
        return console.log(
          "Sorry, could not load in more testimonials from B.E!"
        );
      reArrangeForAdmin({
        ...content,
        dataSource: data,
      });
    });
  }

  fashionData(data) {
    return data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.created_at, false),
      smartString(d.title), // limit to first 30 chars
      { rank: d.rank, id: d.id },
      d.community && d.community.name,
      {
        isLive: d.is_approved && d.is_published,
        is_approved: d.is_approved,
        item: d,
      },
      smartString(d.user ? d.user.full_name : "", 20), // limit to first 20 chars
      smartString((d.action && d.action.title) || "", 30),
      d.id,
      d.is_approved ? (d.is_published ? "Yes" : "No") : "Not Approved",
    ]);
  }

  getStatus = (isApproved) => {
    switch (isApproved) {
      case false:
        return messageStyles.bgError;
      case true:
        return messageStyles.bgSuccess;
      default:
        return messageStyles.bgSuccess;
    }
  };

  updateTestimonials = (data) => {
    let allTestimonials = this.props.allTestimonials;
    const index = (allTestimonials || []).findIndex(
      (a) => a.id === data.id
    );
    const updateItems = (allTestimonials || []).filter(
      (a) => a.id !== data.id
    );
    updateItems.splice(index, 0, data);
    this.props.putTestimonialsInRedux(updateItems);
  };

  getColumns() {
    const { classes } = this.props;
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect",
        },
      },
      {
        name: "Date",
        key: "date",
        options: {
          filter: false,
          filterType: "textField",
        },
      },
      {
        name: "Title",
        key: "title",
        options: {
          filter: false,
          filterType: "textField",
        },
      },
      {
        name: "Rank",
        key: "rank",
        options: {
          filter: false,
          customBodyRender: (d) =>
            d && (
              <TextField
                key={d.id}
                style={{ width: 50, textAlign: "center" }}
                required
                name="rank"
                variant="outlined"
                onBlur={async (event) => {
                  const { target, key } = event;
                  if (!target) return;
                  const { name, value } = target;
                  if (isNotEmpty(value) && value !== String(d.rank)) {
                    await apiCall("/testimonials.rank", {
                      testimonial_id: d && d.id,
                      [name]: value,
                    }).then((res) => {
                      if (res && res.success) {
                        this.updateTestimonials(res && res.data);
                      }
                    });
                  }
                }}
                label="Rank"
                InputLabelProps={{
                  shrink: true,
                  maxwidth: "10px",
                }}
                defaultValue={d && d.rank}
              />
            ),
        },
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: true,
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
                onClick={() => {
                  if (!d.item.is_approved)
                    return this.props.history.push(
                      `/admin/edit/${d.item.id}/testimonial`
                    );
                  this.props.toggleLive({
                    show: true,
                    component: this.makeLiveUI({ data: d.item }),
                    onConfirm: () => this.makeLiveOrNot(d.item),
                    closeAfterConfirmation: true,
                  });
                }}
                style={{ width: !d.is_approved ? 110 : "auto" }}
                label={
                  d.is_approved ? (d.isLive ? "Yes" : "No") : "Not Approved"
                }
                className={`${
                  d.isLive ? classes.yesLabel : classes.noLabel
                }  ${
                  !d.is_approved ? "not-approved" : ""
                } touchable-opacity`}
              />
            );
          },
        },
      },
      {
        name: "User",
        key: "user",
        options: {
          filter: false,
          filterType: "textField",
        },
      },
      {
        name: "Action",
        key: "action",
        options: {
          filter: true,
          filterType: "textField",
        },
      },
      {
        name: "Edit",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          sort: false,
          customBodyRender: (id) => (
            <div>
              <Link
                to={`/admin/edit/${id}/testimonial`}
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push({
                    pathname: `/admin/edit/${id}/testimonial`,
                    state: { ids: this.state.ids },
                  });
                }}
              >
                <EditIcon
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
        },
      },
    ];
  }

  makeLiveOrNot(item) {
    const { putTestimonialsInRedux, allTestimonials } = this.props;
    const data = allTestimonials || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putTestimonialsInRedux( [...data],);
    const community = item.community;
    apiCall("/testimonials.update", {
      testimonial_id: item.id,
      is_published: !status,
      community_id: (community && community.id) || null,
    });
  }

  makeLiveUI({ data }) {
    const name = data && data.title;
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

  nowDelete({ idsToDelete, data }) {
    const { allTestimonials, putTestimonialsInRedux } = this.props;
    const itemsInRedux = allTestimonials || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/testimonials.delete", { testimonial_id: found }).then(
        (response) => {
          if (response.success) {
            this.props.toggleToast({
              open: true,
              message: "Testimonial successfully deleted",
              variant: "success",
            });
          } else {
            this.props.toggleToast({
              open: true,
              message: "An error occurred while deleting the community",
              variant: "error",
            });
          }
        }
      );
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putTestimonialsInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " testimonial? " : " testimonials? "}
      </Typography>
    );
  }
  getTimeStamp = () => {
    const today = new Date();
    let newDate = today;
    let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return Intl.DateTimeFormat("en-US", options).format(newDate);
  };

  customSort(data, colIndex, order) {
    const isComparingLive = colIndex === 5;
    const isComparingRank = colIndex === 3;
    const sortForLive = ({ a, b }) => (a.isLive && !b.isLive ? -1 : 1);
    const sortForRank = ({ a, b }) => (a.rank < b.rank ? -1 : 1);
    var params = {
      colIndex,
      order,
    };

    if (isComparingLive) params = { ...params, compare: sortForLive };
    else if (isComparingRank) params = { ...params, compare: sortForRank };

    return data.sort((a, b) => ourCustomSort({ ...params, a, b }));
  }
  render() {
    const title = brand.name + " - All Testimonials";
    const description = brand.desc;
    const { columns, loading } = this.state;
    const {
      classes,
      allTestimonials,
      auth,
      putTestimonialsInRedux,
      meta, 
      putMetaDataToRedux
    } = this.props;
    
    const data = this.fashionData( (allTestimonials) || [] );
    const metaData = meta && meta.testimonials;
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      count: metaData && metaData.count,
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      confirmFilters: true,
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/testimonials")}
          reduxItems={allTestimonials}
          updateReduxFunction={putTestimonialsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_TESTIMONIALS}
          updateMetaData={putMetaDataToRedux}
          name="testimonials"
          meta={meta}
        />
      ),
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableData: data,
          metaData,
          tableState,
          updateReduxFunction: putTestimonialsInRedux,
          reduxItems: allTestimonials,
          apiUrl: getAdminApiEndpoint(auth, "/testimonials"),
          pageProp: PAGE_PROPERTIES.ALL_TESTIMONIALS,
          updateMetaData: putMetaDataToRedux,
          name: "testimonials",
          meta: meta,
        }),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/testimonials")}
            reduxItems={allTestimonials}
            updateReduxFunction={putTestimonialsInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_TESTIMONIALS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="testimonials"
            meta={meta}
          />
        );
      },
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
          page: PAGE_PROPERTIES.ALL_TESTIMONIALS,
          updateReduxFunction: putTestimonialsInRedux,
          reduxItems: allTestimonials,
          url: getAdminApiEndpoint(auth, "/testimonials"),
          updateMetaData: putMetaDataToRedux,
          name: "testimonials",
          meta: meta,
        }),
      customSort: this.customSort,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
        return false;
      },
      downloadOptions: {
        filename: `All Testimonials (${this.getTimeStamp()}).csv`,
        separator: ",",
      },
      onDownload: (buildHead, buildBody, columns, data) => {
        let alteredData = data.map((d) => {
          let content = [...d.data];
          content[3] = d.data[3].rank;
          return {
            data: content,
            index: d.index,
          };
        });
        let csv = buildHead(columns) + buildBody(alteredData);
        return csv;
      },
    };

    if (!data || data === null) {
      return (
        <Grid
          container
          spacing={24}
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={12} md={8}>
            <Paper className={classes.root} style={{ padding: 15 }}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Testimonials. This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

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
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_TESTIMONIALS}
          tableProps={{
            title: "All Testimonials",
            data: data,
            columns: columns,
            options: options,
          }}
          customFilterObject={{
            0: {
              list: this.state.ids,
            },
          }}
          ignoreSavedFilters={this.state.ignoreSavedFilters}
          saveFilters={this.state.saveFilters}
        />
      </div>
    );
  }
}

AllTestimonials.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allTestimonials: state.getIn(["allTestimonials"]),
    community: state.getIn(["selected_community"]),
    meta: state.getIn(["paginationMetaData"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchTestimonials: reduxGetAllCommunityTestimonials,
      putTestimonialsInRedux: loadAllTestimonials,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
}
const TestimonialsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllTestimonials));

export default withStyles(styles)(TestimonialsMapped);
