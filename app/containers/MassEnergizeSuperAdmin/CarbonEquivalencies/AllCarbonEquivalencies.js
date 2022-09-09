import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllCarbonEquivalencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  async componentDidMount() {
    const response = await apiCall('/data.carbonEquivalency.get');

    if (response && response.success) {
      const data = response.data.map(d => (
        [
          d.id,
          `${d.name}...`.substring(0, 30), // limit to first 30 chars
          d.value,
          d.id,
          //d.explanation,
          //d.reference,
        ]
      ));
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
        name: 'id',
        key: 'id',
        options: {
          filter: false
        }
      },
      {
        name: 'Name',
        key: 'name',
        options: {
          filter: false,
        }
      },
      {
        name: 'Value',
        key: 'value',
        options: {
          filter: false,
        }
      },
      {
        name: 'Edit?',
        key: 'edit_or_copy',
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
          )
        }
      },
    ];

    return cols;
  }


  render() {
    const title = brand.name + ' - All Carbon Equivalencies';
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const rowId = data[d.dataIndex][0];
          apiCall('/data.carbonEquivalency.delete', { id: rowId });
        });
      }
    };
    if (loading) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
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

// export default AllActions;

AllCarbonEquivalencies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllCarbonEquivalencies);
