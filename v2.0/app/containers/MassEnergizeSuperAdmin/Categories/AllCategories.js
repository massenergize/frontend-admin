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
import { fetchData } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllTagCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tagCollections: [] };
  }

  async componentDidMount() {
    const response = await fetchData('v2/tag-collections');
    await this.setStateAsync({ tagCollections: response.data });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Tag Collections" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Is Global</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="subtitle1">{n.name}</Typography>
                      {/* <a href={`/admin/category/${n.id}/edit`} className={classes.downloadInvoice}>
                        <Edit />
                        &nbsp; Edit
                      </a> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    { n.is_global ? 'Global' : 'Not Global' }
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={classes.taskStatus}>
                    <Icon className={classes.taskIcon}>{n.is_geographically_focused ? 'location_on' : 'blur_on'}</Icon>
                    {n.tags.map(t => (
                      <Typography key={t.id} variant="caption">
                        { t.name }
                        ,&nbsp;&nbsp;
                      </Typography>
                    ))}
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
    const title = brand.name + ' - All Tag Collections';
    const description = brand.desc;
    const { tagCollections } = this.state;
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

        {this.renderTable(tagCollections, classes)}

      </div>
    );
  }
}

// export default AllActions;

AllTagCollections.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllTagCollections);
