import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './dashboard-jss';
import SummaryChart from './graph/ChartInfographic';
import ActionsChartWidget from './graph/ActionsChartWidget';
import {
  reduxLoadSelectedCommunity, reduxCheckUser
} from '../../../redux/redux-actions/adminActions';
// import LinearBuffer from '../../../components/Massenergize/LinearBuffer';
class SummaryDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }


  findCommunityObj = (name) => {
    const section = this.props.communities;
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
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


  render() {
    const title = brand.name + ' - Summary Dashboard';
    const description = brand.desc;
    const {
      classes, communities, selected_community, auth, summary_data, graph_data 
    } = this.props;

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

        <Grid container className={classes.root}>
          <SummaryChart data={summary_data} />
        </Grid>
        <Divider className={classes.divider} />

        {graph_data
          && <ActionsChartWidget data={graph_data || {}} />
        }
        <br />
        <br />

      </div>
    );
  }
}

SummaryDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.getIn(['communities']),
  selected_community: state.getIn(['selected_community']),
  summary_data: state.getIn(['summary_data']),
  graph_data: state.getIn(['graph_data']) || {}
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCommunity: reduxLoadSelectedCommunity,
  ifExpired: reduxCheckUser

}, dispatch);
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(SummaryDashboard);

export default withStyles(styles)(summaryMapped);
