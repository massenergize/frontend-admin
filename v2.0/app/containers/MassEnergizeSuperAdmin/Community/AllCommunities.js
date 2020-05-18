import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

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


class AllCommunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      data: [],
      loading: true
    };
  }

  async componentDidMount() {
    const allCommunitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (allCommunitiesResponse && allCommunitiesResponse.success) {
      const data = allCommunitiesResponse.data.map(d => (
        [
          d.id,
          {
            id: d.id,
            image: d.logo,
            initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
          },
          `${d.name}...`.substring(0, 30), // limit to first 30 chars
          `${d.owner_name}(${d.owner_email})...`.substring(0, 20), // limit to first 20 chars
          `${d.is_approved ? 'Verified' : 'Not Verified'}`,
          `${d.is_published && d.is_approved ? 'Live' : 'Not Live'}`,
          `${d.is_geographically_focused ? 'Geographically Focused' : 'Geographically Dispersed'}`,
          d.id
        ]
      ));
      await this.setStateAsync({ data, loading: false });
    // await this.setStateAsync({ communities: response.data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  getColumns = () => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Logo',
      key: 'logo',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Link to={`/admin/community/${d.id}/profile`} target="_blank"><Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} /></Link>
            }
            {!d.image
              && <Link to={`/admin/community/${d.id}/profile`} target="_blank"><Avatar style={{ margin: 10 }}>{d.initials}</Avatar></Link>
            }
          </div>
        )
      }
    },
    {
      name: 'Name',
      key: 'name',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Admin Name & Email',
      key: 'admin_name_and_email',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Verification',
      key: 'verification',
      options: {
        filter: true,
      }
    },
    {
      name: 'Is it Live? (Published & Approved)',
      key: 'is_published',
      options: {
        filter: true,
      }
    },
    {
      name: 'Geography',
      key: 'is_published',
      options: {
        filter: true,
      }
    },
    {
      name: 'Edit? Profile?',
      key: 'edit_or_copy',
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
        )
      }
    },
  ]


  render() {
    const title = brand.name + ' - All Communities';
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 100,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const communityId = data[d.dataIndex][0];
          apiCall('/communities.delete', { community_id: communityId });
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
                <h1>Fetching all Communities.  This may take a while...</h1>
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

export default withStyles(styles)(AllCommunities);
