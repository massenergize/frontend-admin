import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { withStyles } from "@mui/styles";
import brand from "dan-api/dummy/brand";
import MUIDataTable from "mui-datatables";
import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  reduxGetAllPolicies,
  reduxGetAllCommunityPolicies,
  loadAllPolicies,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import { Typography } from "@mui/material";
import { ArrowRight, ArrowRightAlt } from "@mui/icons-material";
class AllPolicies extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), data: [] };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      this.props.callPoliciesForSuperAdmin();
    }
  }

  fashionData = (data) => {
    const fashioned = data.map((d) => [
      d.id,
      d.name,
      d.is_global ? "Template" : d.community && d.community.name,
      "" + d.is_published ? "Yes" : "No",
      d.id,
      d.key,
    ]);
    return fashioned;
  };

  getColumns = () => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
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
      name: "Community",
      key: "community",
      options: {
        filter: true,
      },
    },
    {
      name: "Is Published",
      key: "carbon",
      options: {
        filter: true,
      },
    },
    {
      name: "Actions",
      key: "actions",
      options: {
        filter: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/policy`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedPolicyResponse = await apiCall("/policies.copy", {
                  policy_id: id,
                });
                const newPolicy =
                  copiedPolicyResponse && copiedPolicyResponse.data;
                if (newPolicy) {
                  // window.location.href = `/admin/edit/${newPolicy.id}/policy`;
                  this.props.history.push(`/admin/edit/${newPolicy.id}/policy`);
                }
              }}
              to="/admin/read/policies"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    }, 
    {
      name: "Full View",
      key: "view",
      options: {
        filter: false,
        customBodyRender: (key) => (
          <div>
            <Link to={`/admin/view/policy/${key}?ct=true`}>
              <ArrowRightAlt
                size="small"
                variant="outlined"
                color="secondary"
              />
            </Link>
          </div>
        ),
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { allPolicies, putPoliciesInRedux } = this.props;
    const itemsInRedux = allPolicies;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/policies.delete", { policy_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putPoliciesInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " policy? " : " policies? "}
      </Typography>
    );
  }
  render() {
    const title = brand.name + " - All Policies";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allPolicies);
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      page: 1,
      indexColumn: "id",
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
          <MUIDataTable
            title="All Policies"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllPolicies.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allPolicies: state.getIn(["allPolicies"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callPoliciesForSuperAdmin: reduxGetAllPolicies,
      // callPoliciesForNormalAdmin: reduxGetAllCommunityPolicies,
      putPoliciesInRedux: loadAllPolicies,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const PoliciesMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllPolicies);

export default withStyles(styles)(withRouter(PoliciesMapped));
