import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import { Link, withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  loadAllTestimonials,
  reduxGetAllCommunityTestimonials,
  reduxGetAllTestimonials,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";

import {
  getHumanFriendlyDate,
  isNotEmpty,
  smartString,
} from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@material-ui/core";
import MEChip from "../../../components/MECustom/MEChip";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";

class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true,
    };
  }

  componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      this.props.callTestimonialsForSuperAdmin();
    }
    if (user.is_community_admin) {
      const com = this.props.community
        ? this.props.community
        : user.admin_at[0];
      if (com) {
        this.props.callTestimonialsForNormalAdmin(com.id);
      }
    }
  }

  fashionData = (data) => {
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
  };

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
    const index = (allTestimonials.items||[]).findIndex((a) => a.id === data.id);
    const updateItems = (
      (allTestimonials.items) ||
      []
    ).filter((a) => a.id !== data.id);
    updateItems.splice(index, 0, data);
    this.props.putTestimonialsInRedux({
      items: updateItems,
      meta:allTestimonials.meta
    });
  };

  getColumns = () => {
    const { classes } = this.props;
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
                className={`${d.isLive ? classes.yesLabel : classes.noLabel}  ${
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
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/testimonial`}>
                <EditIcon size="small" variant="outlined" color="secondary" />
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
  };

  makeLiveOrNot(item) {
    const {putTestimonialsInRedux, allTestimonials} = this.props
    const data = allTestimonials.items || []
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putTestimonialsInRedux({
      items: [...data],
      meta:allTestimonials.meta
    });
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
    const itemsInRedux = allTestimonials.items||[];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/testimonials.delete", { testimonial_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putTestimonialsInRedux({
      items: rem,
      meta: allTestimonials.meta,
    });
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
  callMoreData = (page) => {
    let { auth, putTestimonialsInRedux } = this.props;
    var url;
    if (auth.is_super_admin) url = "/testimonials.listForSuperAdmin";
    else if (auth.is_community_admin) url = "/testimonials.listForCommunityAdmin";
    apiCall(url, {
      page: page,
    }).then((res) => {
      if (res.success) {
        let existing = [...this.props.allTestimonials.items];
        let newList = existing.concat(res.data.items);
        putTestimonialsInRedux({
          items: newList,
          meta: res.data.meta,
        });
      }
    });
  };

  render() {
    const title = brand.name + " - All Testimonials";
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes, allTestimonials } = this.props;
    const data = this.fashionData(
      (allTestimonials && allTestimonials.items) || []
    );
    const metaData = allTestimonials.meta;
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      count: metaData && metaData.count,
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onTableChange: (action, tableState) => {
        if (action === "changePage") {
          if (tableState.rowsPerPage * tableState.page === data.length) {
            this.callMoreData(metaData.next);
          }
        }
      },
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
      customSort: (data, colIndex, order) => {
        return data.sort((a, b) => {
          if (colIndex === 3) {
            return (
              (a.data[colIndex].rank < b.data[colIndex].rank ? -1 : 1) *
              (order === "desc" ? 1 : -1)
            );
          } else {
            return (
              (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
              (order === "desc" ? 1 : -1)
            );
          }
        });
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callTestimonialsForSuperAdmin: reduxGetAllTestimonials,
      callTestimonialsForNormalAdmin: reduxGetAllCommunityTestimonials,
      putTestimonialsInRedux: loadAllTestimonials,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const TestimonialsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllTestimonials));

export default withStyles(styles)(TestimonialsMapped);
