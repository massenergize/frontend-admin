import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

import MUIDataTable from 'mui-datatables';
import CallMadeIcon from '@material-ui/icons/CallMade';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllTagCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: false, columns: this.getColumns() };
  }

  async componentDidMount() {
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');

    if (tagCollectionsResponse && tagCollectionsResponse.success) {
      const data = tagCollectionsResponse.data.map(d => (
        [
          d.id,
          `${d.name}...`.substring(0, 30), // limit to first 30 chars
          d.rank,
          d.tags,
          d.id
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
          filter: true,
        }
      },
      {
        name: 'Rank',
        key: 'rank',
        options: {
          filter: true,
        }
      },
      {
        name: 'Tags',
        key: 'tags',
        options: {
          filter: false,
          customBodyRender: (tags) => (
            <div className={classes.taskStatus}>
              <Icon className={classes.taskIcon}>blur_on</Icon>
              {tags.map(t => (
                <Typography key={t.id} variant="caption">
                  { t.name }
              ,&nbsp;&nbsp;
                </Typography>
              ))}
            </div>
          )
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
              <Link to={`/admin/edit/${id}/tag-collection`}>
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
    const title = brand.name + ' - All Tag Collections';
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;
    console.log(data)
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const tagCollectionId = data[d.index][0];
          apiCall('/tag_collections.delete', { tag_collection_id: tagCollectionId });
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
                <h1>Fetching all Tag Collections.  This may take a while...</h1>
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
            title="All Tag Collections"
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

AllTagCollections.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllTagCollections);
