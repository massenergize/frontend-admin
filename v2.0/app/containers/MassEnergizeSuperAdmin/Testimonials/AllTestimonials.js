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
import messageStyles from 'dan-styles/Messages.scss';
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';


class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = { testimonials: [] };
  }

  async componentDidMount() {
    const response = await fetchData('v2/testimonials');
    await this.setStateAsync({ testimonials: response.data });
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



  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Testimonials" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Title</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Is Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Avatar alt={n.user.full_name} src={n.user.profile_picture ? n.user.profile_picture.url : imgApi[21]} className={classes.productPhoto} />
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                      <Typography variant="subtitle1">{n.title}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="subtitle1">{n.user.full_name}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <Avatar alt={n.action.image ? n.action.image.url : imgApi[21]} src={n.avatar} className={classNames(classes.avatar, classes.sm)} />
                    <div>
                      <Typography>{n.action.title}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    { n.vendor ? n.vendor.name : 'None'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.is_approved ? 'Approved' : 'Not Approved'} className={classNames(classes.chip, this.getStatus(n.is_approved))} />
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )

  render() {
    const title = brand.name + ' - All Testimonials';
    const description = brand.desc;
    const { testimonials } = this.state;
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
        {this.renderTable(testimonials, classes)}
      </div>
    );
  }
}

AllTestimonials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllTestimonials);
