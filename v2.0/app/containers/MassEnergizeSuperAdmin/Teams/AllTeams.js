import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Edit from '@material-ui/icons/Edit';
import Language from '@material-ui/icons/Language';
import Email from '@material-ui/icons/Email';
import messageStyles from 'dan-styles/Messages.scss';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxGetAllTeams, reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './../Summary/CommunitySwitch'; 

class AllTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { teams: [] };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
   
    if (user.is_super_admin) {
      await this.props.callTeamsForSuperAdmin();
    }
    if (user.is_community_admin) {
      var com = this.props.community ? this.props.community : user.communities[0]
      await this.props.callTeamsForNormalAdmin(com.id);
    }
    //await this.setStateAsync({ teams: response.data });
  }

  showCommunitySwitch = ()=>{
    const user= this.props.auth? this.props.auth: {}; 
    if(user.is_community_admin){
      return(
        <CommunitySwitch actionToPerform={this.handleCommunityChange}/>
      )
    }
  }
  handleCommunityChange =(id)=>{
    this.props.callTeamsForNormalAdmin(id);
  }
  // setStateAsync(state) {
  //   return new Promise((resolve) => {
  //     this.setState(state, resolve);
  //   });
  // }

  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Teams" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ?
              <p style={{margin:25}}>Sorry, teams for this community yet!</p>
              :
              null
            }
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <div>
                      <Typography>{n.name}</Typography>
                    </div>
                  </div>
                </TableCell>

                <TableCell align="left">
                  <Typography variant="caption">
                    {n.description}
                  </Typography>
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )

  render() {
    const title = brand.name + ' - All Teams';
    const description = brand.desc;
    const teams = this.props.allTeams;
    const { classes } = this.props;

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
        {this.renderTable(teams, classes)}
      </div>
    );
  }
}

AllTeams.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allTeams: state.getIn(['allTeams']), 
    community:state.getIn(['selected_community'])
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callTeamsForSuperAdmin: reduxGetAllTeams,
    callTeamsForNormalAdmin: reduxGetAllCommunityTeams
  }, dispatch);
}
const TeamsMapped = connect(mapStateToProps, mapDispatchToProps)(AllTeams);

export default withStyles(styles)(TeamsMapped);
