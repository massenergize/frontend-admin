import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Edit from '@material-ui/icons/Edit';
import Language from '@material-ui/icons/Language';
import Email from '@material-ui/icons/Email';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { bindActionCreators } from 'redux';
import { reduxGetAllTeams, reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from "../Summary/CommunitySwitch";
import { apiCall } from '../../../utils/messenger';

class AllTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};

    if (user.is_super_admin) {
      await this.props.callTeamsForSuperAdmin();
    }
    if (user.is_community_admin) {
      let com = this.props.community ? this.props.community : user.admin_at[0];
      const teams = await this.props.callTeamsForNormalAdmin(com.id);
      await this.setStateAsync({ data: this.fashionData(teams.data) });
    }
    await this.setStateAsync({ loading: false });
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

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth: {};
    if (user.is_community_admin) {
      return (
        <CommunitySwitch actionToPerform={this.handleCommunityChange} />
      );
    }
  }

  handleCommunityChange =(id) => {
    this.props.callTeamsForNormalAdmin(id);
  }

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map(d => (
      [
        {
          id: d.id,
          image: d.logo,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        `${d.description}...`.substring(0, 20), // limit to first 20 chars
        d.community && d.community.name,
        d.id
      ]
    ));
    return fashioned;
  }


  getColumns = () => [
    {
      name: 'TeamID',
      key: 'id',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Link to={`/admin/community/${d.id}/profile`}><Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} /></Link>
            }
            {!d.image
              && <Link to={`/admin/community/${d.id}/profile`}><Avatar style={{ margin: 10 }}>{d.initials}</Avatar></Link>
            }
          </div>
        )
      }
    },
    {
      name: 'Name',
      key: 'name',
      options: {
        filter: true,
      }
    },
    {
      name: 'About',
      key: 'about',
      options: {
        filter: false,
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
      name: 'Edit?',
      key: 'edit_or_copy',
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/team`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            {/* <Link
              onClick={async () => {
                const copiedEventResponse = await apiCall('/events.copy', { event_id: id });
                if (copiedEventResponse && copiedEventResponse.success) {
                  const newEvent = copiedEventResponse && copiedEventResponse.data;
                  window.location.href = `/admin/edit/${newEvent.id}/event`;
                }
              }}
              to="/admin/read/events"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link> */}
          </div>
        )
      }
    },
  ]


  // renderTable = (data, classes) => (
  //   <PapperBlock noMargin title="All Teams" icon="ios-share-outline" whiteBg desc="">
  //     <div className={classes.root}>
  //       <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell padding="dense">ID</TableCell>
  //             <TableCell>Name</TableCell>
  //             <TableCell>Description</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data.length === 0 ?
  //             <p style={{margin:25}}>Sorry, teams for this community yet!</p>
  //             :
  //             null
  //           }
  //           {data.map(n => ([
  //             <TableRow key={n.id}>
  //               <TableCell padding="dense">
  //                 <div className={classes.flex}>
  //                   <div>
  //                     <Typography variant="caption">{n.id}</Typography>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell>
  //                 <div className={classes.flex}>
  //                   <div>
  //                     <Typography>{n.name}</Typography>
  //                   </div>
  //                 </div>
  //               </TableCell>

  //               <TableCell align="left">
  //                 <Typography variant="caption">
  //                   {n.description}
  //                 </Typography>
  //               </TableCell>
  //             </TableRow>
  //           ]))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </PapperBlock>
  // )

  render() {
    const title = brand.name + ' - All Teams';
    const description = brand.desc;
    const { columns, loading } = this.state;
    const data = this.fashionData(this.props.allTeams);
    const { classes } = this.props;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const teamId = data[d.index][0].id;
          apiCall('/teams.delete', { team_id: teamId });
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
        {this.showCommunitySwitch()}
        {/* {this.renderTable(teams, classes)} */}
        <div className={classes.table}>
          <MUIDataTable
            title="All Teams"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
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
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callTeamsForSuperAdmin: reduxGetAllTeams,
    callTeamsForNormalAdmin: reduxGetAllCommunityTeams
  }, dispatch);
}
const TeamsMapped = connect(mapStateToProps, mapDispatchToProps)(AllTeams);

export default withStyles(styles)(TeamsMapped);
