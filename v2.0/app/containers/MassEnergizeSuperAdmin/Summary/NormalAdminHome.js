import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import TableHead from '@material-ui/core/TableHead';
import messageStyles from 'dan-styles/Messages.scss';
import { bindActionCreators } from 'redux';
import styles from './dashboard-jss';
import { reduxLoadSelectedCommunity, reduxCheckUser } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './CommunitySwitch';
import SummaryChart from './graph/ChartInfographic';
import ActionsChartWidget from './graph/ActionsChartWidget';
class NormalAdminHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
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

    getStatus = isApproved => {
      switch (isApproved) {
        case false: return messageStyles.bgError;
        case true: return messageStyles.bgSuccess;
        default: return messageStyles.bgSuccess;
      }
    };


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

  renderTable = (data, classes) => (
    <PapperBlock noMargin title="Communities You Manage" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Community Name</TableCell>
              <TableCell>Subdomain</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Link to={`/admin/community/${n.id}/profile`}>
                      <Avatar alt={n.name} src={n.logo ? n.logo.url : imgApi[21]} className={classes.productPhoto} />
                    </Link>
                    <Link to={`/admin/community/${n.id}/profile`}>
                      <Typography variant="subtitle1">
                        {n.name || ''}
                      </Typography>
                    </Link>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    { n.subdomain }
                    <br />
                    <a href={`http://community.massenergize.org/${n.subdomain}`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
                      Visit Site
                    </a>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.is_approved ? 'Verified' : 'Not Verified'} className={classNames(classes.chip, this.getStatus(n.is_approved))} />
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )


  render() {
    const title = brand.name + ' - Summary Dashboard';
    const description = brand.desc;
    const {
      auth, summary_data, graph_data, classes
    } = this.props;

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
        <h1 style={{color:"white"}}>
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
        {graph_data
          && <ActionsChartWidget data={graph_data || {}} />
        }
        <br />
        <br />
        <Grid item className={classes.root} md={12} xs={12}>
          {this.renderTable(auth.admin_at || [], classes)}
        </Grid>

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
  graph_data: state.getIn(['graph_data']) || {}
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCommunity: reduxLoadSelectedCommunity,
  ifExpired: reduxCheckUser

}, dispatch);
const summaryMapped = connect(mapStateToProps, mapDispatchToProps)(NormalAdminHome);

export default withStyles(styles)(summaryMapped);
