import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import MUIDataTable from "mui-datatables";
import CallMadeIcon from "@material-ui/icons/CallMade";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  reduxLoadAllCommunities,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import { smartString } from "../../../utils/common";
import { Typography } from "@material-ui/core";
import MEChip from "../../../components/MECustom/MEChip";

class AllCommunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(props.classes),
      loading: true,
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    var url;
    if (auth && auth.is_super_admin) url = "/communities.listForSuperAdmin";
    else if (auth && auth.is_community_admin)
      url = "/communities.listForCommunityAdmin";
    apiCall(url).then((allCommunitiesResponse) => {
      if (allCommunitiesResponse && allCommunitiesResponse.success) {
        this.props.putCommunitiesInRedux(allCommunitiesResponse.data);
      }
    });
  }

  fashionData(data) {
    return (
      data &&
      data.map((d) => [
        d.id,
        {
          id: d.id,
          image: d.logo,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
        },
        smartString(d.name), // limit to first 30 chars
        smartString(`${d.owner_name} (${d.owner_email})`, 40),
        `${
          // limit to first 20 chars
          d.is_approved ? "Verified" : "Not Verified"
        }`,
        { isLive: d.is_published && d.is_approved, item: d },
        `${
          d.is_geographically_focused
            ? "Geographically Focused"
            : "Geographically Dispersed"
        }`,
        d.id,
      ])
    );
  }
  getColumns = (classes) => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: false,
      },
    },
    {
      name: "Logo",
      key: "logo",
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image && (
              <Link to={`/admin/community/${d.id}/profile`} target="_blank">
                <Avatar
                  alt={d.initials}
                  src={d.image.url}
                  style={{ margin: 10 }}
                />
              </Link>
            )}
            {!d.image && (
              <Link to={`/admin/community/${d.id}/profile`} target="_blank">
                <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
              </Link>
            )}
          </div>
        ),
      },
    },
    {
      name: "Name",
      key: "name",
      options: {
        filter: true,
        filterType: "multiselect",
      },
    },
    {
      name: "Admin Name & Email",
      key: "admin_name_and_email",
      options: {
        filter: false,
        //filterType: "textField",
      },
    },
    {
      name: "Verification",
      key: "verification",
      options: {
        filter: true,
      },
    },
    {
      name: "Is it Live? (Published & Approved)",
      key: "is_published",
      options: {
        filter: false,
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
              label={d.isLive ? "Live" : "Not Live"}
              className={`${
                d.isLive ? classes.yesLabel : classes.noLabel
              } touchable-opacity`}
              style={{ borderRadius: 55 }}
            />
          );
        },
      },
    },
    {
      name: "Geography",
      key: "geography",
      options: {
        filter: true,
      },
    },
    {
      name: "Edit? Profile?",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/community/${id}/edit`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            <Link to={`/admin/community/${id}/profile`}>
              <CallMadeIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
          </div>
        ),
      },
    },
  ];

  makeLiveOrNot(item) {
    const putInRedux = this.props.putCommunitiesInRedux;
    const data = this.props.communities || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putInRedux([...data]);
    apiCall("/communities.update", {
      community_id: item.id,
      is_published: !status,
    });
  }
  // TODO: make this DRY in future
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

  nowDelete({ idsToDelete, data }) {
    const { communities, putCommunitiesInRedux } = this.props;
    const ids = [];
    /**
     * TODO: We should probably let the backend accept an array of items to remove instead of looping api calls....
     */
    idsToDelete.forEach((d) => {
      const communityId = data[d.dataIndex][6];
      ids.push(communityId);
      apiCall("/communities.delete", { community_id: communityId });
    });
    const rem = (communities || []).filter((com) => !ids.includes(com.id));
    putCommunitiesInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " community? " : " communities? "}
        <Typography style={{ color: "#8f0707" }}>
          <b>
            {" "}
            Please note that you will not be able to delete a community you did
            not create
          </b>
        </Typography>
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Communities";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes, toggleDeleteConfirmation } = this.props;
    const data = this.fashionData(this.props.communities || []);

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 50,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
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
            <Paper className={classes.root}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Communities. This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    const { idsToDelete } = this.state;
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
        {/* {this.renderTable(communities, classes)} */}
        <div className={classes.table}>
          <MUIDataTable
            title="All Communities"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllCommunities.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putCommunitiesInRedux: reduxLoadAllCommunities,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
    },
    dispatch
  );
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AllCommunities)
);
