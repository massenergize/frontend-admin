import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import AppBar from '@material-ui/core/AppBar';
import dummy from 'dan-api/dummy/dummyContents';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import InsertChart from '@material-ui/icons/InsertChart';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import bgCover from 'dan-images/petal_bg.svg';
import styles from 'dan-components/SocialMedia/jss/cover-jss';
import CommunitySwitch from '../Summary/CommunitySwitch';
import {
  Cover,
  About,
  Connection,
  Favorites,
  Pages,
} from './Profile';
import { reduxCallFullCommunity, reduxLiveOrNot } from '../../../redux/redux-actions/adminActions';

function TabContainer(props) {
  const { children } = props;
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class CommunityProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      id: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ id });
      this.props.callCommunity(id);
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
    window.location = `/admin/community/${id}/profile`;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const title = brand.name + ' - Profile';
    const description = brand.desc;
    const { dataProps, classes } = this.props;
    const { value, id } = this.state;
    const community = this.props.full_community ? this.props.full_community : {};

    if(!id){
      return <dvi>Loading Data ...</dvi>
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
        {this.showCommunitySwitch()}
        <Cover
          liveOrNotFxn={this.props.liveOrNot}
          coverImg={bgCover}
          avatar={community && community.logo ? community.logo.url : dummy.user.avatar}
          name={community && (community.name || '')}
          desc={community && (community.about_community || '')}
          community={community}
        />

        <AppBar position="static" className={classes.profileTab}>
          <Hidden mdUp>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab icon={<AccountCircle />} />
              <Tab icon={<SupervisorAccount />} />
              {/* <Tab icon={<Favorite />} /> */}
              <Tab icon={<PhotoLibrary />} />
            </Tabs>
          </Hidden>
          <Hidden smDown>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
              style={{ boxShadow: '0 0px 3px 0 rgba(0,0,0,.18),0 0px 3px 0 rgba(0,0,0,.15)' }}
            >
              <Tab icon={<AccountCircle />} label="ABOUT" />
              <Tab icon={<SupervisorAccount />} label="Subscribers" />
              <Tab icon={<InsertChart />} label="Pages" />
            </Tabs>
          </Hidden>
        </AppBar>
        {value === 0 && <TabContainer><About data={dataProps} community={community} /></TabContainer>}
        {value === 1 && <TabContainer><Connection data={{ users: community.users, avatar: dummy.user.avatar }} /></TabContainer>}
        {value === 2
          && (
            <TabContainer>
              <Pages community={community} />
            </TabContainer>
          )}
      </div>
    );
  }
}

CommunityProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

const reducer = 'socmed';
const mapStateToProps = state => ({
  auth: state.getIn(['auth']),
  force: state, // force state from reducer
  full_community: state.getIn(['full_selected_community'])
  // dataProps: state.getIn([reducer, 'dataTimeline'])
});

const mapDispatchToProps = dispatch => bindActionCreators({
  callCommunity: reduxCallFullCommunity,
  liveOrNot: reduxLiveOrNot,
}, dispatch);

const CommunityProfileMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityProfile);

export default withStyles(styles)(CommunityProfileMapped);
