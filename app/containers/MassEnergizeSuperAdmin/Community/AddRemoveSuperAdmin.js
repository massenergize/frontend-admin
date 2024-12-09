import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MUIDataTable from "mui-datatables";
import Avatar from "@mui/material/Avatar";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { reduxLoadSuperAdmins } from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS, LOADING } from '../../../utils/constants';
import Seo from "../../../components/Seo/Seo";
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
    margin: theme.spacing(4),
    textAlign: "center",
  },
});

const fetchSadmins = async ({ reduxFunction }) => {
  const superAdminResponse = await apiCall("/admins.super.list", {
    limit: 50,
  });
  if (
    !superAdminResponse ||
    !superAdminResponse.success ||
    !superAdminResponse.data
  )
    return reduxFunction([]);
  const data = superAdminResponse.data;
  reduxFunction(data);
};
class AddRemoveSuperAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      data: [],
      columns: this.getColumns(),
    };
  }

  componentDidMount(){
    const { sadmins, putSadminsInRedux } = this.props;
    fetchSadmins({ reduxFunction: putSadminsInRedux });
  }

  static getDerivedStateFromProps(props, state) {
    const { sadmins, putSadminsInRedux } = props;

    if (sadmins === LOADING)
      return fetchSadmins({ reduxFunction: putSadminsInRedux });

    if (state.mounted) return null;

    return {
      formJson: createFormJson(),
      mounted: true,
    };
  }

  getColumns = () => [
    {
      name: "Image",
      key: "id",
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
  ];

  fashionData = ({ data }) => {
    if (!data || data === LOADING) return [];
    return data.map((d) => [
      {
        id: d.id,
        image: d.profile_picture,
        initials: `${d?.preferred_name?.substring(0, 2)?.toUpperCase()}`,
      },
      d.full_name,
      d.preferred_name,
      d.email, // limit to first 20 chars
    ]);
  };

  whenRequestIsCompleted(data, successful, resetForm) {
    if (!successful || !data) return;
    const { putSadminsInRedux, sadmins } = this.props;
    putSadminsInRedux([data, ...sadmins]);
    resetForm && resetForm();
  }

  render() {
    const { classes, sadmins } = this.props;
    const { formJson, columns } = this.state;
    const data = this.fashionData({ data: sadmins });

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const { pathname } = window.location;
        idsToDelete.forEach(async (d) => {
          const userId = data[d.dataIndex][0].id;
          await apiCall("/admins.super.remove", { user_id: userId });
          window.location.href = pathname;
        });
      },
    };
    if (!formJson) return <Loading />;
    return (
      <div>
        <Seo name={"Super Admins"}/>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          onComplete={this.whenRequestIsCompleted.bind(this)}
        />
        <br />
        <br />
        <div className={classes.table}>
          <MUIDataTable
            title="All Super Admins"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AddRemoveSuperAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    sadmins: state.getIn(["sadmins"]),
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putSadminsInRedux: reduxLoadSuperAdmins,
    },
    dispatch
  );
};

const Wrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRemoveSuperAdmin);

export default withStyles(styles, { withTheme: true })(Wrapped);

const createFormJson = () => {
  const { pathname } = window.location;
  const formJson = {
    title: "Add New Super Admin",
    subTitle: "",
    method: "/admins.super.add",
    successRedirectPage: pathname,
    fields: [
      {
        label: "About this Admin",
        fieldType: "Section",
        children: [
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
