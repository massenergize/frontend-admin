import React, { Component } from "react";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import CallMadeIcon from "@material-ui/icons/CallMade";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxLoadAdmins } from "../../../redux/redux-actions/adminActions";
import { LOADING } from "../../../utils/constants";
import Loading from "dan-components/Loading";
import MEChip from "../../../components/MECustom/MEChip";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: "center",
  },
});

const fetchAdmins = async ({ id, reduxFunction, admins }) => {
  admins = admins === LOADING ? [] : admins;
  const response = await apiCall("/admins.community.list", {
    community_id: id,
  });
  if (!response || !response.data) return reduxFunction({});
 
  const content = [...(response.data.members || [])];
  reduxFunction({ ...(admins || {}), [id]: content });
};

class AddRemoveAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formJson: null,
      columns: this.getColumns(),
      community: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { admins, putAdminsInRedux, communities } = props;
    const { id } = props.match.params;
    const firstTime = admins === LOADING;
    const notFirstTimeButNeedToFetchAdminsForDifferentCommunity =
      (admins || {})[id] === undefined;

    if (firstTime || notFirstTimeButNeedToFetchAdminsForDifferentCommunity)
      return fetchAdmins({ id, reduxFunction: putAdminsInRedux, admins });

    const loadedRequirements = communities && communities.length;
    if (!loadedRequirements || state.mounted) return null;
    const community = (communities || []).find(
      (c) => c.id.toString() === id.toString()
    );

    const formJson = createFormJson({ community });
    return {
      mounted: true,
      formJson,
      community,
    };
  }

  fashionData({ data, admins }) {
    if (!data || !admins || admins === LOADING) return [];

    return (data || []).map((d) => [
      {
        id: d.email,
        image: d.profile_picture,
        initials: `${d.preferred_name &&
          d.preferred_name.substring(0, 2).toUpperCase()}`,
      },
      d.full_name,
      d.preferred_name,
      d.email,
      d.isPending || !d.accepts_terms_and_conditions,
    ]);
  }

  getColumns = () => [
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
      name: "Name",
      key: "name",
      options: {
        filter: false,
      },
    },
    {
      name: "Preferred Name",
      key: "preferred_name",
      options: {
        filter: false,
      },
    },
    {
      name: "Email",
      key: "email",
      options: {
        filter: false,
      },
    },
    {
      name: "Status",
      key: "status",
      options: {
        filter: false,
        customBodyRender: (notAccepted) => {
          const style = {
            fontWeight: "bold",
            color: "white",
            background: "rgb(65 169 65)",
          };
          return (
            <MEChip
              label={notAccepted ? "Pending" : "Accepted"}
              style={notAccepted ? { ...style, background: "#f09b00" } : style}
            />
          );
        },
      },
    },
  ];

  whenRequestIsCompleted(data, successfull, resetForm) {
    if (!successfull || !data) return;
    const { putAdminsInRedux, admins } = this.props;
    const { id } = this.props.match.params;
    const old = (admins || {})[id] || [];
    putAdminsInRedux({ ...admins, [id]: [data.user, ...old] });
    resetForm && resetForm({ formData: { community_id: id } });
  }
  render() {
    const { classes, admins } = this.props;
    const { formJson, columns, community } = this.state;
    const { id } = this.props.match.params;
    const content = (admins || {})[id] || [];
    const data = this.fashionData({ data: content, admins });
    if (!formJson) return <Loading />;

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const { pathname } = window.location;
        idsToDelete.forEach(async (d) => {
          const email = data[d.dataIndex][0].id;
          await apiCall("/admins.community.remove", {
            email,
            community_id: community.id,
          });
          window.location.href = pathname;
        });
      },
    };

    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          onComplete={this.whenRequestIsCompleted.bind(this)}
        />
        <br />
        <br />
        <div className={classes.table}>
          <MUIDataTable
            title={`Community Admins ${community && " In " + community.name}`}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AddRemoveAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    admins: state.getIn(["admins"]),
    communities: state.getIn(["communities"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putAdminsInRedux: reduxLoadAdmins,
    },
    dispatch
  );
};
const Wrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRemoveAdmin);

export default withStyles(styles, { withTheme: true })(Wrapped);

const createFormJson = ({ community }) => {
  const { pathname } = window.location;
  const formJson = {
    title: `Add New Administrator for ${
      community ? community.name : "this Community"
    }`,
    subTitle: "",
    method: "/admins.community.add",
    successRedirectPage: pathname,
    fields: [
      {
        label: "About this Admin",
        fieldType: "Section",
        children: [
          {
            name: "community_id",
            label: "Community ID",
            placeholder: "eg. 67",
            fieldType: "TextField",
            contentType: "text",
            defaultValue: community && community.id,
            dbName: "community_id",
            readOnly: true,
          },
          {
            name: "name",
            label: "Name",
            placeholder: "eg. Grace Tsu",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "name",
            readOnly: false,
          },
          {
            name: "email",
            label: "Email",
            placeholder: "eg. johny.appleseed@gmail.com",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "email",
            readOnly: false,
          },
        ],
      },
    ],
  };
  return formJson;
};
