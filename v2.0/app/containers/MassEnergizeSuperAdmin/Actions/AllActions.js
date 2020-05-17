/* eslint-disable react/prop-types */
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
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllActions, reduxGetAllCommunityActions, loadAllActions } from '../../../redux/redux-actions/adminActions';
import LinearBuffer from '../../../components/Massenergize/LinearBuffer';

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true,
      allActions: [],
      data: []
    };
  }


  async componentDidMount() {
    const allActionsResponse = await apiCall('/actions.listForCommunityAdmin');
    if (allActionsResponse && allActionsResponse.success) {
      loadAllActions(allActionsResponse.data);
      await this.setStateAsync({ loading: false, allActions: allActionsResponse.data, data: this.fashionData(allActionsResponse.data) });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  changeActions = async (id) => {
    const { allActions } = this.state;
    const newData = allActions.filter(a => (a.community && (a.community.id === id)) || a.is_global);
    await this.setStateAsync({ data: this.fashionData(newData) });
  }

  fashionData =(data) => {
    const fashioned = data.map(d => (
      [
        d.id,
        {
          id: d.id,
          image: d.image,
          initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`
        },
        `${d.title}...`.substring(0, 30), // limit to first 30 chars
        { rank: d.rank, id: d.id },
        `${d.tags.map(t => t.name).join(', ')} `,
        (d.is_global ? 'Template' : (d.community && d.community.name)),
        d.is_published ? 'Yes' : 'No',
        d.id
      ]
    ));
    return fashioned;
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
      name: 'Image',
      key: 'image',
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
        filter: false,
        filterType: 'textField'
      }
    },
    {
      name: 'Rank',
      key: 'rank',
      options: {
        filter: false,
        customBodyRender: (d) => (
          <TextField
            required
            name="rank"
            variant="outlined"
            onChange={async event => {
              const { target } = event;
              if (!target) return;
              const { name, value } = target;
              await apiCall('/actions.update', { action_id: d && d.id, [name]: value });
            }}
            label="Rank"
            InputLabelProps={{
              shrink: true,
              maxwidth: '10px'
            }}
            defaultValue={d && d.rank}
          />
        )
      }
    },
    {
      name: 'Tags',
      key: 'tags',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
        filterType: 'multiselect'
      }
    },
    {
      name: 'Is Live?',
      key: 'is_live',
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
            <Link to={`/admin/edit/${id}/action`} target="_blank">
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
    const { classes } = this.props;
    const { columns, loading, data } = this.state;

    if (loading) {
      return <LinearBuffer />;
    }

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(async d => {
          const actionId = data[d.dataIndex][0];
          await apiCall('/actions.delete', { action_id: actionId });
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
          {/* {this.showCommunitySwitch()} */}
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

const mapStateToProps = (state) => ({
  auth: state.getIn(['auth']),
  allActions: state.getIn(['allActions']),
  community: state.getIn(['selected_community'])
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  callAllActions: reduxGetAllActions,
  callCommunityActions: reduxGetAllCommunityActions
}, dispatch);
const ActionsMapped = connect(mapStateToProps, mapDispatchToProps)(AllActions);
export default withStyles(styles)(ActionsMapped);
