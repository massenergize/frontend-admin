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
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Edit from '@material-ui/icons/Edit';
import Language from '@material-ui/icons/Language';
import messageStyles from 'dan-styles/Messages.scss';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';


class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  async componentDidMount() {
    const response = await fetchData('v2/events');
    await this.setStateAsync({ events: response.data });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getLocation = location => {
    if (location) {
      const {
        address1, address2, state, zip, country
      } = location;
      return `${address1 ? address1 + ',' : ''} 
        ${address2 ? address2 + ', ' : ''} 
        ${state ? state + ', ' : ''} 
        ${zip || ''}
        ${country || ''}`;
    }
    return '';
  };

  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Events" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Event Name</TableCell>
              <TableCell>Community</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Is Archived</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Avatar alt={n.name} src={n.image ? n.image.url : imgApi[21]} className={classes.productPhoto} />
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                      <Typography variant="subtitle1">{n.name}</Typography>
                      <a href={`/admin/event/${n.id}/edit`} className={classes.downloadInvoice}>
                        <Edit />
                        &nbsp; Edit this Event
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <Avatar alt={n.community.name} src={n.community.logo ? n.community.logo : imgApi[21]} className={classNames(classes.avatar, classes.sm)} />
                    <div>
                      <Typography>{n.community.name}</Typography>
                      <Typography variant="caption">
                        <a href={`http:${n.community.subdomain}.massenergize.org`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
                          <Language />
                          &nbsp;
                          Visit site
                        </a>
                        &nbsp;
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    { Date.parse(n.start_date_and_time) }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.is_archived ? 'Yes' : 'No'} className={classNames(classes.chip, this.getStatus(n.is_archived))} />
                </TableCell>
                <TableCell>
                  <div className={classes.taskStatus}>
                    <Icon className={classes.taskIcon}>{n.is_geographically_focused ? 'location_on' : 'blur_on'}</Icon>
                    <Typography variant="caption">
                      {this.getLocation(n.location)}
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
    const title = brand.name + ' - All Events';
    const description = brand.desc;
    const { events } = this.state;
    const { classes } = this.props;


    if (!events || events.length === 0) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={this.props.classes.root}>
              <div className={this.props.classes.root}>
                <LinearProgress />
                <h1>Fetching all Events.  This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
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
        {this.renderTable(events, classes)}
      </div>
    );
  }
}

AllEvents.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllEvents);
