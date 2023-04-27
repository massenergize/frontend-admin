import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxToggleUniversalModal, reduxToggleUniversalToast } from '../../../redux/redux-actions/adminActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Typography } from '@mui/material';


class AllCarbonEquivalencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  async componentDidMount() {
    const response = await apiCall("/data.carbonEquivalency.get");

    if (response && response.success) {
      const data = response.data.map((d) => [
        d.id,
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        d.value,
        d.id,
        //d.explanation,
        //d.reference,
      ]);
      await this.setStateAsync({ data, loading: false });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getColumns = () => {
    const { classes } = this.props;

    const cols = [
      {
        name: "id",
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
        name: "Value",
        key: "value",
        options: {
          filter: false,
        },
      },
      {
        name: "Edit?",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/carbon-equivalency`} target="_blank">
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
              &nbsp;&nbsp;
            </div>
          ),
        },
      },
    ];

    return cols;
  };

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " carbon equivalent ? " : " carbon equivalence? "}
      </Typography>
    );
  }
  nowDelete({ idsToDelete }) {
    let {data} = this.state
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
       apiCall("/data.carbonEquivalency.delete", { id: found }).then((response) => {
        if (response.success) {
              const rem = (data || []).filter((item) => item[0]?.toString() !== found?.toString());
              this.setState({data:rem})
          this.props.toggleToast({
            open: true,
            message: "Carbon Equivalent data successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message:
              "An error occurred while deleting the Carbon Equivalent data",
            variant: "error",
          });
        }
      });
    });

  }

  render() {
    const title = brand.name + " - All Carbon Equivalencies";
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete }),
          closeAfterConfirmation: true,
        });
        return false;
      },
    };
    if (loading) {
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
                <h1>Fetching all Carbon Equivalencie.</h1>
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
        <div className={classes.table}>
          <MUIDataTable
            title="All Carbon Equivalencies"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
    },
    dispatch
  );
}
const AllCarbonEquivalenciesMapped = connect(
  null,
  mapDispatchToProps
)(AllCarbonEquivalencies);

// export default AllActions;

AllCarbonEquivalencies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllCarbonEquivalenciesMapped);
