import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Grid from '@material-ui/core/Grid';
import {connect} from 'react-redux'; 
import {bindActionCreators} from 'redux';
import {
  BarChart, Bar,
  AreaChart, Area,
  LineChart, Line,
} from 'recharts';
import { data1 } from 'dan-api/chart/chartMiniData';
import colorfull from 'dan-api/palette/colorfull';
import CounterWidget from '../Counter/CounterWidget';
import styles from './widget-jss';
import { getSummaryPageData, getCommunitiesPageData, getTagCollectionsData } from '../../api/data';
import summaryArray from './../../api/data/structuredDataArray';
import { reduxGetAllTags, reduxCallCommunities,reduxGetAllUsers } from '../../redux/redux-actions/adminActions';
class CounterChartWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { summary: [] };
  }

  componentWillMount = () => {
    
    this.props.callUsers();
    this.props.callTags();
    this.props.callCommunities();
    
  }
  componentDidMount() {
    this.fashionData();
  }
  
  summaryArray() {
    const { users,tags,communities} = this.props;
    const arr = [
      {
        title: "Users",
        data: users

      },
      {
        title: "Communities",
        data: communities
      },
      {
        title: "Tag Collections",
        data:tags
      }
    ];
    return arr;
  }
  fashionData = () => {
    const me = this;
    this.summaryArray().forEach(item => {
      let data = item.data;
        const info = {
          start: 0,
          end: data.length,
          duration: 3,
          title: item.title,
          unitBefore: '',
          unitAfter: ''
        }
        me.setState((prev) => {
          return { summary: [...prev.summary, info] }
        })
    });
  }

  renderCards = () => {
    var data = this.state.summary ? this.state.summary : [];

    if (!data) {
      return (<div />);
    }
    return Object.keys(data).map(index => {
      const stat = data[index];
      const icons = [
        <AreaChart width={100} height={60} data={data1}>
          <Area type="monotone" dataKey="uv" stroke="#FFFFFF" fill="rgba(255,255,255,.5)" />
        </AreaChart>,
        <BarChart width={100} height={40} data={data1}>
          <Bar dataKey="uv" fill="#ffffff" />
        </BarChart>,
        <LineChart width={100} height={80} data={data1}>
          <Line type="monotone" dataKey="pv" stroke="#FFFFFF" strokeWidth={2} />
        </LineChart>
      ];

      return (
        <Grid item md={3} xs={6} key={index}>
          <CounterWidget
            color={colorfull[2 * index]}
            start={stat.start}
            end={stat.end}
            duration={1}
            title={stat.title}
            unitBefore={stat.unitBefore}
            unitAfter={stat.unitAfter}

          >
            {icons[index % 3]}
          </CounterWidget>
        </Grid>
      );
    });
  }

  render() {
    const { classes, auth,users } = this.props;
    return (
      <div className={classes.rootCounter}>
        <Grid container spacing={16}>
          {this.renderCards()}
        </Grid>
      </div>
    );
  }
}

CounterChartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps =(state) =>{
  return{
    users:state.getIn(['allUsers']), 
    tags:state.getIn(['allTags']), 
    communities:state.getIn(['communities']), 
    allActions:state.getIn(['allActions']),
  }
}
const mapDispatchToProps = (dispatch) =>{
  return bindActionCreators({
    callUsers: reduxGetAllUsers, 
    callTags: reduxGetAllTags, 
    callCommunities: reduxCallCommunities
  },dispatch);
};

const CounterMapped = connect(mapStateToProps,mapDispatchToProps)(CounterChartWidget)
export default withStyles(styles)(CounterMapped);
