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
import {
  CounterChartWidget,
  // SalesChartWidget,
  CarouselWidget,
  NewsWidget
} from 'dan-components';
import styles from './dashboard-jss';
import { getTestimonialsData, getActionsData, getEventsData } from '../../../api/data';
import { connectRouter } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { reduxLoadSelectedCommunity } from '../../../redux/redux-actions/adminActions';

class SummaryDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { events: [], testimonials: [], actions: [] };
  }

  callForEvents = () => {
    const me = this;
    getEventsData().then(res => {
      me.setState({ events: res.data });
    }).catch(err => {
      console.log(err);
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

  componentDidMount = () => {
    this.callForTestimonials();
    this.callForActions();
    this.callForEvents();
  }
  findCommunityObj = (name) => {
    let section = this.props.communities;
    for (let i = 0; i < section.length; i++) {
      if (section[i].name === name) {
        return section[i];
      }
    }
    return null;
  }

  chooseCommunity = (event) =>{
    let obj = this.findCommunityObj(event.target.value); 
    this.props.selectCommunity(obj); 
    if(obj){
      window.location = `/admin/community/${obj.id}/profile`;
    }
  }

  
  render() {
    const title = brand.name + ' - Summary Dashboard';
    const description = brand.desc;
    const { classes, communities,selected_community } = this.props;
    const community = selected_community? selected_community.name :"Choose a community";
    
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
        <h1 style={{color:"white", fontSize:'2rem',margin:25}}>Super Admin</h1>
        <Grid container className={classes.root}>
      
          <button onClick={() => { this.props.signOut() }}>Signout</button>
          <CounterChartWidget />
        </Grid>
        <div style={{marginTop:60}}>
          <h3>Choose A Community To Manage</h3>
          <TextField
            id="outlined-select-currency"
            select
            label="Select Community"
            className={classes.textField}
            value={community}
            fullWidth
             onChange={option => { this.chooseCommunity(option); }}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Select a community"
            margin="normal"
            variant="outlined"
          >
            {communities.map(option => (
              <MenuItem key={option.id.toString()} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Divider className={classes.divider} />
        {/* <SalesChartWidget /> */}
        <Divider className={classes.divider} />
        <Grid container spacing={24} className={classes.root}>
          <Grid item md={4} xs={12}>
            <CarouselWidget goals={this.state.testimonials} />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <NewsWidget kind="action" dataCollection={this.state.actions} />
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <NewsWidget kind="event" dataCollection={this.state.events} />
          </Grid>

        </Grid>
      </div>
    );
  }
}

SummaryDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(['communities']), 
    selected_community:state.getIn(['selected_community'])
  }
}

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({
    selectCommunity: reduxLoadSelectedCommunity
  },dispatch)
}
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(SummaryDashboard);

export default withStyles(styles)(summaryMapped);
