import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';

import MUIDataTable from 'mui-datatables';
// import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar';
// import Icon from '@material-ui/core/Icon';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllCommunityTestimonials, reduxGetAllTestimonials } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';
class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      data: [],
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
      await this.props.callTestimonialsForNormalAdmin(null);
    }
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return (
        <CommunitySwitch actionToPerform={this.handleCommunityChange} />
      );
    }
  }

  handleCommunityChange =(id) => {
    this.props.callTestimonialsForNormalAdmin(id);
  }

  fashionData = (data) => {
    return data.map(d => (
      [
        d.id,
        {
          id: d.id,
          is_live: d.is_published && d.is_approved,
          image: d.image,
          initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`
        },
        `${d.title}...`.substring(0, 30), // limit to first 30 chars
        d.rank,
        (d.community && d.community.name),
        `${d.user ? d.user.full_name : ''}...`.substring(0, 20), // limit to first 20 chars
        `${d.action ? d.action.title : ''} ${d.action && d.action.community ? ` -  (${d.action.community.name})` : ''}...`.substring(0, 20),
        `${d.tags && d.tags.map(t => t.name).join(', ')}`,
        d.id
      ]
    ));
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
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
      name: 'ID',
      key: 'id',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Image',
      key: 'Image',
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
        filterType: 'textField'
      }
    },
    {
      name: 'Rank',
      key: 'rank',
      options: {
        filter: false,
        filterType: 'textField'
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
      name: 'Tags',
      key: 'tags',
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
            <Link to={`/admin/edit/${id}/testimonial`}>
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
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const testimonialId = data[d.index][0];
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
