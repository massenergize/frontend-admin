import React from 'react';
import PropTypes from 'prop-types';

import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      data: [],
      loading: true
    };
  }

  async componentDidMount() {
    const allActionsResponse = await apiCall('/actions.listForSuperAdmin');

    if (allActionsResponse && allActionsResponse.success) {
      const data = allActionsResponse.data.map(d => (
        [
          {
            id: d.id,
            image: d.image,
            initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`
          },
          `${d.title}...`.substring(0, 30), // limit to first 30 chars
          `${d.about}...`.substring(0, 20), // limit to first 20 chars
          `${d.tags.map(t => t.name).join(', ')} `,
          d.community && d.community.name,
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

  getColumns = () => [
    {
      name: 'Action',
      key: 'action',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />
            }
            {!d.image
              && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
            }
          </div>
        )
      }
    },
    {
      name: 'Title',
      key: 'title',
      options: {
        filter: true,
      }
    },
    {
      name: 'About',
      key: 'about',
      options: {
        filter: false,
      }
    },
    {
      name: 'Tags',
      key: 'tags',
      options: {
        filter: true,
      }
    },
    {
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
      }
    },
    {
      name: 'Edit? Copy?',
      key: 'edit_or_copy',
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/action`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedActionResponse = await apiCall('/actions.copy', { action_id: id });
                if (copiedActionResponse && copiedActionResponse.success) {
                  const newAction = copiedActionResponse && copiedActionResponse.data;
                  window.location.href = `/admin/edit/${newAction.id}/action`;
                }
              }}
              to="/admin/read/actions"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]


  render() {
    const title = brand.name + ' - All Actions';
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const actionId = data[d.index][0].id;
          apiCall('/actions.delete', { action_id: actionId });
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
                <h1>Fetching all Actions.  This may take a while...</h1>
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

export default withStyles(styles)(AllActions);
