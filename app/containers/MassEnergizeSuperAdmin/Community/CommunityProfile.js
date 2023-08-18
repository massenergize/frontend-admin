import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import dummy from "dan-api/dummy/dummyContents";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Hidden from "@mui/material/Hidden";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhotoLibrary from "@mui/icons-material/PhotoLibrary";
import InsertChart from "@mui/icons-material/InsertChart";
import { withStyles } from "@mui/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import bgCover from "dan-images/petal_bg.svg";
import styles from "dan-components/SocialMedia/jss/cover-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { Cover, About, Pages } from "./Profile";
import {
  reduxCallFullCommunity,
  reduxLiveOrNot,
} from "../../../redux/redux-actions/adminActions";
import Seo from "../../../components/Seo/Seo";

function TabContainer(props) {
  const { children } = props;
  return <div style={{ paddingTop: 8 * 3 }}>{children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class CommunityProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      id: null,
    };
  }

  async componentDidMount() {
    const id = this.props.id || this.props.match.params.id;
    if (id) {
      this.setState({ id });
      this.props.callCommunity(id);
    }
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
  };

  handleCommunityChange = (id) => {
    window.location = `/admin/community/${id}/profile`;
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { dataProps, classes } = this.props;
    const { value } = this.state;
    const community = this.props.full_community
      ? this.props.full_community
      : {};

    if (!community) {
      return <div>Loading Data ...</div>;
    }
    return (
      <div>
        <Seo name={`${community?.name} - Profile`} />
        {this.showCommunitySwitch()}
        <Cover
          liveOrNotFxn={this.props.liveOrNot}
          coverImg={bgCover}
          avatar={
            community && community.logo ? community.logo.url : dummy.user.avatar
          }
          name={community && (community.name || "")}
          desc={community && (community.about_community || "")}
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
            >
              <Tab icon={<AccountCircle />} label="ABOUT" />
              <Tab icon={<InsertChart />} label="Pages" />
            </Tabs>
          </Hidden>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <About data={dataProps} community={community} />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <Pages community={community} />
          </TabContainer>
        )}
      </div>
    );
  }
}

CommunityProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  force: state, // force state from reducer
  full_community: state.getIn(["full_selected_community"]),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callCommunity: reduxCallFullCommunity,
      liveOrNot: reduxLiveOrNot,
    },
    dispatch
  );

const CommunityProfileMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityProfile);

export default withStyles(styles)(CommunityProfileMapped);
