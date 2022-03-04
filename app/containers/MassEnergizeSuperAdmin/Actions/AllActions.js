/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { withStyles } from "@material-ui/core/styles";

import MUIDataTable from "mui-datatables";
import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllActions,
  reduxGetAllCommunityActions,
  loadAllActions,
} from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { isNotEmpty, smartString } from "../../../utils/common";
import { Chip } from "@material-ui/core";

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true,
      allActions: [],
      data: [],
      error: null,
    };
  }

  async componentDidMount() {
    const { putActionsInRedux } = this.props;
    const allActionsResponse = await apiCall("/actions.listForCommunityAdmin");
    if (allActionsResponse && allActionsResponse.success) {
      putActionsInRedux(allActionsResponse.data);
    } else if (allActionsResponse && !allActionsResponse.success) {
      await this.setStateAsync({
        loading: false,
        error: allActionsResponse.error,
      });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  changeActions = async (id) => {
    const { allActions } = this.state;
    const newData = allActions.filter(
      (a) => (a.community && a.community.id === id) || a.is_global
    );
    await this.setStateAsync({ data: fashionData(newData) });
  };

  getColumns = () => {
    const { classes } = this.props;
    return [
      {
        name: "Image",
        key: "image",
        options: {
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
          customBodyRender: (d) => {
            return (
              d && (
                <TextField
                  style={{ width: 50, textAlign: "center" }}
                  key={d.id}
                  required
                  name="rank"
                  variant="outlined"
                  onChange={async (event) => {
                    const { target } = event;
                    if (!target) return;
                    const { name, value } = target;
                    if (isNotEmpty(value) && value !== String(d.rank)) {
                      await apiCall("/actions.rank", {
                        action_id: d && d.id,
                        [name]: value,
                      });
                    }
                  }}
                  label="Rank"
                  InputLabelProps={{
                    shrink: true,
                    maxwidth: "10px",
                  }}
                  defaultValue={d.rank}
                />
              )
            );
          },
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
          filter: true,
          customBodyRender: (d) => {
            return (
              <Chip
                label={d ? "Yes" : "No"}
                className={d ? classes.yesLabel : classes.noLabel}
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
              <Link to={`/admin/edit/${id}/action`} target="_blank">
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
              &nbsp;&nbsp;
              <Link
                onClick={async () => {
                  const copiedActionResponse = await apiCall("/actions.copy", {
                    action_id: id,
                  });
                  if (copiedActionResponse && copiedActionResponse.success) {
                    const newAction =
                      copiedActionResponse && copiedActionResponse.data;
                    window.location.href = `/admin/edit/${newAction.id}/action`;
                  }
                }}
                to="/admin/read/actions"
              >
                <FileCopy size="small" variant="outlined" color="secondary" />
              </Link>
            </div>
          ),
        },
      },
    ];
  };
  fashionData = (data) => {
    const fashioned = data.map((d) => [
      // d.id,
      {
        id: d.id,
        image: d.image,
        initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.title), // limit to first 30 chars
      { rank: d.rank, id: d.id },
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)} `,
      d.is_global ? "Template" : d.community && d.community.name,
      d.is_published,
      d.id,
    ]);
    return fashioned;
  };

  render() {
    const title = brand.name + " - All Actions";
    const description = brand.desc;
    const { classes } = this.props;
    const { columns, loading, error } = this.state;
    const { allActions } = this.props;
    const data = this.fashionData(this.props.allActions);
    if (loading && (!data || !data.length)) {
      return <LinearBuffer />;
    }
    if (error) {
      return (
        <div>
          <h2>Error</h2>
        </div>
      );
    }

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 15,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(async (d) => {
          const actionId = data[d.dataIndex][0];
          await apiCall("/actions.delete", { action_id: actionId });
        });
      },
    };
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
        <div className={classes.table}>
          {/* {this.showCommunitySwitch()} */}
          <MUIDataTable
            title="All Actions"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllActions.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  allActions: state.getIn(["allActions"]),
  community: state.getIn(["selected_community"]),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callAllActions: reduxGetAllActions,
      callCommunityActions: reduxGetAllCommunityActions,
      putActionsInRedux: loadAllActions,
    },
    dispatch
  );
const ActionsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllActions);
export default withStyles(styles)(ActionsMapped);
