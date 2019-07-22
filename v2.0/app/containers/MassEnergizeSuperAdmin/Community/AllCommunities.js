import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock, TableWidget } from 'dan-components';
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
import Create from '@material-ui/icons/Create';
import messageStyles from 'dan-styles/Messages.scss';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';


class AllCommunities extends React.Component {
  constructor() {
    super();
    this.state = { communities: [] };
  }

  async componentDidMount() {
    const response = await fetchData('v2/communities');
    await this.setStateAsync({ communities: response.data });
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
      default: return messageStyles.bgDefault;
    }
  };


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Communities" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Community Name</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Is Dispersed?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Avatar alt={n.name} src={n.logo ? n.logo.file : imgApi[21]} className={classes.productPhoto} />
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                      <Typography variant="subtitle1">{n.name}</Typography>
                      <a href={`/edit/community/${n.id}`} className={classes.downloadInvoice}>
                        <Create />
                        &nbsp; Edit this Community
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    {/* <Avatar alt={n.owner_name} src={n.avatar} className={classNames(classes.avatar, classes.sm)} /> */}
                    <div>
                      <Typography>{n.owner_name}</Typography>
                      <Typography variant="caption">
                                Admin Email:&nbsp;
                        {n.owner_email}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="button">
                    {/* {n.total} */}
                    { 100 }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.is_approved ? 'Verified' : 'Not Verified'} className={classNames(classes.chip, this.getStatus(n.status))} />
                </TableCell>
                <TableCell>
                  <div className={classes.taskStatus}>
                    <Icon className={classes.taskIcon}>{n.type}</Icon>
                    <Typography variant="caption">
                      {n.is_geographically_focused ? 'Geographically Focused' : 'Geographically Dispersed'}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )


  render() {
    const title = brand.name + ' - All Communities';
    const description = brand.desc;
    const { communities } = this.state;
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
        {this.renderTable(communities, classes)}
      </div>
    );
  }
}

AllCommunities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllCommunities);
