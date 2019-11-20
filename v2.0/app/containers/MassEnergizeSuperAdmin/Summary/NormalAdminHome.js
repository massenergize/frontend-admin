import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {
  CounterChartWidget,
  SalesChartWidget,
  CarouselWidget,
  NewsWidget
} from 'dan-components';
import { connectRouter } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import styles from './dashboard-jss';
import { getTestimonialsData, getActionsData, getEventsData } from '../../../api/data';
import { reduxLoadSelectedCommunity, reduxIfExpired, reduxCheckUser } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './CommunitySwitch';
import SummaryChart from './graph/ChartInfographic';
import ActionsChartWidget from './graph/ActionsChartWidget';
class NormalAdminHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { events: [], testimonials: [], actions: [] };
  }

  callForEvents = () => {
    const me = this;
    getEventsData().then(res => {
      console.log('i am the events', res);
      me.setState({ events: res.data });
    }).catch(err => {

    });
  }

  callForTestimonials = () => {
    const me = this;
    getTestimonialsData().then(res => {
      me.setState({ testimonials: res.data });
    }).catch(err => {
      console.log(err);
    });
  }

  callForActions = () => {
    const me = this;
    getActionsData().then(res => {
      me.setState({ actions: res.data });
    }).catch(err => {
      console.log(err);
    });
  }

  findCommunityObj = (id) => {
    const { auth } = this.props;
    const section = auth ? auth.admin_at : [];
    for (let i = 0; i < section.length; i++) {
      console.log(section[i].id, id);
      if (section[i].id === id) {
        return section[i];
      }
    }
    return null;
  }

  chooseCommunity = (event) => {
    const obj = this.findCommunityObj(event.target.value);
    this.props.selectCommunity(obj);
    if (obj) {
      window.location = `/admin/community/${obj.id}/profile`;
    }
  }


  handleCommunityChange = async (id) => {
    if (!id) return;
    const obj = this.findCommunityObj(id);
    this.props.selectCommunity(obj);
    if (obj) {
      window.location = `/admin/community/${obj.id}/profile`;
    }
  }


  showCommunitySwitch = () => {
    const { auth } = this.props;
    const user = auth || {};
    if (user.is_community_admin) {
      return (
        <CommunitySwitch actionToPerform={this.handleCommunityChange} />
      );
    }
    return <div />;
  }

  render() {
    const title = brand.name + ' - Summary Dashboard';
    const description = brand.desc;
    const {  auth, summary_data, graph_data, classes } = this.props;
    const firstComm = (auth.admin_at || [])[0];
    const firstCommId = firstComm && firstComm.id;
    if (!firstCommId) {
      this.showCommunitySwitch();
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
        <h1>
          Howdy Community Admin
          <span role="img" aria-label="smiley">
            😊
          </span>
        </h1>
        {/* {this.showCommunitySwitch()} */}
        <Grid container className={classes.root}>
          <SummaryChart data={summary_data} />
        </Grid>
        <Divider className={classes.divider} />
        {graph_data && 
          <ActionsChartWidget data={graph_data || {}} />
        }
      </div>
    );
  }
}

NormalAdminHome.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.getIn(['auth']),
  // communities: state.getIn(['communities']),
  selected_community: state.getIn(['selected_community']),
  summary_data: state.getIn(['summary_data']),
  graph_data: state.getIn(['graph_data'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCommunity: reduxLoadSelectedCommunity,
  ifExpired: reduxCheckUser

}, dispatch);
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(NormalAdminHome);

export default withStyles(styles)(summaryMapped);
