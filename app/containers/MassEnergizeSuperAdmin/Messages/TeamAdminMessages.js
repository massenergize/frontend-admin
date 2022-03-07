import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import DetailsIcon from "@material-ui/icons/Details";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { Chip } from "@material-ui/core";
import { loadTeamMessages } from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
class AllTeamAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: this.getColumns(props.classes),
    };
  }

  async componentDidMount() {
    const allMessagesResponse = await apiCall(
      "/messages.listTeamAdminMessages"
    );
    if (allMessagesResponse && allMessagesResponse.success) {
      this.props.putTeamMessagesInRedux(allMessagesResponse.data);
    } else this.setState({ loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
  };

  fashionData = (data) => {
    return data.map((d) => [
      getHumanFriendlyDate(d.created_at, true),
      smartString(d.title),
      d.user_name || (d.user && d.user.full_name) || "",
      d.email || (d.user && d.user.email),
      d.community && d.community.name,
      d.team && d.team.name,
      d.have_forwarded,
      d.id
    ]);
  };

  getColumns = (classes) => [
    {
      name: "Date",
      key: "date",
      options: {
        filter: true,
      },
    },
    {
      name: "Title",
      key: "title",
      options: {
        filter: true,
      },
    },
    {
      name: "Provided Name",
      key: "user_name",
      options: {
        filter: true,
        filterType: "textField",
      },
    },
    {
      name: "Provided Email",
      key: "email",
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
      name: "Team",
      key: "team",
      options: {
        filter: true,
        filterType: "multiselect",
      },
    },
    {
      name: "Forwarded to Team Admin?",
      key: "replied?",
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
      name: "Details",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/message`}>
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    },
  ];

  render() {
    const title = brand.name + " - Team Admin Messages";
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.teamMessages);
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 50,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach((d) => {
          const messageId = data[d.dataIndex][0];
          apiCall("/messages.delete", { message_id: messageId });
        });
      },
    };

    if (loading && (!data || !data.length)) {
      return <LinearBuffer />;
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
        <div className={classes.table}>
          <MUIDataTable
            title="All Team Admin Messages"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllTeamAdminMessages.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    teamMessages: state.getIn(["teamMessages"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putTeamMessagesInRedux: loadTeamMessages,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTeamAdminMessages);

export default withStyles(styles)(VendorsMapped);
