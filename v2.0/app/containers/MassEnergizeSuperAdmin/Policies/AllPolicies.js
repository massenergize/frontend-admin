import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import brand from 'dan-api/dummy/brand';
import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllPolicies extends React.Component {


  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), data: [] };
  }


  async componentDidMount() {
    const allPolicysResponse = await apiCall('/policies.listForSuperAdmin');
    if (allPolicysResponse && allPolicysResponse.success) {
      const data = allPolicysResponse.data.map(d => (
        [
          d.id,
          d.name,
          `${d.description && d.description.substring(0, 30)}...`,
          d.community && d.community.name,
          d.is_published,
          d.id
        ]
      ));
      console.log(allPolicysResponse.data);
      await this.setStateAsync({ data });
    }
  }

  getColumns = () => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: true
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
      name: 'Description',
      key: 'actions',
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
      name: 'Is Published',
      key: 'carbon',
      options: {
        filter: true,
      }
    },
    {
      name: 'Actions',
      key: 'actions',
      options: {
        filter: true,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/policy`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedPolicyResponse = await apiCall('/policies.copy', { policy_id: id });
                const newPolicy = copiedPolicyResponse && copiedPolicyResponse.data;
                if (newPolicy) {
                  window.location.href = '/admin/read/policies';
                }
              }}
              to="/admin/read/policies"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const title = brand.name + ' - All Policies';
    const description = brand.desc;
    const { columns, data } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      page: 1,
      indexColumn: 'id',
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const policyId = data[d.index][0];
          apiCall('/policies.delete', { policy_id: policyId });
        });
      }
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

export default withStyles(styles)(AllPolicies);
