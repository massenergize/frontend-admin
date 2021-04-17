import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllCommunityTestimonials, reduxGetAllTestimonials } from '../../../redux/redux-actions/adminActions';

class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true
    };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      await this.props.callTestimonialsForSuperAdmin();
    }
    if (user.is_community_admin) {
      const com = this.props.community ? this.props.community : user.admin_at[0];
      if (com) {
        await this.props.callTestimonialsForNormalAdmin(com.id);
      }
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  fashionData = (data) => {
    return data.map(d => (
      [
        d.created_at,
        `${d.title}...`.substring(0, 30), // limit to first 30 chars
        { rank: d.rank, id: d.id },
        (d.community && d.community.name),
        (d.is_approved && d.is_published ? 'Yes' : 'No'),
        `${d.user ? d.user.full_name : ''}...`.substring(0, 20), // limit to first 20 chars
        `${d.action ? d.action.title : ''} ${d.action && d.action.community ? ` -  (${d.action.community.name})` : ''}...`.substring(0, 20),
        d.id
      ]
    ));
  }


  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };


  getColumns = () => [
    {
      name: 'Date',
      key: 'date',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Title',
      key: 'title',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Rank',
      key: 'rank',
      options: {
        filter: false,
        customBodyRender: (d) => d && (
          <TextField
            key={d.id}
            required
            name="rank"
            variant="outlined"
            onChange={async event => {
              const { target } = event;
              if (!target) return;
              const { name, value } = target;
              await apiCall('/testimonials.update', { testimonial_id: d && d.id, [name]: value });
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
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
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
      name: 'User',
      key: 'user',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Action',
      key: 'action',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Edit',
      key: 'edit_or_copy',
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/testimonial`} target="_blank">
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            {/* <Link
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
            </Link> */}
          </div>
        )
      }
    },
  ]


  render() {
    const title = brand.name + ' - All Testimonials';
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allTestimonials);
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 100,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const testimonialId = data[d.dataIndex][0];
          apiCall('/testimonials.delete', { testimonial_id: testimonialId });
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
            title="All Testimonials"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllTestimonials.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allTestimonials: state.getIn(['allTestimonials']),
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callTestimonialsForSuperAdmin: reduxGetAllTestimonials,
    callTestimonialsForNormalAdmin: reduxGetAllCommunityTestimonials
  }, dispatch);
}
const TestimonialsMapped = connect(mapStateToProps, mapDispatchToProps)(AllTestimonials);

export default withStyles(styles)(TestimonialsMapped);
