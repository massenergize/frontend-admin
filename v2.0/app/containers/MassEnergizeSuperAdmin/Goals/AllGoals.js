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


class AllGoals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { goals: [] };
  }

  async componentDidMount() {
    const response = await fetchData('v2/goals');
    await this.setStateAsync({ goals: response.data });
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
    <PapperBlock noMargin title="All Goals" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
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
                <TableCell>
                  <div className={classes.flex}>
                    <div>
                      <Typography>{n.name}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    <Chip label={n.status} className={classNames(classes.chip, this.getStatus(n.status === 'COMPLETE'))} />
                  </Typography>
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
    const title = brand.name + ' - All Goals';
    const description = brand.desc;
    const { goals } = this.state;
    const { classes } = this.props;

    console.log(goals);

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
        {this.renderTable(goals, classes)}
      </div>
    );
  }
}

AllGoals.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllGoals);
