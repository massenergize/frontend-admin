import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Avatar from "@material-ui/core/Avatar";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";

// import { bindActionCreators } from "redux";
// import { connect } from "react-redux";
// import { reduxLoadSuperAdmins } from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
// import { LOADING } from "../../../utils/constants";
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

const fetchSadmins = async ({ reduxFunction }) => {
  const superAdminResponse = await apiCall("/admins.super.list");
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
      meta: {},
    };
  }
    setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  async componentDidMount() {
    const superAdminResponse = await apiCall("/admins.super.list");
    if ( superAdminResponse &&superAdminResponse.data && superAdminResponse.data.items) {
      const data = prepareTableData(superAdminResponse.data.items);
      const meta = superAdminResponse.data.meta;
      await this.setStateAsync({ data, meta });
    }

    if (state.mounted) return null;


  // createFormJson = async () => {
  //   const { pathname } = window.location;
  //   const formJson = {
  //     title: "Add New Super Admin",
  //     subTitle: "",
  //     method: "/admins.super.add",
  //     successRedirectPage: pathname,
  //     fields: [
  //       {
  //         label: "About this Admin",
  //         fieldType: "Section",
  //         children: [
  //           {
  //             name: "name",
  //             label: "Name",
  //             placeholder: "eg. Grace Tsu",
  //             fieldType: "TextField",
  //             contentType: "text",
  //             isRequired: true,
  //             defaultValue: "",
  //             dbName: "name",
  //             readOnly: false,
  //           },
  //           {
  //             name: "email",
  //             label: "Email",
  //             placeholder: "eg. johny.appleseed@gmail.com",
  //             fieldType: "TextField",
  //             contentType: "text",
  //             isRequired: true,
  //             defaultValue: "",
  //             dbName: "email",
  //             readOnly: false,
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //   return formJson;
  // };
  //   return {
  //     formJson: createFormJson(),
  //     mounted: true,
  //   };
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

  callMoreData = (page) => {
    let { data } = this.state;
    var url = "/admins.super.list";
    apiCall(url, {
      page: page,
    }).then((res) => {
      if (res && res.data) {
        let existing = [...data];
        const preparedData = prepareTableData(res.data.items);
        let newList = existing.concat(preparedData);
        const meta = res.data.meta;
        this.setState({
          data: newList,
          meta: meta,
        });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { formJson, data, columns, meta } = this.state;
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 25,
      count: meta.count,
      rowsPerPageOptions: [10, 25, 100],
      onTableChange: (action, tableState) => {
        if (action === "changePage") {
          if (tableState.rowsPerPage * tableState.page === data.length) {
            this.callMoreData(meta.next);
          }
        }
      },
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
